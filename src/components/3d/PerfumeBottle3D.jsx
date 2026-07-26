'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimation } from '@/context/AnimationContext';

export default function PerfumeBottle3D({ scrollProgress = 0 }) {
  const bottleGroup = useRef();
  const liquidMesh = useRef();
  const { settings } = useAnimation();

  // Color mappings for metallic accents
  const getMetalColor = () => {
    switch (settings.metalFinish) {
      case 'rose-gold':
        return '#e0a96d';
      case 'chrome':
        return '#e2e8f0';
      case 'obsidian-gold':
        return '#4a3b10';
      default:
        return '#d4af37'; // gold
    }
  };

  useFrame((state, delta) => {
    if (!bottleGroup.current) return;

    // Smooth Auto Rotation
    if (settings.autoRotate) {
      bottleGroup.current.rotation.y += delta * 0.4 * settings.rotationSpeed;
    }

    // Interactive mouse tilt response with lerp for 60fps smoothness
    const targetX = state.pointer.y * 0.2 * settings.tiltSensitivity;
    const targetY = state.pointer.x * 0.3 * settings.tiltSensitivity;
    
    bottleGroup.current.rotation.x = THREE.MathUtils.lerp(bottleGroup.current.rotation.x, targetX, 0.05);
    bottleGroup.current.rotation.y += targetY * 0.01;

    // Gentle liquid wave animation
    if (liquidMesh.current) {
      liquidMesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.02;
    }
  });

  const goldColor = getMetalColor();

  return (
    <Float
      speed={settings.floatSpeed * 1.5}
      rotationIntensity={0.15 * settings.floatSpeed}
      floatIntensity={0.35 * settings.floatSpeed}
    >
      <group ref={bottleGroup} position={[0, -0.2, 0]} scale={[1.1, 1.1, 1.1]}>
        
        {/* ------------------------------------------------------------- */}
        {/* 1. ULTRA-FAST HIGH PERFORMANCE PHYSICAL CRYSTAL GLASS BOTTLE  */}
        {/* ------------------------------------------------------------- */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.05, 2.6, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={settings.glassTransmission || 0.95}
            opacity={1.0}
            transparent={true}
            roughness={settings.glassRoughness || 0.03}
            metalness={0.0}
            ior={settings.glassRefractionIndex || 1.5}
            reflectivity={0.9}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* ------------------------------------------------------------- */}
        {/* 2. LIQUID FRAGRANCE INSIDE BOTTLE                              */}
        {/* ------------------------------------------------------------- */}
        <mesh ref={liquidMesh} position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.94, 0.9, 1.8, 28]} />
          <meshPhysicalMaterial
            color={settings.liquidColor || '#d4af37'}
            emissive={settings.liquidColor || '#d4af37'}
            emissiveIntensity={0.2}
            transmission={0.35}
            opacity={0.9}
            transparent={true}
            roughness={0.08}
            ior={1.33}
          />
        </mesh>

        {/* ------------------------------------------------------------- */}
        {/* 3. METALLIC GOLD SPRAY COLLAR & ATOMIZER                      */}
        {/* ------------------------------------------------------------- */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.55, 0.3, 24]} />
          <meshStandardMaterial
            color={goldColor}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        <mesh position={[0, 1.65, 0]}>
          <cylinderGeometry args={[0.22, 0.24, 0.25, 24]} />
          <meshStandardMaterial
            color={goldColor}
            metalness={0.98}
            roughness={0.1}
          />
        </mesh>

        {/* ------------------------------------------------------------- */}
        {/* 4. FACETED CRYSTAL GLASS CAP                                  */}
        {/* ------------------------------------------------------------- */}
        <mesh position={[0, 2.05, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.65, 0.65, 8]} />
          <meshPhysicalMaterial
            color={goldColor}
            transmission={0.9}
            transparent={true}
            roughness={0.02}
            ior={1.6}
            clearcoat={1.0}
          />
        </mesh>

        <mesh position={[0, 1.9, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
          <meshStandardMaterial color={goldColor} metalness={0.95} roughness={0.1} />
        </mesh>

        {/* ------------------------------------------------------------- */}
        {/* 5. EMBOSSED GOLD VALAROIX LOGO MEDALLION                       */}
        {/* ------------------------------------------------------------- */}
        <group position={[0, 0.1, 1.07]}>
          <mesh castShadow>
            <boxGeometry args={[1.3, 0.7, 0.04]} />
            <meshStandardMaterial
              color={goldColor}
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>

          <mesh position={[0, 0, 0.022]}>
            <boxGeometry args={[1.2, 0.6, 0.01]} />
            <meshStandardMaterial color="#0b0b0e" metalness={0.3} roughness={0.4} />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
