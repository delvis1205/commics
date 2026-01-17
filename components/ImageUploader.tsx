
import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImagesSelect: (files: { data: string, mimeType: string }[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const validImages = fileArray.filter(f => f.type.startsWith('image/'));
    
    if (validImages.length === 0) {
      alert("Por favor, envie apenas arquivos de imagem.");
      return;
    }

    const promises = validImages.map(file => {
      return new Promise<{ data: string, mimeType: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            data: e.target?.result as string,
            mimeType: file.type
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(results => {
      onImagesSelect(results);
    });
  }, [onImagesSelect]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div 
      className={`relative h-full min-h-[400px] w-full rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-6 p-12 ${
        isDragging ? 'border-blue-500 bg-blue-500/10 scale-[0.99]' : 'border-white/10 bg-white/2 hover:bg-white/5 hover:border-white/20'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <div className="w-20 h-20 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center text-blue-400 border border-white/5 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold text-white">Importar Mídia para o Canvas</p>
        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Envie 1 ou mais fotos. A Morásio AI pode misturar, trocar ou fundi-las perfeitamente.</p>
      </div>
      <input 
        type="file" 
        multiple
        accept="image/*" 
        className="absolute inset-0 opacity-0 cursor-pointer" 
        onChange={onFileChange}
      />
      <div className="flex gap-4 items-center">
        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 border border-white/5">SUPORTE A EDIÇÃO EM LOTE</span>
      </div>
    </div>
  );
};
