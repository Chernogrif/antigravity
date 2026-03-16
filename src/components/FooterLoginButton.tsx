'use client';

import { useAdmin } from './AdminProvider';

export function FooterLoginButton() {
  const { isAdmin, openLoginModal } = useAdmin();

  if (isAdmin) return null;

  return (
    <button 
      onClick={openLoginModal}
      className="text-[10px] uppercase tracking-widest text-[#475569] hover:text-[#c19b76] transition-colors mt-4 md:mt-0 opacity-50 hover:opacity-100"
    >
      Администратор
    </button>
  );
}
