'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimation } from '@/context/AnimationContext';

export default function ScentNoteRings() {
  const topRing = useRef();
  const heartRing = useRef();
  const baseRing = useRef();
  const { settings } = useAnimation();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (topRing.current) {
      topRing.current.rotation.z = time * 0.2;
      topRing.current.rotation.x = Math.sin(time * 0.5) * 0.1 + 1.2;
    }
    if (heartRing.current) {
      heartRing.current.rotation.z = -time * 0.15;
      heartRing.current.rotation.y = Math.cos(time * 0.4) * 0.15;
    }
    if (baseRing.current) {
      baseRing.current.rotation.z = time * 0.1;
      baseRing.current.rotation.x = Math.cos(time * 0.3) * 0.1 + 1.4;
    }
  });

  const goldColor = settings.particleColor || '#d4af37';

  return (
    <group position={[0, -0.2, 0]}>
      {/* Top Notes Ring */}
      <group ref={topRing} position={[0, 1.0, 0]}>
        <Torus args={[1.5, 0.008, 16, 64]}>
          <meshBasicMaterial color={goldColor} transparent opacity={0.35} />
        </Torus>
      </group>

      {/* Heart Notes Ring */}
      <group ref={heartRing} position={[0, 0, 0]}>
        <Torus args={[1.8, 0.01, 16, 64]}>
          <meshBasicMaterial color={goldColor} transparent opacity={0.45} />
        </Torus>
      </group>

      {/* Base Notes Ring */}
      <group ref={baseRing} position={[0, -0.9, 0]}>
        <Torus args={[2.1, 0.008, 16, 64]}>
          <meshBasicMaterial color={goldColor} transparent opacity={0.3} />
        </Torus>
      </group>
    </group>
  );
}
