import React, { useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { CharacterSelector } from '../components/CharacterSelector';
import { Dashboard } from '../components/Dashboard';
import { HistoryLog } from '../components/HistoryLog';
import { AddMeritPanel } from '../components/AddMeritPanel';
import { DataBackup } from '../components/DataBackup';
import { Plus, Scroll, Database, Swords, User, Trash2, ShieldAlert, RotateCcw } from 'lucide-react';
import { OrnamentalDivider } from '../components/OrnamentalDivider';

const SKYRIM_RACES = [
  'Nord', 'Imperial', 'Breton', 'Redguard', 
  'Altmer', 'Dunmer', 'Bosmer', 
  'Orsimer', 'Khajiit', 'Argonian'
];

export const MainPage: React.FC = () => {
  const { characters, currentCharacterId, addCharacter, deleteCharacter, setCurrentCharacter, resetCharacterPoints } = useCharacterStore();
  
  // Right page view state for Desktop
  const [rightPageView, setRightPageView] = useState<'log' | 'new' | 'backup'>('log');
  
  // Mobile tab state
  const [mobileView, setMobileView] = useState<'status' | 'diary' | 'character' | 'new' | 'backup'>('status');

  // Reset character points modal state
  const [isConfirmingReset, setIsConfirmingReset] = useState<string | null>(null);
  const [resetConfirmName, setResetConfirmName] = useState('');

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
                {rightPageView === 'new' && <AddMeritPanel onBack={() => setRightPageView('log')} />}
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
        {/* PARCHMENT PAGE AREA */}
        <div className="parchment-paper flex-1 rounded p-4 shadow-lg min-h-[460px] flex flex-col justify-between">
          {hasCharacters ? (
            <>
              {mobileView === 'status' && <Dashboard />}
              {mobileView === 'diary' && <HistoryLog />}
              {mobileView === 'new' && <AddMeritPanel onBack={() => setMobileView('diary')} />}
              {mobileView === 'character' && (
                <div className="flex flex-col h-full text-skyrim-ink animate-fadeIn">
                  <div className="text-center relative">
                    <h2 className="font-cinzel text-base font-bold tracking-widest text-[#2b2318] uppercase">
                      Salão dos Heróis
                    </h2>
                    <OrnamentalDivider light={true} />
                  </div>

                  <div className="mt-4 flex-1 overflow-y-auto skyrim-scrollbar pr-1 max-h-[300px] space-y-2">
                    {characters.map((char) => {
                      const isActive = char.id === currentCharacterId;
                      return (
                        <div
                          key={char.id}
                          className={`
                            flex items-center justify-between p-3 rounded border transition-all duration-300
                            ${isActive
                              ? 'bg-[#ebdcb9] border-[#4a3f31] shadow-md animate-fadeIn'
                              : 'bg-[#ebdcb9]/40 border-[#4a3f31]/20 hover:bg-[#e3d2ad]/60'
                            }
                          `}
                        >
                          <div 
                            onClick={() => setCurrentCharacter(char.id)}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-cinzel font-bold text-sm text-[#2b2318] uppercase flex items-center gap-1.5">
                              {char.name} 
                              {isActive && (
                                <span className="text-[9px] bg-skyrim-gold/30 text-skyrim-goldDark px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                                  Ativo
                                </span>
                              )}
                            </div>
                            <div className="font-serif text-xs text-[#7d6f5c] mt-0.5">
                              {char.race} • {char.class || 'Sem Classe'}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isActive && (
                              <button
                                onClick={() => setCurrentCharacter(char.id)}
                                className="px-2 py-1 bg-[#2b2318] text-[#ebdcb9] hover:bg-[#3d3222] rounded text-[10px] font-cinzel font-bold uppercase transition-all"
                              >
                                Ativar
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setIsConfirmingReset(char.id);
                                setResetConfirmName('');
                              }}
                              className="p-1.5 bg-amber-950/15 text-skyrim-goldDark hover:bg-amber-900/30 rounded transition-all font-bold"
                              title="Resetar pontos do personagem"
                            >
                              <RotateCcw size={13} />
                            </button>
                            <button
                              onClick={() => setIsConfirmingDelete(char.id)}
                              className="p-1.5 bg-rose-950/15 text-skyrim-crimson hover:bg-rose-900/30 rounded transition-all"
                              title="Excluir personagem"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#4a3f31]/20 flex flex-col gap-2">
                    <button
                      onClick={() => setIsCreatingChar(true)}
                      className="
                        w-full py-2.5 bg-[#2b2318] hover:bg-[#3d3222] text-[#ebdcb9] font-cinzel font-bold tracking-widest
                        rounded border border-[#4a3f31] shadow-md uppercase transition-all duration-300 text-xs flex items-center justify-center gap-1.5
                      "
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      <span>Criar Novo Herói</span>
                    </button>
                    
                    <button
                      onClick={() => setMobileView('backup')}
                      className="
                        w-full py-2 bg-[#ebdcb9]/40 hover:bg-[#e3d2ad]/60 text-skyrim-ink font-cinzel font-bold tracking-wider
                        rounded border border-[#4a3f31]/30 transition-all duration-300 text-xs flex items-center justify-center gap-1.5
                      "
                    >
                      <Database size={14} />
                      <span>Backup de Pergaminho</span>
                    </button>
                  </div>
                </div>
              )}
              {mobileView === 'backup' && <DataBackup onSuccess={() => setMobileView('character')} />}
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
              onClick={() => setMobileView('character')}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${mobileView === 'character' ? 'text-skyrim-gold' : 'text-[#8fa2ad]/60 hover:text-white'}`}
            >
              <Swords size={18} />
              <span className="text-[9px] font-cinzel font-bold mt-0.5 tracking-widest uppercase">Personagem</span>
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

      {/* MOBILE CONFIRM RESET POINTS MODAL OVERLAY */}
      {isConfirmingReset && (() => {
        const charToReset = characters.find(c => c.id === isConfirmingReset);
        return (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-[#12141c] max-w-sm w-full rounded border-2 border-skyrim-gold p-6 text-center text-gray-200 shadow-2xl">
              <div className="text-skyrim-gold flex justify-center mb-3">
                <RotateCcw size={48} className="animate-spin-slow" />
              </div>
              <h3 className="font-cinzel text-lg font-bold tracking-wider mb-2 text-skyrim-gold">
                RESETAR MÉRITOS DO HERÓI?
              </h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Esta ação é irreversível. Todos os méritos acumulados e perks resgatados de <strong className="text-white">"{charToReset?.name}"</strong> serão permanentemente apagados.
              </p>
              
              <div className="mb-4 text-left">
                <label className="block text-xs font-bold text-[#8fa2ad]/70 mb-1 font-cinzel uppercase">
                  Digite o nome do herói para confirmar:
                </label>
                <div className="text-xs italic text-skyrim-goldDark mb-1 select-none font-bold font-cinzel">
                  Nome esperado: {charToReset?.name}
                </div>
                <input
                  type="text"
                  placeholder="Nome do personagem..."
                  value={resetConfirmName}
                  onChange={(e) => setResetConfirmName(e.target.value)}
                  className="w-full bg-[#1e2330] border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-skyrim-gold"
                />
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setIsConfirmingReset(null);
                    setResetConfirmName('');
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm font-bold transition-all font-cinzel tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  disabled={resetConfirmName !== charToReset?.name}
                  onClick={() => {
                    resetCharacterPoints(isConfirmingReset);
                    setIsConfirmingReset(null);
                    setResetConfirmName('');
                    setMobileView('status');
                  }}
                  className={`px-4 py-2 rounded text-sm font-bold transition-all font-cinzel tracking-wider
                    ${resetConfirmName === charToReset?.name
                      ? 'bg-skyrim-gold text-[#0c0d0f] hover:bg-skyrim-goldLight shadow shadow-skyrim-gold'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-transparent'
                    }
                  `}
                >
                  Confirmar Reset
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
export default MainPage;
