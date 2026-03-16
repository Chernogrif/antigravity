'use client';

import React, { useEffect, useRef, useState } from 'react';

export function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  
  // Cursor positions
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device has touch screen. If so, don't show custom cursor
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      // Instantly move the dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      
      // Check for hover targets (links, buttons, interactive elements)
      const target = e.target as Element;
      
      const isInteractive = 
        target.closest('a, button, [role="button"], .cursor-pointer') !== null || 
        (target instanceof HTMLElement && window.getComputedStyle(target).cursor === 'pointer');
        
      setIsHovering(isInteractive);
    };

    const animate = () => {
      // Smoothly interpolate the ring
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Cursor Dot */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-multiply flex items-center justify-center transition-all duration-300 ease-out bg-[#688a64] ${
          isHovering ? 'w-10 h-10 bg-opacity-20 backdrop-blur-[2px]' : 'w-2.5 h-2.5 bg-opacity-100 shadow-md shadow-[#2A3B2A]/20'
        }`}
        style={{ transform: 'translate(-50%, -50%)', left: isHovering ? '-20px' : '-5px', top: isHovering ? '-20px' : '-5px' }}
      >
        {/* Inner solid dot visible ONLY on hover */}
        <div className={`rounded-full bg-[#2A3B2A] transition-all duration-300 ${isHovering ? 'w-2 h-2 opacity-100' : 'w-0 h-0 opacity-0'}`}></div>
      </div>
    </>
  );
}
