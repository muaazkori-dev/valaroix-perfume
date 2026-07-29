'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { useAnimation } from '@/context/AnimationContext';
import PerfumeBottle3D from './PerfumeBottle3D';
import GoldParticleField from './GoldParticleField';

export default function ValaroixBottleCanvas({ scrollProgress = 0, interactive = false, enableMouseTilt = false }) {
  const { settings } = useAnimation();
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);

  // Pause WebGL rendering when scrolled out of view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative touch-pan-y overflow-hidden">
      {isInView && (
        <Canvas
          camera={{
            position: [0, 0.2, 5.5],
            fov: settings.cameraFOV || 45,
            near: 0.1,
            far: 50
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          dpr={[1, 1.25]}
          style={{ touchAction: 'pan-y' }}
        >
          <ambientLight intensity={settings.ambientIntensity || 0.8} />
          
          <spotLight
            position={[4, 6, 5]}
            angle={0.6}
            penumbra={0.8}
            intensity={settings.spotlightIntensity || 3.5}
            color={settings.spotlightColor || '#f3e5ab'}
          />

          <spotLight
            position={[-4, 3, -4]}
            angle={0.8}
            penumbra={1}
            intensity={2.0}
            color="#ffffff"
          />

          <Environment preset={settings.environmentPreset || 'city'} />

          <Suspense fallback={null}>
            <PerfumeBottle3D scrollProgress={scrollProgress} enableMouseTilt={false} />
            <GoldParticleField />

            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={4}
              blur={1.5}
              far={3}
              color="#000000"
              frames={1}
            />
          </Suspense>

          {interactive && (
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              maxPolarAngle={Math.PI / 2 + 0.1}
              minPolarAngle={Math.PI / 3}
              rotateSpeed={0.8}
            />
          )}
        </Canvas>
      )}
    </div>
  );
}
