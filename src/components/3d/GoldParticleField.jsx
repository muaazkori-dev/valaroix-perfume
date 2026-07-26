'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAnimation } from '@/context/AnimationContext';

export default function GoldParticleField() {
  const pointsRef = useRef();
  const { settings } = useAnimation();

  // Generate fixed static particle positions in 3D space
  const positions = useMemo(() => {
    const count = settings.particleCount || 100;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 1.6 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }

    return pos;
  }, [settings.particleCount]);

  // Hardware GPU Group Rotation (Zero CPU Overhead)
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const speed = settings.particleSpeed || 0.8;
    pointsRef.current.rotation.y += delta * 0.15 * speed;
    pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={settings.particleSize || 0.07}
        color={settings.particleColor || '#d4af37'}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
