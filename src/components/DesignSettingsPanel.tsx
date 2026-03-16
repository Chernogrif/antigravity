'use client';

import React, { useState, useEffect } from 'react';
import { X, Type, Palette } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export function DesignSettingsPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'fonts' | 'colors'>('fonts');
  
  // Custom states
  const [displayFont, setDisplayFont] = useState('unbounded');
  const [sansFont, setSansFont] = useState('jakarta');
  const [primaryColor, setPrimaryColor] = useState('#688a64');
  const [darkColor, setDarkColor] = useState('#2A3B2A');

  useEffect(() => {
    if (!isOpen) return;
    
    // Attempt to load settings from Supabase or localStorage (mocking for now with local storage to avoid complex db setup)
    const savedSettings = localStorage.getItem('site_design_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.displayFont) setDisplayFont(parsed.displayFont);
      if (parsed.sansFont) setSansFont(parsed.sansFont);
      if (parsed.primaryColor) setPrimaryColor(parsed.primaryColor);
      if (parsed.darkColor) setDarkColor(parsed.darkColor);
    }
  }, [isOpen]);

  const applySettings = () => {
    // 1. Save locally
    const settings = { displayFont, sansFont, primaryColor, darkColor };
    localStorage.setItem('site_design_settings', JSON.stringify(settings));

    // 2. Apply to DOM via CSS root variables
    const root = document.documentElement;
    root.style.setProperty('--font-display', `var(--font-${displayFont})`);
    root.style.setProperty('--font-sans', `var(--font-${sansFont})`);
    
    // Note: To make colors work, we need to transition our hardcoded tailwind classes in the page to use these vars.
    // e.g. bg-[--color-primary] instead of bg-[#688a64]
    root.style.setProperty('--color-primary', primaryColor);
    
    // Auto-calculate rough hover states by just setting them to original for now or passing it through
    root.style.setProperty('--color-primary-hover', primaryColor); 
    root.style.setProperty('--color-dark', darkColor);
    root.style.setProperty('--color-dark-muted', darkColor);
  };

  if (!isOpen) return null;

  const fontOptions = [
    { id: 'unbounded', name: 'Unbounded', type: 'Bold & Modern' },
    { id: 'playfair', name: 'Playfair Display', type: 'Classic Serif' },
    { id: 'cormorant', name: 'Cormorant', type: 'Elegant Serif' },
    { id: 'montserrat', name: 'Montserrat', type: 'Clean Geometric' },
    { id: 'jakarta', name: 'Manrope', type: 'Modern Sans' },
    { id: 'cinzel', name: 'Cinzel', type: 'Monumental' },
  ];

  const colorPresets = [
    { id: 'nature', name: 'Nature Green', primary: '#688a64', dark: '#2A3B2A' },
    { id: 'ocean', name: 'Deep Ocean', primary: '#3b82f6', dark: '#1e3a8a' },
    { id: 'sunset', name: 'Sunset Copper', primary: '#ea580c', dark: '#431407' },
    { id: 'monochrome', name: 'Monochrome', primary: '#404040', dark: '#171717' },
    { id: 'gold', name: 'Luxury Gold', primary: '#d4af37', dark: '#1a1a1a' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#1a1d24] border-l border-white/10 shadow-2xl z-[200] flex flex-col transform transition-transform duration-500 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-xl font-bold uppercase tracking-widest text-[#e3cdb2]">CMS Дизайн</h2>
        <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => setActiveTab('fonts')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'fonts' ? 'text-[#e3cdb2] border-b-2 border-[#e3cdb2] bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <Type className="w-4 h-4" /> Типографика
        </button>
        <button 
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'colors' ? 'text-[#e3cdb2] border-b-2 border-[#e3cdb2] bg-white/5' : 'text-white/50 hover:text-white/80'}`}
        >
          <Palette className="w-4 h-4" /> Цвета
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'fonts' && (
          <>
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Шрифт Заголовков (Display)</label>
              <div className="grid grid-cols-1 gap-2">
                {fontOptions.map(font => (
                  <button 
                    key={`display-${font.id}`}
                    onClick={() => setDisplayFont(font.id)}
                    className={`text-left px-4 py-3 rounded-xl border transition-all ${displayFont === font.id ? 'border-[#e3cdb2] bg-[#e3cdb2]/10' : 'border-white/10 hover:border-white/30 bg-transparent'}`}
                  >
                    <div className="text-sm font-bold">{font.name}</div>
                    <div className="text-xs text-white/40">{font.type}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Основной Шрифт (Sans)</label>
              <div className="grid grid-cols-1 gap-2">
                {fontOptions.map(font => (
                  <button 
                    key={`sans-${font.id}`}
                    onClick={() => setSansFont(font.id)}
                    className={`text-left px-4 py-3 rounded-xl border transition-all ${sansFont === font.id ? 'border-[#e3cdb2] bg-[#e3cdb2]/10' : 'border-white/10 hover:border-white/30 bg-transparent'}`}
                  >
                    <div className="text-sm font-bold">{font.name}</div>
                    <div className="text-xs text-white/40">{font.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Готовые Палитры</label>
              <div className="grid grid-cols-1 gap-3">
                {colorPresets.map(preset => (
                  <button 
                    key={preset.id}
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setDarkColor(preset.dark);
                    }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${primaryColor === preset.primary ? 'border-[#e3cdb2] bg-[#e3cdb2]/10' : 'border-white/10 hover:border-white/30 bg-transparent'}`}
                  >
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#1a1d24]" style={{ backgroundColor: preset.primary }}></div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#1a1d24]" style={{ backgroundColor: preset.dark }}></div>
                    </div>
                    <div className="text-sm font-bold text-left">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Кастомный Акцент</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input 
                  type="text" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm w-full"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-white/50 font-bold">Кастомный Темный</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={darkColor} 
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input 
                  type="text" 
                  value={darkColor} 
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-[#111418]">
        <button 
          onClick={() => {
            applySettings();
            // Provide visual feedback
            const btn = document.getElementById('btn-apply-design');
            if(btn) {
              const prev = btn.innerText;
              btn.innerText = '✓ ПРИМЕНЕНО';
              btn.classList.add('bg-green-600', 'border-green-500');
              setTimeout(() => {
                btn.innerText = prev;
                btn.classList.remove('bg-green-600', 'border-green-500');
              }, 1500);
            }
          }}
          id="btn-apply-design"
          className="w-full py-4 bg-[#e3cdb2] hover:bg-white text-[#1a1d24] transition-all font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg"
        >
          Применить изменения
        </button>
      </div>
    </div>
  );
}
