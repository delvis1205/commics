
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 glass-morphism border-b border-white/5">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)] group-hover:rotate-6 transition-transform">
            <span className="text-2xl font-black text-white italic">M</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter leading-none">
              Morásio <span className="gradient-text italic">AI</span>
            </h1>
            <span className="calligraphy text-blue-400 text-sm mt-1">Transformação Artística</span>
          </div>
        </div>
        
        <nav className="hidden xl:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <a href="#" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">Domínio</a>
          <a href="#" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">Ateliê</a>
          <a href="#" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">Identidade</a>
          <a href="#" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">Evolução</a>
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Nível: Platina</span>
            <span className="text-[9px] text-gray-600 font-mono">ID: 88-3492-MOR</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]" />
          </div>
        </div>
      </div>
    </header>
  );
};
