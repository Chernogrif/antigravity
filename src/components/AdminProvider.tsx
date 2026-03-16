'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Settings, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { AdminLoginModal } from './AdminLoginModal'
import { DesignSettingsPanel } from './DesignSettingsPanel'
import { DataBlocksPanel } from './DataBlocksPanel'

interface AdminContextProps {
  isAdmin: boolean;
  logout: () => Promise<void>;
  openLoginModal: () => void;
}

const AdminContext = createContext<AdminContextProps>({ isAdmin: false, logout: async () => {}, openLoginModal: () => {} })

export const useAdmin = () => useContext(AdminContext)

export function AdminProvider({ children, initialIsAdmin }: { children: React.ReactNode, initialIsAdmin: boolean }) {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin)
  const supabase = createClient()

  useEffect(() => {
    // Check local fallback
    const isLocalAdmin = localStorage.getItem('site_admin_auth') === 'true';
    if (isLocalAdmin) setIsAdmin(true);

    // Keep client auth state in sync automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      const isLocalAdmin = localStorage.getItem('site_admin_auth') === 'true';
      setIsAdmin(!!session?.user || isLocalAdmin)
    })
    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    localStorage.removeItem('site_admin_auth');
    await supabase.auth.signOut();
    setIsAdmin(false);
    window.location.reload();
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);
  const [isDataPanelOpen, setIsDataPanelOpen] = useState(false);

  // Apply saved global settings on first load for all users
  useEffect(() => {
    const savedSettings = localStorage.getItem('site_design_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        const root = document.documentElement;
        if (parsed.displayFont) root.style.setProperty('--font-display', `var(--font-${parsed.displayFont})`);
        if (parsed.sansFont) root.style.setProperty('--font-sans', `var(--font-${parsed.sansFont})`);
        if (parsed.primaryColor) {
           root.style.setProperty('--color-primary', parsed.primaryColor);
           root.style.setProperty('--color-primary-hover', parsed.primaryColor);
        }
        if (parsed.darkColor) {
           root.style.setProperty('--color-dark', parsed.darkColor);
           root.style.setProperty('--color-dark-muted', parsed.darkColor);
        }
      } catch (e) {}
    }
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, logout, openLoginModal: () => setIsModalOpen(true) }}>
      {children}
      {!isAdmin && <AdminLoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLoginSuccess={() => setIsAdmin(true)} />}
      
      {/* Floating indicator & Admin Controls when Logged In */}
      {isAdmin && (
        <div className="fixed bottom-6 w-full px-6 pointer-events-none z-[100] flex justify-between items-end">
          
          {/* Design Settings */}
          <div className="pointer-events-auto flex flex-col gap-2">
            <button 
              onClick={() => setIsDesignPanelOpen(true)}
              className="flex items-center gap-3 bg-[#111418] border border-white/10 hover:border-[#688a64] hover:bg-[#1a1d24] text-white px-5 py-3 rounded-xl shadow-2xl transition-all group backdrop-blur-md"
            >
              <Settings className="w-5 h-5 text-[#8A9C87] group-hover:rotate-90 transition-transform duration-500" />
              <span className="font-bold text-sm uppercase tracking-wider">Дизайн и Настройки</span>
            </button>
            <button 
              onClick={() => setIsDataPanelOpen(true)}
              className="flex items-center gap-3 bg-[#111418] border border-white/10 hover:border-[#688a64] hover:bg-[#1a1d24] text-white px-5 py-3 rounded-xl shadow-2xl transition-all group backdrop-blur-md"
            >
              <LayoutDashboard className="w-5 h-5 text-[#8A9C87] group-hover:scale-110 transition-transform duration-500" />
              <span className="font-bold text-sm uppercase tracking-wider">Данные и Блоки</span>
            </button>
          </div>

          <div className="pointer-events-auto flex items-center gap-6 bg-[#111418]/90 backdrop-blur-md px-6 py-4 rounded-full border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 border-r border-white/10 pr-6">
              <span className="relative flex w-3 h-3">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-[#A3B89E]"></span>
                <span className="relative inline-flex w-3 h-3 rounded-full bg-[#688a64]"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-[#A3B89E]">
                Админ-режим активен
              </span>
            </div>
            
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold transition-colors"
              title="Выйти из CMS"
            >
              <LogOut className="w-4 h-4" /> Выход
            </button>
          </div>

        </div>
      )}

      {/* Global Setting Panels */}
      {isAdmin && (
        <>
          <DesignSettingsPanel 
            isOpen={isDesignPanelOpen} 
            onClose={() => setIsDesignPanelOpen(false)} 
          />
          <DataBlocksPanel 
            isOpen={isDataPanelOpen} 
            onClose={() => setIsDataPanelOpen(false)} 
          />
        </>
      )}
    </AdminContext.Provider>
  )
}
