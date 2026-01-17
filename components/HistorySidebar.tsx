
import React from 'react';
import { ImageHistoryItem } from '../types';

interface HistorySidebarProps {
  history: ImageHistoryItem[];
  onSelect: (item: ImageHistoryItem) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect }) => {
  return (
    <aside className="w-full md:w-80 h-full glass-morphism flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Trabalhos Recentes</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600 text-center px-4">
            <p className="text-sm">Nenhum histórico disponível</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group cursor-pointer bg-white/2 border border-white/5 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="aspect-square relative">
                <img src={item.editedUrl} alt={item.prompt} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-medium">Ver Resultado</span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 line-clamp-2 italic">"{item.prompt}"</p>
                <p className="text-[10px] text-gray-600 mt-2">{new Date(item.timestamp).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
