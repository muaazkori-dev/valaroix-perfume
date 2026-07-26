'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sliders, RotateCw, Sun, Droplet, Layers, RefreshCw, ArrowLeft, Sparkles, Monitor } from 'lucide-react';
import ValaroixBottleCanvas from '@/components/3d/ValaroixBottleCanvas';
import { useAnimation, presets } from '@/context/AnimationContext';

export default function AdminPage() {
  const { settings, updateSetting, applyPreset, resetToDefault } = useAnimation();
  const [activeTab, setActiveTab] = useState('motion');

  return (
    <div className="min-h-screen bg-valaroix-dark text-white flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="h-16 border-b border-valaroix-gold/30 bg-black/80 backdrop-blur-md px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xs text-valaroix-gold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back To Storefront
          </Link>
          <div className="h-4 w-px bg-valaroix-gold/30" />
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-valaroix-gold" />
            <h1 className="font-serif text-lg font-bold text-white tracking-wider">
              VALAROIX 3D Studio Studio
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">
            Active Theme: <strong className="text-valaroix-gold">{settings.activeThemeName}</strong>
          </span>
          <button
            onClick={resetToDefault}
            className="px-3.5 py-1.5 rounded-full glass-panel text-xs text-gray-300 hover:text-valaroix-gold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </header>

      {/* Main Split Studio View: Left 3D WebGL Canvas, Right Live Controls */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left 3D Realtime Canvas Stage (7 Cols) */}
        <div className="lg:col-span-7 h-[500px] lg:h-full relative bg-gradient-to-b from-black via-valaroix-dark to-black p-6 flex flex-col">
          <div className="w-full h-full relative rounded-3xl overflow-hidden glass-panel border border-valaroix-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
            <ValaroixBottleCanvas interactive={true} />
          </div>
          
          <div className="absolute bottom-10 left-10 z-20 px-4 py-2 rounded-full glass-panel-gold border-valaroix-gold text-xs text-valaroix-gold font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Realtime 60 FPS WebGL Render Sync</span>
          </div>
        </div>

        {/* Right Admin Controls Panel (5 Cols) */}
        <div className="lg:col-span-5 border-l border-valaroix-gold/30 bg-black/90 flex flex-col justify-between overflow-y-auto">
          
          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-4 bg-valaroix-dark border-b border-valaroix-gold/20 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('motion')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'motion' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" /> Motion
            </button>
            <button
              onClick={() => setActiveTab('lighting')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'lighting' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Light
            </button>
            <button
              onClick={() => setActiveTab('material')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'material' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Droplet className="w-3.5 h-3.5" /> Bottle
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'presets' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Presets
            </button>
          </div>

          {/* Controls Tab Body */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {activeTab === 'motion' && (
              <div className="space-y-6">
                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">3D Auto-Rotation</span>
                  <input
                    type="checkbox"
                    checked={settings.autoRotate}
                    onChange={(e) => updateSetting('autoRotate', e.target.checked)}
                    className="w-5 h-5 accent-valaroix-gold cursor-pointer"
                  />
                </div>

                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Rotation Speed</span>
                    <span className="text-valaroix-gold font-mono">{settings.rotationSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={settings.rotationSpeed}
                    onChange={(e) => updateSetting('rotationSpeed', parseFloat(e.target.value))}
                    className="w-full accent-valaroix-gold"
                  />
                </div>

                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Mouse Tilt Sensitivity</span>
                    <span className="text-valaroix-gold font-mono">{settings.tiltSensitivity}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="3.0"
                    step="0.1"
                    value={settings.tiltSensitivity}
                    onChange={(e) => updateSetting('tiltSensitivity', parseFloat(e.target.value))}
                    className="w-full accent-valaroix-gold"
                  />
                </div>

                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Float Oscillation</span>
                    <span className="text-valaroix-gold font-mono">{settings.floatSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={settings.floatSpeed}
                    onChange={(e) => updateSetting('floatSpeed', parseFloat(e.target.value))}
                    className="w-full accent-valaroix-gold"
                  />
                </div>
              </div>
            )}

            {activeTab === 'lighting' && (
              <div className="space-y-6">
                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Spotlight Intensity</span>
                    <span className="text-valaroix-gold font-mono">{settings.spotlightIntensity}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="8.0"
                    step="0.2"
                    value={settings.spotlightIntensity}
                    onChange={(e) => updateSetting('spotlightIntensity', parseFloat(e.target.value))}
                    className="w-full accent-valaroix-gold"
                  />
                </div>

                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Gold Dust Particles</span>
                    <span className="text-valaroix-gold font-mono">{settings.particleCount}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    step="10"
                    value={settings.particleCount}
                    onChange={(e) => updateSetting('particleCount', parseInt(e.target.value))}
                    className="w-full accent-valaroix-gold"
                  />
                </div>
              </div>
            )}

            {activeTab === 'material' && (
              <div className="space-y-6">
                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-3">
                  <span className="block text-xs font-bold">Liquid Fragrance Tint</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.liquidColor}
                      onChange={(e) => updateSetting('liquidColor', e.target.value)}
                      className="w-10 h-10 rounded-lg bg-transparent cursor-pointer"
                    />
                    <span className="font-mono text-xs text-valaroix-gold font-bold">{settings.liquidColor}</span>
                  </div>
                </div>

                <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Glass Transmission</span>
                    <span className="text-valaroix-gold font-mono">{settings.glassTransmission}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.02"
                    value={settings.glassTransmission}
                    onChange={(e) => updateSetting('glassTransmission', parseFloat(e.target.value))}
                    className="w-full accent-valaroix-gold"
                  />
                </div>
              </div>
            )}

            {activeTab === 'presets' && (
              <div className="space-y-4">
                {Object.keys(presets).map((key) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="w-full p-4 rounded-2xl glass-panel border-valaroix-gold/20 hover:border-valaroix-gold flex items-center justify-between text-left"
                  >
                    <span className="font-serif font-bold text-sm text-white">{presets[key].name}</span>
                    <span className="text-xs text-valaroix-gold">Apply Preset</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-valaroix-gold/20 bg-valaroix-dark text-center text-xs text-gray-500">
            Valaroix WebGL Studio • Live LocalStorage Sync
          </div>
        </div>

      </div>
    </div>
  );
}
