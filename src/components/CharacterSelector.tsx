import React, { useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';

const SKYRIM_RACES = [
  'Nord', 'Imperial', 'Breton', 'Redguard', 
  'Altmer (High Elf)', 'Dunmer (Dark Elf)', 'Bosmer (Wood Elf)', 
  'Orsimer (Orc)', 'Khajiit', 'Argonian'
];

export const CharacterSelector: React.FC = () => {
  const { characters, currentCharacterId, addCharacter, deleteCharacter, setCurrentCharacter } = useCharacterStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [race, setRace] = useState('Nord');
  const [className, setClassName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCharacter(name, race, className);
    setName('');
    setClassName('');
    setIsCreating(false);
  };

  const activeCharacter = characters.find(c => c.id === currentCharacterId);

  return (
    <div className="relative">
      {/* LEFT SIDEBOOK TABS - Sticking out from the book */}
      <div className="absolute top-12 left-0 -translate-x-[98%] flex flex-col gap-1.5 z-10 items-end max-w-[140px] pointer-events-auto">
        {characters.map((char) => {
          const isActive = char.id === currentCharacterId;
          return (
            <button
              key={char.id}
              onClick={() => setCurrentCharacter(char.id)}
              className={`
                px-3 py-2 text-[11px] font-cinzel tracking-wider rounded-l-md font-bold uppercase transition-all duration-300
                border-y border-l shadow-md truncate w-[110px] hover:w-[125px] text-right
                ${isActive 
                  ? 'bg-[#ebdcb9] text-[#2b2318] border-[#4a3f31] font-extrabold translate-x-[4px]' 
                  : 'bg-[#2b2017] text-[#d5c295] border-[#4a3627]/40 hover:bg-[#3d2e21]'
                }
              `}
              title={`${char.name} (${char.race} ${char.class})`}
            >
              <span className="block truncate">{char.name.split(',')[0]}</span>
            </button>
          );
        })}

        {/* CREATE CHARACTER BUTTON */}
        <button
          onClick={() => setIsCreating(true)}
          className="
            px-3 py-2 bg-skyrim-gold hover:bg-skyrim-goldLight text-[#0c0d0f] font-bold font-cinzel tracking-widest
            rounded-l-md border-y border-l border-skyrim-goldDark shadow-md transition-all duration-300
            flex items-center justify-end gap-1.5 w-[110px] hover:w-[125px] text-[11px] uppercase
          "
        >
          <span>Criar</span>
          <Plus size={11} strokeWidth={3} />
        </button>
      </div>

      {/* CREATE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="parchment-paper max-w-md w-full rounded border-2 border-skyrim-gold p-6 shadow-skyrim-gold-lg relative">
            <h3 className="font-cinzel text-xl font-bold tracking-widest text-[#2b2318] text-center border-b border-[#4a3f31]/30 pb-2 mb-4">
              NOVO PERSONAGEM
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold font-cinzel tracking-wider text-[#4a3f31] mb-1">
                  Nome do Personagem
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ragnar Ironhand"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] placeholder-[#7d6f5c] focus:outline-none focus:border-skyrim-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-cinzel tracking-wider text-[#4a3f31] mb-1">
                    Raça
                  </label>
                  <select
                    value={race}
                    onChange={(e) => setRace(e.target.value)}
                    className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] focus:outline-none focus:border-skyrim-gold"
                  >
                    {SKYRIM_RACES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold font-cinzel tracking-wider text-[#4a3f31] mb-1">
                    Classe / Arquétipo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Stealth Archer"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] placeholder-[#7d6f5c] focus:outline-none focus:border-skyrim-gold"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4 pt-3 border-t border-[#4a3f31]/20">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-[#4a3f31]/50 rounded text-sm text-[#4a3f31] hover:bg-[#e3d2ad] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2b2318] hover:bg-[#3d3222] text-[#ebdcb9] rounded text-sm font-bold shadow-md"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#12141c] max-w-sm w-full rounded border-2 border-red-800 p-6 text-center text-gray-200">
            <div className="text-red-600 flex justify-center mb-3">
              <ShieldAlert size={48} />
            </div>
            <h3 className="font-cinzel text-lg font-bold tracking-wider mb-2 text-red-500">
              DELETAR PERSONAGEM?
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Isso apagará permanentemente o personagem e todo o seu histórico de feitos no Diário. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsConfirmingDelete(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteCharacter(isConfirmingDelete);
                  setIsConfirmingDelete(null);
                }}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded text-sm font-bold"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRASH TRIGGER FOR CURRENT ACTIVE CHARACTER */}
      {activeCharacter && (
        <button
          onClick={() => setIsConfirmingDelete(activeCharacter.id)}
          className="absolute -top-11 right-4 p-1.5 text-skyrim-ink/50 hover:text-skyrim-crimson transition-colors z-10"
          title="Excluir personagem atual"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};
export default CharacterSelector;
