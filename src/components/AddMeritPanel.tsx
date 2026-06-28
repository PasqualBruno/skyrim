import React, { useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { CATEGORIES } from '../utils/meritHelpers';
import { OrnamentalDivider } from './OrnamentalDivider';
import { Plus, ArrowLeft } from 'lucide-react';
import type { MeritCategory } from '../types';

interface AddMeritPanelProps {
  onSuccess: () => void;
}

interface PresetItem {
  text: string;
  value: number;
}

// Unified positive and negative presets per category
const ALL_PRESETS: Record<MeritCategory, PresetItem[]> = {
  combate: [
    { text: 'Derrotar um pequeno grupo de inimigos', value: 2 },
    { text: 'Sobreviver a uma situação perigosa', value: 2 },
    { text: 'Derrotar um chefe de dungeon', value: 5 },
    { text: 'Derrotar um inimigo poderoso', value: 5 },
    { text: 'Derrotar um dragão', value: 10 },
    { text: 'Derrotar um inimigo lendário', value: 10 },
    { text: 'Derrotar um grande vilão', value: 25 },
    { text: 'Derrotar Alduin', value: 25 },
    { text: 'Derrotar Miraak', value: 25 },
    { text: 'Fugi covardemente de um duelo de honra', value: -2 },
    { text: 'Causou a morte de um aliado por negligência', value: -10 },
  ],
  exploracao: [
    { text: 'Descobrir 5 novos locais', value: 2 },
    { text: 'Encontrar um acampamento abandonado', value: 2 },
    { text: 'Limpar uma dungeon', value: 5 },
    { text: 'Limpar uma caverna', value: 5 },
    { text: 'Limpar um acampamento inimigo', value: 5 },
    { text: 'Descobrir uma área importante', value: 5 },
    { text: 'Encontrar um grande tesouro', value: 10 },
    { text: 'Descobrir uma grande ruína nórdica', value: 10 },
    { text: 'Perdeu-se nas profundezas de Blackreach', value: -2 },
  ],
  missoes: [
    { text: 'Completar uma missão secundária simples', value: 2 },
    { text: 'Entregar um item importante para alguém', value: 2 },
    { text: 'Completar uma quest secundária longa', value: 5 },
    { text: 'Entrar em uma grande facção', value: 10 },
    { text: 'Completar uma linha importante de quests', value: 10 },
    { text: 'Completar uma missão que afeta uma região', value: 10 },
    { text: 'Completar uma facção inteira', value: 25 },
    { text: 'Completar a história principal', value: 25 },
    { text: 'Completar uma DLC', value: 25 },
    { text: 'Abandonou uma missão importante', value: -2 },
    { text: 'Traiu uma facção', value: -5 },
  ],
  conhecimento: [
    { text: 'Ler um livro raro ou encontrar conhecimento perdido', value: 2 },
    { text: 'Recuperar uma palavra de poder', value: 5 },
    { text: 'Encontrar um artefato único', value: 5 },
    { text: 'Destruiu um manuscrito antigo por acidente', value: -2 },
  ],
  influencia: [
    { text: 'Ajudar um cidadão de Skyrim', value: 2 },
    { text: 'Resolver um problema local', value: 2 },
    { text: 'Fazer uma boa ação sem recompensa', value: 2 },
    { text: 'Resolver um conflito entre grupos', value: 5 },
    { text: 'Ser reconhecido por uma cidade/região (Thane)', value: 10 },
    { text: 'Salvar Skyrim de uma grande ameaça', value: 25 },
    { text: 'Tornar-se uma figura conhecida em todo o reino', value: 25 },
    { text: 'Cometeu um crime hediondo e foi preso em Whiterun', value: -5 },
  ],
};


export const AddMeritPanel: React.FC<AddMeritPanelProps> = ({ onSuccess }) => {
  const { currentCharacterId, addLog } = useCharacterStore();
  const [category, setCategory] = useState<MeritCategory>('combate');
  const [customDesc, setCustomDesc] = useState('');
  const [customValue, setCustomValue] = useState<string>('5');

  const presets = ALL_PRESETS[category];

  const handleAddPresetLog = (preset: PresetItem) => {
    if (!currentCharacterId) return;
    addLog(currentCharacterId, preset.text, category, preset.value);
    onSuccess();
  };

  const handleAddCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCharacterId || !customDesc.trim()) return;
    
    const numericValue = parseInt(customValue, 10);
    if (isNaN(numericValue) || numericValue === 0) return;

    addLog(currentCharacterId, customDesc.trim(), category, numericValue);
    setCustomDesc('');
    setCustomValue('5');
    onSuccess();
  };

  return (
    <div className="flex flex-col h-full text-skyrim-ink animate-fadeIn">
      {/* HEADER */}
      <div className="text-center relative">
        <button
          onClick={onSuccess}
          className="absolute left-0 top-1 text-skyrim-ink/65 hover:text-skyrim-ink flex items-center gap-1 text-xs font-bold font-cinzel"
        >
          <ArrowLeft size={14} />
          <span>Voltar</span>
        </button>
        <h2 className="font-cinzel text-base font-bold tracking-widest text-skyrim-inkLight uppercase">
          Novo Registro
        </h2>
        <OrnamentalDivider light={true} className="mt-2" />
      </div>

      {/* CATEGORIES BUTTON GRID */}
      <div className="mt-3">
        <label className="block text-[10px] font-bold font-cinzel tracking-wider text-skyrim-ink/60 uppercase mb-1.5 text-center">
          Selecione a Categoria
        </label>
        <div className="grid grid-cols-5 gap-1">
          {Object.values(CATEGORIES).map((cat) => {
            const isSelected = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`
                  flex flex-col items-center justify-center p-2 rounded transition-all duration-300 border
                  ${isSelected 
                    ? 'bg-[#2b2318] text-[#ebdcb9] border-[#2b2318] scale-[1.03] shadow-md' 
                    : 'bg-[#ebdcb9]/40 text-skyrim-ink/75 border-[#4a3f31]/20 hover:bg-[#e3d2ad]/60'
                  }
                `}
                title={cat.label}
              >
                <span className="text-lg select-none mb-0.5">{cat.emoji}</span>
                <span className="text-[8px] font-bold font-cinzel tracking-widest uppercase leading-none truncate w-full text-center">
                  {cat.label.slice(0, 5)}.
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRESETS LIST WITH INSTANT "+" CLICK LOGGER */}
      <div className="mt-4 flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <span className="block text-[10px] font-bold font-cinzel tracking-wider text-skyrim-ink/60 uppercase mb-2">
            Feitos Comuns e Consequências
          </span>
          <div className="flex flex-col gap-1 overflow-y-auto skyrim-scrollbar pr-1 bg-[#ebdcb9]/20 rounded border border-[#4a3f31]/10 p-1.5 max-h-[200px]">
            {presets.map((preset, index) => {
              const isPositive = preset.value >= 0;
              return (
                <div 
                  key={index} 
                  className="
                    flex items-center justify-between p-1.5 rounded transition-all duration-150 text-xs
                    hover:bg-[#dfd0aa] border border-transparent hover:border-[#4a3f31]/15 group
                  "
                >
                  <span className="font-serif text-[#3e3427] leading-tight truncate pr-2">
                    "{preset.text}"
                  </span>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span 
                      className={`font-cinzel font-bold text-[10px] tracking-wider
                        ${isPositive ? 'text-emerald-800' : 'text-rose-800'}
                      `}
                    >
                      {isPositive ? `+${preset.value}` : preset.value}
                    </span>
                    
                    <button
                      onClick={() => handleAddPresetLog(preset)}
                      className="
                        p-1 rounded bg-[#2b2318]/90 text-[#ebdcb9] hover:bg-emerald-800 hover:text-white 
                        transition-all duration-200 shadow-sm flex items-center justify-center hover:scale-105
                      "
                      title="Registrar feito instantaneamente"
                    >
                      <Plus size={11} strokeWidth={3.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CUSTOM DEED REGISTRY ROW */}
        <div className="mt-4 pt-3 border-t border-[#4a3f31]/15 pb-2">
          <span className="block text-[10px] font-bold font-cinzel tracking-wider text-skyrim-ink/60 uppercase mb-2">
            Registrar Feito Personalizado
          </span>
          <form onSubmit={handleAddCustomLog} className="flex gap-2 items-center">
            {/* Description Input */}
            <div className="flex-1">
              <input
                type="text"
                required
                placeholder="Escreva o feito..."
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                className="w-full bg-[#ebdcb9]/40 border border-[#4a3f31]/30 rounded px-2 py-1.5 text-xs text-skyrim-ink placeholder-skyrim-ink/40 focus:outline-none focus:border-[#2b2318]"
              />
            </div>
            
            {/* Value Input */}
            <div className="w-[64px]">
              <input
                type="number"
                required
                placeholder="Pts"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full bg-[#ebdcb9]/40 border border-[#4a3f31]/30 rounded px-1.5 py-1.5 text-xs text-skyrim-ink text-center focus:outline-none focus:border-[#2b2318]"
                title="Pontos de mérito (números negativos representam perdas)"
              />
            </div>
            
            {/* Instant Add Button */}
            <button
              type="submit"
              disabled={!customDesc.trim() || !customValue}
              className={`
                p-1.5 rounded transition-all duration-200 border flex items-center justify-center shadow-sm flex-shrink-0
                ${customDesc.trim() && customValue
                  ? 'bg-[#2b2318] text-[#ebdcb9] hover:bg-emerald-800 hover:text-white border-[#2b2318] hover:scale-105'
                  : 'bg-[#d8c8a4]/50 text-skyrim-ink/30 border-transparent cursor-not-allowed'
                }
              `}
              title="Registrar feito personalizado"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddMeritPanel;
