'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  // 3D Motion Settings
  autoRotate: true,
  rotationSpeed: 1.2, // 0.1 to 5.0
  tiltSensitivity: 1.5, // 0 to 3.0
  floatSpeed: 1.0, // 0.2 to 3.0
  scrollZoomIntensity: 1.2, // 0 to 3.0
  cameraFOV: 45, // 30 to 75

  // Atmosphere & Particles
  particleCount: 150, // 20 to 400
  particleSpeed: 0.8, // 0.1 to 3.0
  particleSize: 0.08, // 0.02 to 0.25
  particleColor: '#d4af37',
  backgroundStyle: 'obsidian', // obsidian, emerald, rose, midnight

  // Lighting & Shadows
  spotlightIntensity: 3.5, // 0 to 8
  spotlightColor: '#f3e5ab',
  ambientIntensity: 0.8, // 0.1 to 2.5
  environmentPreset: 'city', // city, studio, sunset, night

  // Materials & Perfume Bottle
  liquidColor: '#d4af37', // Golden Amber
  glassRoughness: 0.05, // 0 to 0.5
  glassTransmission: 0.95, // 0.5 to 1.0
  glassRefractionIndex: 1.52, // 1.1 to 2.0
  metalFinish: 'gold', // gold, rose-gold, chrome, obsidian-gold
  embossOpacity: 0.9,

  // Branding & Content
  heroTitle: "L'Elixir De Distinction",
  heroSubtitle: "Crafted in Grasse. Encased in Pure Crystal.",
  activeThemeName: "Obsidian Gold"
};

export const presets = {
  obsidian: {
    name: "Obsidian Gold",
    backgroundStyle: 'obsidian',
    liquidColor: '#d4af37',
    particleColor: '#d4af37',
    metalFinish: 'gold',
    spotlightColor: '#f3e5ab',
    rotationSpeed: 1.2,
  },
  emerald: {
    name: "Emerald Oud",
    backgroundStyle: 'emerald',
    liquidColor: '#10b981',
    particleColor: '#6ee7b7',
    metalFinish: 'gold',
    spotlightColor: '#a7f3d0',
    rotationSpeed: 1.8,
  },
  rose: {
    name: "Royal Rose Imperial",
    backgroundStyle: 'rose',
    liquidColor: '#e0a96d',
    particleColor: '#fde68a',
    metalFinish: 'rose-gold',
    spotlightColor: '#fed7aa',
    rotationSpeed: 0.9,
  },
  midnight: {
    name: "Midnight Sapphire",
    backgroundStyle: 'midnight',
    liquidColor: '#3b82f6',
    particleColor: '#93c5fd',
    metalFinish: 'chrome',
    spotlightColor: '#bfdbfe',
    rotationSpeed: 1.5,
  }
};

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('valaroix_3d_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      try {
        localStorage.setItem('valaroix_3d_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const applyPreset = (presetKey) => {
    if (presets[presetKey]) {
      const presetData = presets[presetKey];
      setSettings((prev) => {
        const updated = {
          ...prev,
          ...presetData,
          activeThemeName: presetData.name
        };
        try {
          localStorage.setItem('valaroix_3d_settings', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
    try {
      localStorage.setItem('valaroix_3d_settings', JSON.stringify(defaultSettings));
    } catch (e) {}
  };

  return (
    <AnimationContext.Provider value={{ settings, updateSetting, applyPreset, resetToDefault }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
