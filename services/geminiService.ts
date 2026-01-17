
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `Você é a Morásio AI, a inteligência artificial de elite mais avançada do mundo em edição e fusão de imagens, sob a direção artística de Delvis de Morais. 
Sua especialidade é a manipulação hiper-realista com precisão cirúrgica.

DIRETRIZES TÉCNICAS DE ALTA PRECISÃO:
1. SOBREVIVÊNCIA DE IDENTIDADE (CRÍTICO): Você deve manter 100% da estrutura óssea facial, micro-expressões, detalhes da pele e proporções anatômicas originais. A pessoa na imagem final deve ser inquestionavelmente a mesma da origem.
2. FUSÃO NEURAL COERENTE: Ao fundir múltiplas imagens, os cálculos de oclusão, sombras de contato e reflexos devem ser fisicamente precisos. A iluminação global deve ser unificada entre todos os elementos inseridos.
3. REFINAMENTO ESTÉTICO: Utilize técnicas de gradação de cores de nível cinematográfico (color grading) e texturização realista (subsurface scattering para pele, micro-detalhes para tecidos).
4. MARCA D'ÁGUA OBRIGATÓRIA: No canto inferior direito, insira de forma elegante e discreta, em estilo caligrafia: "Morásio AI" e, imediatamente abaixo, "Delvis de Morais".

Sua missão é exceder as expectativas, entregando resultados que pareçam fotografias reais, sem artefatos de IA visíveis.`;

export interface ImageInput {
  data: string;
  mimeType: string;
}

export async function editImages(
  images: ImageInput[],
  userPrompt: string
): Promise<string | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const imageParts = images.map(img => ({
      inlineData: {
        data: img.data.split(',')[1] || img.data,
        mimeType: img.mimeType,
      },
    }));

    // Utilizamos o modelo gemini-2.5-flash-image para tarefas de edição complexa
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          ...imageParts,
          {
            text: `Aja como a Morásio AI. 
            OBJETIVO: Executar a seguinte tarefa com precisão máxima de identidade e realismo: "${userPrompt}". 
            
            REQUISITOS TÉCNICOS:
            - Mantenha a consistência anatômica e facial absoluta dos sujeitos.
            - Realize uma fusão perfeita de camadas (seamless blending) caso haja múltiplas imagens.
            - Aplique iluminação volumétrica coerente com o novo cenário.
            - Remova quaisquer distorções típicas de IA, focando em nitidez profissional.
            
            MARCA D'ÁGUA: Inclua "Morásio AI" e abaixo "Delvis de Morais" em caligrafia elegante no canto inferior direito.`,
          },
        ],
      },
      config: {
        temperature: 0.4, // Menor temperatura para maior fidelidade e consistência
        topP: 0.9,
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Erro Crítico Morásio AI:", error);
    throw error;
  }
}

export async function getSmartSuggestions(images: ImageInput[]): Promise<string[]> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const imageParts = images.map(img => ({
      inlineData: {
        data: img.data.split(',')[1] || img.data,
        mimeType: img.mimeType,
      },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          ...imageParts,
          { text: "Analise visualmente as imagens e sugira 3 edições artísticas de altíssimo nível (ex: transformações de época, fusões de cenários exóticos, ou melhorias de iluminação dramática) em Português. Retorne APENAS o array JSON de strings." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Erro de Sugestão Inteligente:", error);
    return [];
  }
}
