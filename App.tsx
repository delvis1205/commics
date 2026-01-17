
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { HistorySidebar } from './components/HistorySidebar';
import { Button } from './components/Button';
import { ImageHistoryItem, EditMode } from './types';
import { editImages, getSmartSuggestions, ImageInput } from './services/geminiService';

const App: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<ImageInput[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<ImageHistoryItem[]>([]);
  const [activeMode, setActiveMode] = useState<EditMode>(EditMode.General);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (selectedImages.length > 0) {
        setIsGeneratingSuggestions(true);
        try {
          const res = await getSmartSuggestions(selectedImages);
          setSuggestions(res);
        } catch (err) {
          console.error(err);
        } finally {
          setIsGeneratingSuggestions(false);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [selectedImages]);

  const handleEdit = async () => {
    if (selectedImages.length === 0 || !prompt.trim()) return;

    setIsProcessing(true);
    try {
      const editedBase64 = await editImages(selectedImages, prompt);
      
      if (editedBase64) {
        setResultImage(editedBase64);
        const newItem: ImageHistoryItem = {
          id: Date.now().toString(),
          originalUrl: selectedImages[0].data, 
          editedUrl: editedBase64,
          prompt: prompt,
          timestamp: Date.now(),
        };
        setHistory(prev => [newItem, ...prev]);
      }
    } catch (err) {
      alert("A Morásio AI encontrou um problema técnico. Verifique sua chave de API e conexão.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `morasio-ai-masterpiece-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectFromHistory = (item: ImageHistoryItem) => {
    setSelectedImages([{ data: item.originalUrl, mimeType: 'image/png' }]);
    setResultImage(item.editedUrl);
    setPrompt(item.prompt);
  };

  const handleSuggestionClick = (s: string) => {
    setPrompt(s);
  };

  const loadingMessages = [
    "Mapeando vetores de identidade...",
    "Sincronizando iluminação global...",
    "Preservando micro-detalhes faciais...",
    "Fundindo camadas neurais...",
    "Assinando obra: Delvis de Morais..."
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col lg:flex-row gap-6 max-w-[1800px] mx-auto">
      <Header />
      
      <HistorySidebar history={history} onSelect={selectFromHistory} />

      <main className="flex-1 flex flex-col gap-6">
        <div className="glass-morphism rounded-[2.5rem] p-8 flex-1 flex flex-col relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-8 z-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Estúdio de Alta Precisão</h2>
              <p className="text-xs text-blue-400 mt-1 uppercase tracking-widest font-bold">Identidade e Realismo Extremo</p>
            </div>
            {selectedImages.length > 0 && (
              <button 
                onClick={() => { setSelectedImages([]); setResultImage(null); setPrompt(''); }} 
                className="text-xs font-bold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest"
              >
                Limpar Ateliê
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative bg-black/40 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden group">
            {selectedImages.length === 0 ? (
              <ImageUploader onImagesSelect={setSelectedImages} />
            ) : (
              <div className="relative w-full h-full flex flex-col lg:flex-row p-6 gap-6">
                {isProcessing && (
                  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-2xl">
                    <div className="relative mb-8">
                      <div className="w-28 h-28 border-2 border-blue-500/10 rounded-full animate-ping" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                      </div>
                    </div>
                    <p className="text-blue-400 text-xl font-medium tracking-wide animate-pulse text-center">
                      {loadingMessages[Math.floor((Date.now() / 2500) % loadingMessages.length)]}
                    </p>
                    <p className="text-[10px] uppercase text-gray-500 mt-6 tracking-[0.4em] font-black">Powered by Morásio Precision Fusion</p>
                  </div>
                )}
                
                <div className={`grid gap-4 w-full h-full ${resultImage ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                  <div className="flex flex-col gap-4 overflow-hidden h-full">
                    <div className={`grid gap-3 h-full ${selectedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {selectedImages.map((img, i) => (
                        <div key={i} className="relative rounded-2xl overflow-hidden bg-white/2 border border-white/5 flex items-center justify-center shadow-inner group transition-transform hover:scale-[1.02] duration-500">
                          <span className="absolute top-4 left-4 px-2 py-1 bg-black/70 backdrop-blur-md text-[8px] rounded uppercase font-black tracking-[0.2em] z-10 border border-white/10">
                            Entrada {i+1}
                          </span>
                          <img src={img.data} className="w-full h-full object-contain" alt={`Origem ${i}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {resultImage && (
                    <div className="relative rounded-[2rem] overflow-hidden bg-white/2 border-2 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] animate-in fade-in zoom-in duration-1000">
                      <span className="absolute top-5 left-5 px-4 py-1.5 bg-blue-600 text-[10px] rounded-full uppercase font-black tracking-[0.2em] z-10 border border-blue-400/50 shadow-2xl">
                        Produção Finalizada
                      </span>
                      <div className="relative h-full w-full flex items-center justify-center p-3 bg-gradient-to-br from-blue-900/5 to-purple-900/5">
                        <img src={resultImage} className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(59,130,246,0.2)]" alt="Resultado Final" />
                        <div className="absolute bottom-8 right-10 opacity-70 flex flex-col items-end pointer-events-none group">
                          <span className="calligraphy text-3xl text-white select-none leading-none drop-shadow-lg group-hover:scale-110 transition-transform">Morásio AI</span>
                          <span className="calligraphy text-xl text-white/90 select-none leading-none -mt-1 drop-shadow-md">Delvis de Morais</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedImages.length > 0 && (
          <div className="glass-morphism rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 border-l-4 border-l-blue-500 shadow-xl">
            <div className="flex items-center gap-3 text-blue-400">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">Sugestões de Elite:</span>
            </div>
            <div className="flex flex-wrap gap-3 flex-1">
              {isGeneratingSuggestions ? (
                <div className="flex gap-3 items-center">
                  {[1, 2, 3].map(i => <div key={i} className="h-8 w-40 bg-white/5 rounded-full animate-pulse" />)}
                </div>
              ) : (
                suggestions.map((s, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    className="text-[11px] bg-blue-500/5 hover:bg-blue-500/15 px-4 py-2 rounded-full border border-blue-500/10 text-blue-100 transition-all hover:scale-105 active:scale-95 whitespace-nowrap font-medium"
                  >
                    {s}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <aside className="w-full lg:w-[420px] flex flex-col gap-6">
        <div className="glass-morphism rounded-[2rem] p-8 flex flex-col gap-8 premium-card shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Configuração de Alvo</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" />
                <span className="text-[10px] text-green-500 font-bold uppercase">Precisão Ativa</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: EditMode.General, label: 'Geral' },
                { id: EditMode.Portrait, label: 'Retrato 8K' },
                { id: EditMode.Scenario, label: 'Cenário HDR' },
                { id: EditMode.Commercial, label: 'Comercial' },
                { id: EditMode.Artistic, label: 'Masterpiece' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id as any)}
                  className={`px-4 py-4 rounded-2xl text-[10px] font-black tracking-widest border transition-all duration-500 uppercase flex items-center justify-center gap-3 ${
                    activeMode === m.id 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                      : 'bg-white/2 border-white/10 text-gray-600 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`w-1 h-1 rounded-full ${activeMode === m.id ? 'bg-blue-400 scale-150' : 'bg-transparent'}`} />
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Diretiva de Transformação</label>
              <button onClick={() => setPrompt('')} className="text-[10px] font-bold text-gray-600 hover:text-white transition-colors uppercase tracking-widest">Reiniciar</button>
            </div>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva a fusão ou aprimoramento com detalhes técnicos (ex: iluminação de estúdio, 35mm, 1.8f...)"
                className="w-full h-44 bg-black/40 border border-white/10 rounded-[1.8rem] p-6 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none placeholder:text-gray-700 leading-relaxed shadow-inner"
              />
              <div className="absolute bottom-5 right-6 text-[10px] text-gray-700 font-mono tracking-widest font-bold">
                PROMPT: {prompt.length}/1000
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleEdit} 
              isLoading={isProcessing} 
              disabled={selectedImages.length === 0 || !prompt.trim()}
              className="w-full py-6 text-xl font-black uppercase tracking-[0.2em] rounded-[1.5rem] bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-[0_15px_40px_rgba(37,99,235,0.3)] hover:translate-y-[-2px] hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)] transition-all"
            >
              Criar Obra de Arte
            </Button>
            
            {resultImage && (
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="w-full py-5 border-white/10 hover:border-blue-500/30 rounded-[1.5rem] group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                <div className="relative flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
                  </svg>
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Exportar 4K Ultra HD</span>
                </div>
              </Button>
            )}
          </div>
        </div>

        <div className="glass-morphism rounded-[2rem] p-6 premium-card border-t border-t-blue-500/30 shadow-xl">
           <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
               </svg>
             </div>
             <div>
               <p className="text-xs font-black text-white tracking-[0.2em] uppercase">Mapeamento de Identidade</p>
               <p className="text-[10px] text-gray-500 mt-2 leading-relaxed font-medium">
                 A Morásio AI preserva cada detalhe da sua essência enquanto reconstrói o mundo ao seu redor.
               </p>
             </div>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default App;
