'use client';

import { useEffect, useState } from 'react';

export function PremiumLogo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Abstract Cedar Branch - SVG Draw Animation */}
      <div className="relative w-24 h-24 mb-6">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-[0_0_15px_rgba(193,155,118,0.5)]"
        >
          <g transform="translate(50, 90) rotate(-10)">
            {/* Trunk */}
            <path 
              d="M0,0 Q5,-40 20,-80" 
              fill="none" 
              stroke="#c19b76" 
              strokeWidth="1.5"
              className={mounted ? "animate-draw-path" : "opacity-0"}
              style={{ strokeDasharray: 100, strokeDashoffset: mounted ? 0 : 100 }}
            />
            {/* Branches / Needles */}
            {[
              "M5,-15 Q15,-10 25,-15",
              "M6,-25 Q20,-20 30,-25",
              "M8,-35 Q22,-30 35,-35",
              "M11,-45 Q25,-40 35,-45",
              "M14,-55 Q25,-50 35,-55",
              "M16,-65 Q25,-60 30,-65",
              "M3,-15 Q-10,-10 -15,-15",
              "M4,-25 Q-15,-20 -20,-25",
              "M6,-35 Q-15,-30 -25,-35",
              "M8,-45 Q-15,-40 -20,-45",
              "M10,-55 Q-10,-50 -15,-55",
            ].map((d, i) => (
              <path 
                key={i}
                d={d} 
                fill="none" 
                stroke="#e3cdb2" 
                strokeWidth="0.8"
                className={mounted ? "animate-draw-path" : "opacity-0"}
                style={{ 
                  strokeDasharray: 50, 
                  strokeDashoffset: mounted ? 0 : 50,
                  transitionDelay: `${i * 100}ms`
                }}
              />
            ))}
          </g>
        </svg>

        {/* CSS for path animation */}
        <style jsx>{`
          .animate-draw-path {
            transition: stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </div>

      {/* Main Company Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.2em] uppercase font-display text-gradient-bronze text-center leading-tight">
        ООО ПИФ<br />Возрождение
      </h1>
    </div>
  );
}
