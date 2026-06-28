import React, { useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { CATEGORIES } from '../utils/meritHelpers';
import { OrnamentalDivider } from './OrnamentalDivider';
import { Search, Filter, Trash2 } from 'lucide-react';

export const HistoryLog: React.FC = () => {
  const { characters, currentCharacterId, logs, deleteLog } = useCharacterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const character = characters.find(c => c.id === currentCharacterId);

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-skyrim-ink/40 font-cinzel">
        <h3 className="text-sm font-bold tracking-widest uppercase">Sem Personagem Selecionado</h3>
      </div>
    );
  }

  // Filter logs for active character
  const charLogs = logs.filter(l => l.characterId === character.id);
  
  // Calculate total merits obtained
  const totalMerits = charLogs.reduce((sum, l) => sum + l.merits, 0);

  // Apply search & category filter
  const filteredLogs = charLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  const formatFullDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-full text-skyrim-ink animate-fadeIn">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="font-cinzel text-base font-bold tracking-widest text-skyrim-inkLight uppercase">
          2. Registro de Ações
        </h2>
        <OrnamentalDivider light={true} />
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="mt-2 grid grid-cols-12 gap-1.5 items-center bg-[#ebdcb9]/30 p-1.5 rounded border border-[#4a3f31]/10">
        <div className="col-span-7 relative flex items-center">
          <Search size={12} className="absolute left-2 text-[#4a3f31]/60" />
          <input
            type="text"
            placeholder="Buscar ação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f4ebd0] border border-[#4a3f31]/30 rounded pl-6 pr-1.5 py-1 text-[11px] text-[#2b2318] focus:outline-none focus:border-skyrim-gold placeholder-[#7d6f5c]"
          />
        </div>
        <div className="col-span-5 relative flex items-center">
          <Filter size={10} className="absolute left-2 text-[#4a3f31]/60" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-[#f4ebd0] border border-[#4a3f31]/30 rounded pl-5 pr-1 py-1 text-[11px] text-[#2b2318] focus:outline-none focus:border-skyrim-gold appearance-none"
          >
            <option value="all">Todas Cat.</option>
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACTION TABLE */}
      <div className="mt-4 flex-1 flex flex-col justify-between overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 border-b border-[#4a3f31]/30 pb-1.5 mb-1.5 text-[10px] font-bold font-cinzel tracking-wider text-skyrim-ink/65 uppercase select-none">
          <div className="col-span-6">Ação Realizada</div>
          <div className="col-span-3 text-center">Categoria</div>
          <div className="col-span-1.5 text-center">Pts</div>
          <div className="col-span-1.5 text-right">Data</div>
        </div>

        {/* Scrollable Rows */}
        <div className="flex-1 overflow-y-auto skyrim-scrollbar pr-1 max-h-[290px]">
          {filteredLogs.length === 0 ? (
            <div className="text-center font-serif italic text-skyrim-ink/50 py-8 text-xs">
              Nenhuma ação encontrada para os filtros aplicados.
            </div>
          ) : (
            <div className="divide-y divide-[#4a3f31]/10">
              {filteredLogs.map((log) => {
                const cat = CATEGORIES[log.category];
                const isPositive = log.merits >= 0;
                return (
                  <div 
                    key={log.id} 
                    className="grid grid-cols-12 items-center py-2 text-xs group hover:bg-[#ebdcb9]/30 rounded px-0.5 transition-colors duration-150"
                  >
                    {/* Action Description */}
                    <div className="col-span-6 font-serif text-[#3e3427] leading-tight break-words pr-2 relative flex items-start gap-1">
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="
                          opacity-0 group-hover:opacity-100 absolute -left-1 -top-0.5 p-0.5
                          text-skyrim-ink/40 hover:text-skyrim-crimson rounded transition-all duration-200
                        "
                        title="Remover feito"
                      >
                        <Trash2 size={11} />
                      </button>
                      <span className="group-hover:pl-4 transition-all duration-200">
                        {log.description}
                      </span>
                    </div>

                    {/* Category */}
                    <div 
                      className={`col-span-3 text-center font-cinzel text-[9px] font-bold tracking-wide`}
                      title={cat?.label}
                    >
                      <span className="inline-block px-1.5 py-0.5 bg-[#4a3f31]/5 border border-[#4a3f31]/10 rounded-sm">
                        <span className="mr-0.5 select-none">{cat?.emoji}</span>
                        <span className="hidden sm:inline">{cat?.label}</span>
                      </span>
                    </div>

                    {/* Merit Value */}
                    <div 
                      className={`col-span-1.5 text-center font-cinzel font-black tracking-wider text-[11px]
                        ${isPositive ? 'text-emerald-800' : 'text-rose-800'}
                      `}
                    >
                      {isPositive ? `+${log.merits}` : log.merits}
                    </div>

                    {/* Date */}
                    <div 
                      className="col-span-1.5 text-right font-sans font-semibold text-[10px] text-skyrim-ink/65"
                      title={formatFullDate(log.timestamp)}
                    >
                      {formatDate(log.timestamp)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM TOTAL SUMMARY */}
        <div className="mt-4 border-t border-[#4a3f31]/30 pt-3 text-center flex flex-col items-center select-none bg-[#e5d6b1]/10 rounded p-2">
          <span className="text-[10px] font-bold font-cinzel tracking-widest text-skyrim-ink/65 uppercase leading-none">
            TOTAL DE MÉRITOS OBTIDOS
          </span>
          <span className="font-cinzel text-3xl font-extrabold text-skyrim-goldDark mt-1 filter drop-shadow">
            {totalMerits}
          </span>
        </div>
      </div>
    </div>
  );
};
export default HistoryLog;
