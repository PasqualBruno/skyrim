import React, { useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { CharacterSelector } from '../components/CharacterSelector';
import { Dashboard } from '../components/Dashboard';
import { HistoryLog } from '../components/HistoryLog';
import { AddMeritPanel } from '../components/AddMeritPanel';
import { DataBackup } from '../components/DataBackup';
import { Plus, Scroll, Database, Swords, User, Trash2, ShieldAlert } from 'lucide-react';
import { OrnamentalDivider } from '../components/OrnamentalDivider';

const SKYRIM_RACES = [
  'Nord', 'Imperial', 'Breton', 'Redguard', 
  'Altmer', 'Dunmer', 'Bosmer', 
  'Orsimer', 'Khajiit', 'Argonian'
];

export const MainPage: React.FC = () => {
  const { characters, currentCharacterId, addCharacter, deleteCharacter, setCurrentCharacter } = useCharacterStore();
  
  // Right page view state for Desktop
  const [rightPageView, setRightPageView] = useState<'log' | 'new' | 'backup'>('log');
  
  // Mobile tab state
  const [mobileView, setMobileView] = useState<'status' | 'diary' | 'new' | 'backup'>('status');

  // Character creation form modal state
  const [isCreatingChar, setIsCreatingChar] = useState(false);
  const [newCharName, setNewCharName] = useState('');
  const [newCharRace, setNewCharRace] = useState('Nord');
  const [newCharClass, setNewCharClass] = useState('');

  // Delete confirmation modal state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);

  const activeChar = characters.find(c => c.id === currentCharacterId);
  const hasCharacters = characters.length > 0;

  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) return;
    addCharacter(newCharName, newCharRace, newCharClass);
    setNewCharName('');
    setNewCharClass('');
    setIsCreatingChar(false);
  };

  return (
    <div className="min-h-screen py-4 md:py-10 px-2 md:px-4 flex flex-col justify-between items-center relative pb-20 md:pb-10">
      
      {/* APP HEADER */}
      <header className="text-center select-none z-10 max-w-xl mb-4 w-full">
        <h1 className="font-cinzelDeco text-2xl md:text-3xl font-extrabold text-skyrim-gold tracking-[0.2em] md:tracking-[0.25em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] filter">
          DRAGONBORN CHRONICLE
        </h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="h-[1px] bg-skyrim-gold/30 w-8 md:w-12" />
          <span className="font-cinzel text-[10px] md:text-xs font-bold tracking-[0.15em] text-[#8fa2ad]/70 uppercase">
            Livro de Méritos e Progresso
          </span>
          <div className="h-[1px] bg-skyrim-gold/30 w-8 md:w-12" />
        </div>
      </header>

      {/* DESKTOP LAYOUT (Widescreen >= md) */}
      <main className="hidden md:flex w-full max-w-5xl my-auto relative items-center justify-center p-4">
        
        {/* CHARACTER TAB SELECTOR (LEFT MARGIN) */}
        {hasCharacters && <CharacterSelector />}

        {/* BOOK WRAPPER */}
        <div className="book-cover rounded-xl w-full flex flex-row relative z-0 min-h-[560px] max-w-4xl border border-[#4a3627]/60">
          
          {/* BOOK SPINE FOLD SHADOW (CENTRAL DIVIDER) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[40px] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#000]/30 to-transparent pointer-events-none z-20" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-r from-[#2b2017]/50 via-[#100b08]/80 to-[#2b2017]/50 pointer-events-none z-20 border-l border-r border-[#000]/25" />

          {/* LEFT PAGE CONTAINER */}
          <div className="flex-1 parchment-paper rounded-l-lg p-5 pr-8 relative overflow-hidden flex flex-col justify-between border-r border-[#4a3f31]/20">
            {hasCharacters ? (
              <Dashboard />
            ) : (
              <div className="flex flex-col justify-between h-full text-skyrim-ink animate-fadeIn">
                <div className="text-center">
                  <h2 className="font-cinzel text-base font-bold tracking-widest text-[#2b2318] uppercase">
                    A Saga Começa
                  </h2>
                  <OrnamentalDivider light={true} />
                </div>
                
                <div className="my-auto py-4 space-y-4 text-center font-serif text-skyrim-inkLight leading-relaxed">
                  <div className="flex justify-center text-skyrim-goldDark animate-pulse">
                    <Swords size={40} className="stroke-[1.5]" />
                  </div>
                  <p className="text-sm font-bold">
                    "Dovahkiin, Dovahkiin, naal ok zin los vahriin..."
                  </p>
                  <p className="text-xs">
                    Bem-vindo ao Diário do Dragonborn. Este registro ancestral foi projetado para documentar os feitos do seu herói pelas províncias geladas de Skyrim.
                  </p>
                  <p className="text-xs">
                    Ao completar feitos e escolhas, você acumulará **Méritos**. Cada **10 Méritos** podem ser resgatados por um **Ponto de Perk** para moldar suas habilidades.
                  </p>
                </div>

                <div className="text-center font-cinzel text-[9px] font-bold text-skyrim-ink/40 tracking-wider">
                  REGISTRADO EM LOCALSTORAGE
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PAGE CONTAINER */}
          <div className="flex-1 parchment-paper rounded-r-lg p-5 pl-8 relative overflow-hidden flex flex-col justify-between">
            {hasCharacters ? (
              <>
                {rightPageView === 'log' && <HistoryLog />}
                {rightPageView === 'new' && <AddMeritPanel onSuccess={() => setRightPageView('log')} />}
                {rightPageView === 'backup' && <DataBackup onSuccess={() => setRightPageView('log')} />}
              </>
            ) : (
              <div className="flex flex-col justify-between h-full text-skyrim-ink animate-fadeIn">
                <div className="text-center">
                  <h2 className="font-cinzel text-base font-bold tracking-widest text-[#2b2318] uppercase">
                    Criar Personagem
                  </h2>
                  <OrnamentalDivider light={true} />
                </div>

                <form onSubmit={handleCreateCharacter} className="my-auto space-y-4 max-w-sm mx-auto w-full">
                  <div>
                    <label className="block text-xs font-bold font-cinzel tracking-wider text-skyrim-ink/70 mb-1">
                      Nome do Herói
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ragnar Ironhand"
                      value={newCharName}
                      onChange={(e) => setNewCharName(e.target.value)}
                      className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] placeholder-[#7d6f5c] focus:outline-none focus:border-skyrim-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold font-cinzel tracking-wider text-skyrim-ink/70 mb-1">
                        Raça
                      </label>
                      <select
                        value={newCharRace}
                        onChange={(e) => setNewCharRace(e.target.value)}
                        className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] focus:outline-none focus:border-skyrim-gold"
                      >
                        {SKYRIM_RACES.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold font-cinzel tracking-wider text-skyrim-ink/70 mb-1">
                        Classe / Tipo
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Guerreiro"
                        value={newCharClass}
                        onChange={(e) => setNewCharClass(e.target.value)}
                        className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] placeholder-[#7d6f5c] focus:outline-none focus:border-skyrim-gold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="
                      w-full py-2.5 bg-[#2b2318] hover:bg-[#3d3222] text-[#ebdcb9] font-cinzel font-bold tracking-widest
                      rounded border border-[#4a3f31] shadow-md uppercase transition-all duration-300 hover:scale-[1.02]
                    "
                  >
                    Gravar nas Crônicas
                  </button>
                </form>

                <div className="text-center text-xs text-skyrim-inkLight italic font-serif">
                  *Crie seu primeiro herói para habilitar o livro.
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBOOK NAVIGATION TABS */}
          {hasCharacters && (
            <div className="absolute top-12 right-0 translate-x-[98%] flex flex-col gap-1.5 z-10 pointer-events-auto">
              <button
                onClick={() => setRightPageView('log')}
                className={`
                  px-3 py-2.5 rounded-r-md border-y border-r font-cinzel font-bold uppercase tracking-wider text-[11px]
                  w-[110px] hover:w-[125px] hover:translate-x-[4px] transition-all duration-300 text-left flex items-center gap-1.5
                  ${rightPageView === 'log'
                    ? 'bg-[#ebdcb9] text-[#2b2318] border-[#4a3f31] font-extrabold -translate-x-[4px]'
                    : 'bg-[#2b2017] text-[#d5c295] border-[#4a3627]/40 hover:bg-[#3d2e21]'
                  }
                `}
              >
                <Scroll size={12} className="flex-shrink-0" />
                <span>Diário</span>
              </button>

              <button
                onClick={() => setRightPageView('new')}
                className={`
                  px-3 py-2.5 rounded-r-md border-y border-r font-cinzel font-bold uppercase tracking-wider text-[11px]
                  w-[110px] hover:w-[125px] hover:translate-x-[4px] transition-all duration-300 text-left flex items-center gap-1.5
                  ${rightPageView === 'new'
                    ? 'bg-[#ebdcb9] text-[#2b2318] border-[#4a3f31] font-extrabold -translate-x-[4px]'
                    : 'bg-[#2b2017] text-[#d5c295] border-[#4a3627]/40 hover:bg-[#3d2e21]'
                  }
                `}
              >
                <Plus size={12} className="flex-shrink-0" />
                <span>Novo</span>
              </button>

              <button
                onClick={() => setRightPageView('backup')}
                className={`
                  px-3 py-2.5 rounded-r-md border-y border-r font-cinzel font-bold uppercase tracking-wider text-[11px]
                  w-[110px] hover:w-[125px] hover:translate-x-[4px] transition-all duration-300 text-left flex items-center gap-1.5
                  ${rightPageView === 'backup'
                    ? 'bg-[#ebdcb9] text-[#2b2318] border-[#4a3f31] font-extrabold -translate-x-[4px]'
                    : 'bg-[#2b2017] text-[#d5c295] border-[#4a3627]/40 hover:bg-[#3d2e21]'
                  }
                `}
              >
                <Database size={12} className="flex-shrink-0" />
                <span>Backup</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE LAYOUT (Screens < md) */}
      <main className="flex md:hidden flex-col w-full max-w-md mx-auto text-skyrim-ink bg-skyrim-bg relative p-1 flex-grow justify-start">
        {/* MOBILE PARCHMENT TOP PANEL FOR SWITCHING CHARACTERS */}
        <header className="mb-3">
          <div className="flex items-center justify-between gap-1.5 bg-[#ebdcb9] p-2 rounded border border-[#4a3f31] shadow-md">
            <div className="flex-1 min-w-0">
              {hasCharacters ? (
                <select
                  value={currentCharacterId || ''}
                  onChange={(e) => {
                    setCurrentCharacter(e.target.value);
                    setMobileView('status'); // Auto-return to status when switching chars
                  }}
                  className="w-full bg-transparent text-xs font-bold font-cinzel text-[#2b2318] focus:outline-none font-black uppercase truncate"
                >
                  {characters.map(char => (
                    <option key={char.id} value={char.id} className="bg-[#ebdcb9] text-[#2b2318]">
                      {char.name} ({char.race})
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs font-bold font-cinzel text-skyrim-ink/65 uppercase select-none">
                  Sem Herói Ativo
                </span>
              )}
            </div>

            <div className="flex gap-1 flex-shrink-0">
              {/* Add New Char button */}
              <button
                onClick={() => setIsCreatingChar(true)}
                className="p-1.5 bg-[#2b2318] text-[#ebdcb9] hover:bg-[#3d3222] rounded transition-all shadow"
                title="Criar novo personagem"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>

              {/* Trash current character */}
              {hasCharacters && activeChar && (
                <button
                  onClick={() => setIsConfirmingDelete(activeChar.id)}
                  className="p-1.5 bg-[#2b2318] text-skyrim-ink/50 hover:text-skyrim-crimson hover:bg-rose-950/20 rounded transition-all shadow"
                  title="Excluir personagem ativo"
                >
                  <Trash2 size={14} />
                </button>
              )}

              {/* Backup toggle */}
              {hasCharacters && (
                <button
                  onClick={() => setMobileView('backup')}
                  className={`p-1.5 rounded transition-all shadow ${mobileView === 'backup' ? 'bg-skyrim-gold text-[#0c0d0f]' : 'bg-[#2b2318] text-[#ebdcb9]'}`}
                  title="Backup de pergaminho"
                >
                  <Database size={14} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* PARCHMENT PAGE AREA */}
        <div className="parchment-paper flex-1 rounded p-4 shadow-lg min-h-[460px] flex flex-col justify-between">
          {hasCharacters ? (
            <>
              {mobileView === 'status' && <Dashboard />}
              {mobileView === 'diary' && <HistoryLog />}
              {mobileView === 'new' && <AddMeritPanel onSuccess={() => setMobileView('diary')} />}
              {mobileView === 'backup' && <DataBackup onSuccess={() => setMobileView('status')} />}
            </>
          ) : (
            /* MOBILE FIRST CHARACTER CREATION FLOW */
            <div className="flex flex-col justify-between h-full text-skyrim-ink animate-fadeIn">
              <div className="text-center">
                <h2 className="font-cinzel text-base font-bold tracking-widest text-[#2b2318] uppercase">
                  Criar Personagem
                </h2>
                <OrnamentalDivider light={true} />
              </div>

              <form onSubmit={handleCreateCharacter} className="my-auto space-y-4 w-full">
                <div>
                  <label className="block text-xs font-bold font-cinzel tracking-wider text-skyrim-ink/75 mb-1">
                    Nome do Herói
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ragnar Ironhand"
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] placeholder-[#7d6f5c] focus:outline-none focus:border-skyrim-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold font-cinzel tracking-wider text-skyrim-ink/75 mb-1">
                      Raça
                    </label>
                    <select
                      value={newCharRace}
                      onChange={(e) => setNewCharRace(e.target.value)}
                      className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] focus:outline-none focus:border-skyrim-gold"
                    >
                      {SKYRIM_RACES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold font-cinzel tracking-wider text-skyrim-ink/75 mb-1">
                      Classe / Tipo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Stealth Archer"
                      value={newCharClass}
                      onChange={(e) => setNewCharClass(e.target.value)}
                      className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] placeholder-[#7d6f5c] focus:outline-none focus:border-skyrim-gold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="
                    w-full py-2.5 bg-[#2b2318] hover:bg-[#3d3222] text-[#ebdcb9] font-cinzel font-bold tracking-widest
                    rounded border border-[#4a3f31] shadow-md uppercase transition-all duration-300 hover:scale-[1.02]
                  "
                >
                  Gravar nas Crônicas
                </button>
              </form>

              <div className="text-center text-xs text-skyrim-inkLight italic font-serif mt-4">
                *Crie seu primeiro herói para habilitar o livro.
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION TABS FOR MOBILE */}
        {hasCharacters && (
          <div className="fixed bottom-0 left-0 right-0 h-14 bg-[#120e0a] border-t border-[#4a3627]/60 flex items-center justify-around z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.5)] px-2">
            <button
              onClick={() => setMobileView('status')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${mobileView === 'status' ? 'text-skyrim-gold' : 'text-[#8fa2ad]/60 hover:text-white'}`}
            >
              <User size={18} />
              <span className="text-[9px] font-cinzel font-bold mt-0.5 tracking-widest uppercase">Status</span>
            </button>
            
            <button
              onClick={() => setMobileView('diary')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${mobileView === 'diary' ? 'text-skyrim-gold' : 'text-[#8fa2ad]/60 hover:text-white'}`}
            >
              <Scroll size={18} />
              <span className="text-[9px] font-cinzel font-bold mt-0.5 tracking-widest uppercase">Diário</span>
            </button>
            
            <button
              onClick={() => setMobileView('new')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${mobileView === 'new' ? 'text-skyrim-gold' : 'text-[#8fa2ad]/60 hover:text-white'}`}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="text-[9px] font-cinzel font-bold mt-0.5 tracking-widest uppercase">Novo</span>
            </button>
          </div>
        )}
      </main>

      {/* FOOTER DESCRIPTOR */}
      <footer className="hidden md:block text-center font-serif text-[11px] text-[#8fa2ad]/40 select-none z-10 max-w-sm mt-4">
        {activeChar ? (
          <p>
            Cronista ativo: <span className="text-[#8fa2ad]/60 font-cinzel font-bold">{activeChar.name}</span> ({activeChar.race} {activeChar.class})
          </p>
        ) : (
          <p>Nenhuma crônica ativa nas terras de Skyrim.</p>
        )}
      </footer>

      {/* GLOBAL CREATE CHARACTER MODAL OVERLAY */}
      {isCreatingChar && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="parchment-paper max-w-md w-full rounded border-2 border-skyrim-gold p-6 shadow-skyrim-gold-lg relative text-skyrim-ink">
            <h3 className="font-cinzel text-xl font-bold tracking-widest text-[#2b2318] text-center border-b border-[#4a3f31]/30 pb-2 mb-4">
              NOVO PERSONAGEM
            </h3>
            
            <form onSubmit={handleCreateCharacter} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold font-cinzel tracking-wider text-[#4a3f31] mb-1">
                  Nome do Personagem
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ragnar Ironhand"
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] placeholder-[#7d6f5c] focus:outline-none focus:border-skyrim-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-cinzel tracking-wider text-[#4a3f31] mb-1">
                    Raça
                  </label>
                  <select
                    value={newCharRace}
                    onChange={(e) => setNewCharRace(e.target.value)}
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
                    value={newCharClass}
                    onChange={(e) => setNewCharClass(e.target.value)}
                    className="w-full bg-[#dfd0aa] border border-[#4a3f31]/50 rounded px-3 py-2 text-sm text-[#2b2318] placeholder-[#7d6f5c] focus:outline-none focus:border-skyrim-gold"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4 pt-3 border-t border-[#4a3f31]/20">
                <button
                  type="button"
                  onClick={() => setIsCreatingChar(false)}
                  className="px-4 py-2 border border-[#4a3f31]/50 rounded text-sm text-[#4a3f31] hover:bg-[#e3d2ad] font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2b2318] hover:bg-[#3d3222] text-[#ebdcb9] rounded text-sm font-bold shadow-md animate-pulse"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL CONFIRM DELETE MODAL OVERLAY */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#12141c] max-w-sm w-full rounded border border-red-800 p-6 text-center text-gray-200 shadow-2xl">
            <div className="text-red-600 flex justify-center mb-3">
              <ShieldAlert size={48} className="animate-bounce" />
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
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteCharacter(isConfirmingDelete);
                  setIsConfirmingDelete(null);
                  setMobileView('status'); // Return mobile view to status
                }}
                className="px-4 py-2 bg-red-850 hover:bg-red-700 text-white rounded text-sm font-bold transition-all"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MainPage;
