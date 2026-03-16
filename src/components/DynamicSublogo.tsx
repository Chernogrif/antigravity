'use client';

import { useState } from 'react';
import { useAdmin } from './AdminProvider';
import { EditableText } from './EditableText';
import { saveContent } from '@/app/actions';

const FONTS = [
  { name: 'Cinzel', variable: 'var(--font-cinzel)' },
  { name: 'Cormorant Garamond', variable: 'var(--font-cormorant)' },
  { name: 'Playfair Display', variable: 'var(--font-playfair)' },
  { name: 'Montserrat', variable: 'var(--font-montserrat)' },
];

export function DynamicSublogo({ 
  initialText, 
  initialFont 
}: { 
  initialText: string, 
  initialFont: string 
}) {
  const { isAdmin } = useAdmin();
  const [font, setFont] = useState(initialFont || FONTS[1].variable);
  const [isSaving, setIsSaving] = useState(false);

  const handleFontChange = async (newFont: string) => {
    setFont(newFont);
    setIsSaving(true);
    try {
      await saveContent('sublogo_font', newFont);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-6 relative w-full max-w-2xl mx-auto">
      <div style={{ fontFamily: font }}>
        <EditableText 
          id="hero_sublogo" 
          initialContent={initialText || 'ТОЧНОСТЬ, СТАВШАЯ ИСКУССТВОМ'} 
          className="text-lg md:text-xl lg:text-2xl text-[#b8c1ec] tracking-widest text-center"
        />
      </div>

      {/* Font Picker strictly for Admin */}
      {isAdmin && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#1a1d24]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-4 z-50">
          <span className="text-xs uppercase tracking-widest text-[#475569] font-bold">Шрифт:</span>
          <select 
            value={font}
            onChange={(e) => handleFontChange(e.target.value)}
            disabled={isSaving}
            className="bg-transparent text-[#e8eaf0] text-sm outline-none border-b border-white/20 pb-1 cursor-pointer font-sans"
          >
            {FONTS.map(f => (
              <option key={f.variable} value={f.variable} className="bg-[#1a1d24] text-white">
                {f.name}
              </option>
            ))}
          </select>
          {isSaving && <span className="text-xs text-[#c19b76] animate-pulse">Сохранение...</span>}
        </div>
      )}
    </div>
  );
}
