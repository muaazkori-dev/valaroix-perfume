'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Sun, RotateCw, Sparkles, Droplet, RefreshCw, Layers, Monitor } from 'lucide-react';
import { useAnimation, presets } from '@/context/AnimationContext';

export default function AdminStudioDrawer({ isOpen, onClose }) {
  const { settings, updateSetting, applyPreset, resetToDefault } = useAnimation();
  const [activeTab, setActiveTab] = useState('motion'); // motion | lighting | material | presets

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-lg bg-valaroix-dark border-l border-valaroix-gold/40 shadow-[0_0_80px_rgba(212,175,55,0.25)] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-valaroix-gold/25 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full glass-panel-gold flex items-center justify-center text-valaroix-gold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                    3D Animation Studio
                  </h2>
                  <p className="text-[11px] text-valaroix-gold uppercase tracking-widest font-mono">
                    Live Real-Time WebGL Controller
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full glass-panel text-gray-400 hover:text-valaroix-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-3 bg-black/70 border-b border-valaroix-gold/20 text-xs">
              <button
                onClick={() => setActiveTab('motion')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all ${
                  activeTab === 'motion' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" /> Motion
              </button>
              <button
                onClick={() => setActiveTab('lighting')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all ${
                  activeTab === 'lighting' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                onClick={() => setActiveTab('material')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all ${
                  activeTab === 'material' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" /> Bottle
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 font-medium transition-all ${
                  activeTab === 'presets' ? 'bg-valaroix-gold text-valaroix-dark font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Themes
              </button>
            </div>

            {/* Scrollable Control Settings Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: 3D MOTION & PHYSICS CONTROLS */}
              {activeTab === 'motion' && (
                <div className="space-y-6">
                  {/* Auto Rotation Toggle */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-white uppercase tracking-wider">3D Auto-Rotation</span>
                      <span className="text-[10px] text-gray-400">Continuous 360° bottle spinning</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoRotate}
                      onChange={(e) => updateSetting('autoRotate', e.target.checked)}
                      className="w-5 h-5 accent-valaroix-gold cursor-pointer"
                    />
                  </div>

                  {/* Rotation Speed Slider */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-200">Rotation Speed</span>
                      <span className="text-valaroix-gold font-mono font-bold">{settings.rotationSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="5.0"
                      step="0.1"
                      value={settings.rotationSpeed}
                      onChange={(e) => updateSetting('rotationSpeed', parseFloat(e.target.value))}
                      className="w-full accent-valaroix-gold cursor-pointer"
                    />
                  </div>

                  {/* Mouse Tilt Sensitivity Slider */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-200">Mouse Parallax Sensitivity</span>
                      <span className="text-valaroix-gold font-mono font-bold">{settings.tiltSensitivity}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="3.0"
                      step="0.1"
                      value={settings.tiltSensitivity}
                      onChange={(e) => updateSetting('tiltSensitivity', parseFloat(e.target.value))}
                      className="w-full accent-valaroix-gold cursor-pointer"
                    />
                  </div>

                  {/* Floating Motion Speed */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-200">Vertical Float Oscillation</span>
                      <span className="text-valaroix-gold font-mono font-bold">{settings.floatSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.1"
                      value={settings.floatSpeed}
                      onChange={(e) => updateSetting('floatSpeed', parseFloat(e.target.value))}
                      className="w-full accent-valaroix-gold cursor-pointer"
                    />
                  </div>

                  {/* Camera FOV */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-200">Camera Lens FOV Angle</span>
                      <span className="text-valaroix-gold font-mono font-bold">{settings.cameraFOV}°</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="75"
                      step="1"
                      value={settings.cameraFOV}
                      onChange={(e) => updateSetting('cameraFOV', parseInt(e.target.value))}
                      className="w-full accent-valaroix-gold cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: LIGHTING & ATMOSPHERE */}
              {activeTab === 'lighting' && (
                <div className="space-y-6">
                  {/* Spotlight Brightness */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-200">Spotlight Intensity</span>
                      <span className="text-valaroix-gold font-mono font-bold">{settings.spotlightIntensity}</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="8.0"
                      step="0.2"
                      value={settings.spotlightIntensity}
                      onChange={(e) => updateSetting('spotlightIntensity', parseFloat(e.target.value))}
                      className="w-full accent-valaroix-gold cursor-pointer"
                    />
                  </div>

                  {/* Ambient Light Warmth */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-200">Ambient Light Level</span>
                      <span className="text-valaroix-gold font-mono font-bold">{settings.ambientIntensity}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2.5"
                      step="0.1"
                      value={settings.ambientIntensity}
                      onChange={(e) => updateSetting('ambientIntensity', parseFloat(e.target.value))}
                      className="w-full accent-valaroix-gold cursor-pointer"
                    />
                  </div>

                  {/* Particle Count */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-200">Gold Dust Particle Count</span>
                      <span className="text-valaroix-gold font-mono font-bold">{settings.particleCount}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="400"
                      step="10"
                      value={settings.particleCount}
                      onChange={(e) => updateSetting('particleCount', parseInt(e.target.value))}
                      className="w-full accent-valaroix-gold cursor-pointer"
                    />
                  </div>

                  {/* Environment Reflection Preset */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-3">
                    <span className="block text-xs font-bold text-gray-200">HDRI Studio Reflections</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['city', 'studio', 'sunset', 'night'].map((env) => (
                        <button
                          key={env}
                          onClick={() => updateSetting('environmentPreset', env)}
                          className={`py-2 rounded-xl text-xs uppercase font-bold border transition-all ${
                            settings.environmentPreset === env
                              ? 'bg-valaroix-gold text-valaroix-dark border-valaroix-gold'
                              : 'bg-black/60 text-gray-400 border-valaroix-gold/20'
                          }`}
                        >
                          {env}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BOTTLE & MATERIAL SHADERS */}
              {activeTab === 'material' && (
                <div className="space-y-6">
                  {/* Liquid Color Picker */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-3">
                    <span className="block text-xs font-bold text-gray-200">Liquid Fragrance Tint</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.liquidColor}
                        onChange={(e) => updateSetting('liquidColor', e.target.value)}
                        className="w-10 h-10 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                      <span className="font-mono text-xs text-valaroix-gold font-bold">{settings.liquidColor}</span>
                    </div>
                  </div>

                  {/* Glass Transmission Translucency */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-200">Glass Translucency (Transmission)</span>
                      <span className="text-valaroix-gold font-mono font-bold">{settings.glassTransmission}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.02"
                      value={settings.glassTransmission}
                      onChange={(e) => updateSetting('glassTransmission', parseFloat(e.target.value))}
                      className="w-full accent-valaroix-gold cursor-pointer"
                    />
                  </div>

                  {/* Metallic Finish */}
                  <div className="glass-panel p-4 rounded-2xl border-valaroix-gold/20 space-y-3">
                    <span className="block text-xs font-bold text-gray-200">Atomizer Metallic Finish</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'gold', label: '24k Yellow Gold' },
                        { id: 'rose-gold', label: 'Rose Gold' },
                        { id: 'chrome', label: 'Silver Chrome' },
                        { id: 'obsidian-gold', label: 'Obsidian Gold' }
                      ].map((metal) => (
                        <button
                          key={metal.id}
                          onClick={() => updateSetting('metalFinish', metal.id)}
                          className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                            settings.metalFinish === metal.id
                              ? 'bg-valaroix-gold text-valaroix-dark border-valaroix-gold font-bold'
                              : 'bg-black/60 text-gray-400 border-valaroix-gold/20'
                          }`}
                        >
                          {metal.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PRESETS & THEMES */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  <span className="block text-xs uppercase tracking-widest text-valaroix-gold font-bold">
                    One-Click Luxury Theme Presets
                  </span>

                  {Object.keys(presets).map((key) => {
                    const item = presets[key];
                    const isActive = settings.activeThemeName === item.name;

                    return (
                      <div
                        key={key}
                        onClick={() => applyPreset(key)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isActive
                            ? 'glass-panel-gold border-valaroix-gold shadow-lg'
                            : 'glass-panel border-valaroix-gold/20 hover:border-valaroix-gold/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                              style={{ backgroundColor: item.liquidColor }}
                            />
                            <h4 className="font-serif text-sm font-bold text-white">{item.name}</h4>
                          </div>

                          {isActive && (
                            <span className="text-[10px] uppercase font-bold text-valaroix-dark bg-valaroix-gold px-2.5 py-1 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Footer Action Buttons */}
            <div className="p-6 border-t border-valaroix-gold/25 bg-black/70 flex items-center justify-between">
              <button
                onClick={resetToDefault}
                className="px-4 py-2.5 rounded-full glass-panel text-xs text-gray-400 hover:text-valaroix-gold flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restore Defaults
              </button>

              <button
                onClick={onClose}
                className="btn-gold px-6 py-2.5 rounded-full text-xs uppercase font-bold"
              >
                Save & Apply
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
