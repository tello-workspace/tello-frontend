
"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function ProjectsPage() {
  const raindrops = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      
      {/* 1. Yağmur ve Izgara */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `linear-gradient(to_right, #ef4444 2px, transparent 2px), linear-gradient(to_bottom, #ef4444 2px, transparent 2px)`,
               backgroundSize: '50px 50px'
             }}>
        </div>
        {raindrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute w-[2px] h-10 bg-blue-400 opacity-20"
            style={{ left: `${drop.left}%` }}
            initial={{ top: -50 }}
            animate={{ top: "110%" }}
            transition={{ duration: drop.duration, repeat: Infinity, ease: "linear", delay: drop.delay }}
          />
        ))}
      </div>

      {/* İçerik Kartı */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center p-10 border border-slate-200 rounded-3xl bg-white/80 backdrop-blur-md shadow-2xl max-w-md w-full mx-4 mt-16"
      >
        {/* Üst Kısım: STOP ve Çöp Adam Konteynırı */}
        <div className="absolute -top-16 left-0 right-0 flex justify-between px-4">
          {/* Saplanmış STOP Tabelası */}
          <div className="w-16">
            <svg viewBox="0 0 40 80" width="40" height="80">
              <line x1="20" y1="35" x2="20" y2="70" stroke="#475569" strokeWidth="4" />
              <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="#DC2626" stroke="white" strokeWidth="2"/>
              <text x="20" y="22" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" dominantBaseline="middle">STOP</text>
            </svg>
          </div>

          {/* Çöp Adam */}
          <div className="w-20">
            <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800">
              <circle cx="12" cy="7" r="3" />
              <path d="M12 10v6" />
              <path d="M12 16l-3 6M12 16l3 6" />
              <path d="M12 11L7 14" />
              <motion.path 
                d="M12 11l6 -2" 
                animate={{ rotate: [0, -25, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 11px" }}
              />
            </svg>
          </div>
        </div>

        {/* Ayaklı Bariyer İkonu */}
        <div className="mx-auto mb-6 w-fit mt-8">
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="drop-shadow-md">
            <rect x="5" y="20" width="4" height="20" fill="#475569" rx="1"/>
            <rect x="51" y="20" width="4" height="20" fill="#475569" rx="1"/>
            <rect width="60" height="20" fill="#FACC15" rx="4"/>
            <path d="M15 0L0 20M30 0L15 20M45 0L30 20M60 0L45 20" stroke="#DC2626" strokeWidth="6"/>
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold mb-2 text-slate-900">Yapım Aşamasında</h1>
        <p className="text-slate-600 font-medium">Projelerim üzerinde çalışıyorum, çok yakında burada olacaklar.</p>
      </motion.div>

      {/* Kedi */}
      <motion.div 
        className="absolute bottom-10 z-20"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="80" height="80" viewBox="0 0 24 24" fill="#ef4444">
          <path d="M12 2C8.13 2 5 5.13 5 9V18C5 19.66 6.34 21 8 21H16C17.66 21 19 19.66 19 18V9C19 5.13 15.87 2 12 2ZM8 12C8.55 12 9 12.45 9 13C9 13.55 8.55 14 8 14C7.45 14 7 13.55 7 13C7 12.45 7.45 12 8 12ZM16 14C15.45 14 15 13.55 15 13C15 12.45 15.45 12 16 12C16.55 12 17 12.45 17 13C17 13.55 16.55 14 16 14ZM14 17H10V16H14V17Z" />
        </svg>
      </motion.div>
    </main>
  );
}