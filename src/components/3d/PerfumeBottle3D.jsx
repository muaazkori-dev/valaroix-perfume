'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimation } from '@/context/AnimationContext';

export default function PerfumeBottle3D({ scrollProgress = 0, enableMouseTilt = false }) {
  const bottleGroup = useRef();
  const liquidMesh = useRef();
  const { settings } = useAnimation();

  // Load custom logo texture for the bottle medallion plaque
  const logoTexture = useTexture('/logo.jpg');

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

    // Smooth, gentle luxury auto-rotation (constant slow speed without cursor disruption)
    if (settings.autoRotate !== false) {
      bottleGroup.current.rotation.y += delta * 0.35 * (settings.rotationSpeed || 1);
    }

    // Optional mouse tilt (disabled by default on Hero stage as requested)
    if (enableMouseTilt) {
      const targetX = state.pointer.y * 0.15;
      const targetY = state.pointer.x * 0.2;
      bottleGroup.current.rotation.x = THREE.MathUtils.lerp(bottleGroup.current.rotation.x, targetX, 0.04);
      bottleGroup.current.rotation.y += targetY * 0.01;
    } else {
      // Keep bottle perfectly upright during ambient rotation
      bottleGroup.current.rotation.x = THREE.MathUtils.lerp(bottleGroup.current.rotation.x, 0, 0.05);
    }

    // Subtle liquid wave
    if (liquidMesh.current) {
      liquidMesh.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.015;
    }
  });

  const goldColor = getMetalColor();

  return (
    <Float
      speed={settings.floatSpeed ? settings.floatSpeed * 1.2 : 1.2}
      rotationIntensity={0.1}
      floatIntensity={0.25}
    >
      <group ref={bottleGroup} position={[0, -0.2, 0]} scale={[1.1, 1.1, 1.1]}>
        
        {/* 1. CRYSTAL GLASS BOTTLE BODY */}
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

        {/* 2. LIQUID FRAGRANCE INSIDE BOTTLE */}
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

        {/* 3. METALLIC GOLD SPRAY COLLAR & ATOMIZER */}
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

        {/* 4. FACETED CRYSTAL GLASS CAP */}
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

        {/* 5. CUSTOM BRAND EMBLEM LABEL MEDALLION (Renders your logo/image) */}
        <group position={[0, 0.1, 1.07]}>
          {/* Metallic Gold Outer Frame */}
          <mesh castShadow>
            <boxGeometry args={[1.35, 0.75, 0.04]} />
            <meshStandardMaterial
              color={goldColor}
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>

          {/* Logo Texture Printed Label Face */}
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[1.25, 0.65]} />
            <meshStandardMaterial
              map={logoTexture}
              roughness={0.2}
              metalness={0.1}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}
