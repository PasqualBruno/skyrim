import React from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { getTitleInfo, getPerkInfo, CATEGORIES } from '../utils/meritHelpers';
import { OrnamentalDivider } from './OrnamentalDivider';
import { SkillProgressBar } from './SkillProgressBar';
import { Sparkles, Trophy, Award } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { characters, currentCharacterId, logs, redeemPerk } = useCharacterStore();

  const character = characters.find(c => c.id === currentCharacterId);

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-skyrim-ink/60 font-cinzel">
        <Award size={48} className="stroke-1 mb-4 opacity-50" />
        <h3 className="text-lg font-bold tracking-widest uppercase">Nenhum Dragonborn Encontrado</h3>
        <p className="text-xs font-sans mt-2 max-w-[280px]">
          Crie um novo personagem usando a aba lateral esquerda para começar a registrar sua jornada.
        </p>
      </div>
    );
  }

  // Filter logs for this character
  const charLogs = logs.filter(l => l.characterId === character.id);
  
  // Calculate total historical merits
  const totalHistoricalMerits = charLogs.reduce((sum, l) => sum + l.merits, 0);

  // Get Title info
  const titleInfo = getTitleInfo(totalHistoricalMerits);

  // Get Perk info
  const perkInfo = getPerkInfo(totalHistoricalMerits, character.perksRedeemed);

  // Calculate category distributions
  const categoryScores = {
    combate: 0,
    exploracao: 0,
    missoes: 0,
    conhecimento: 0,
    influencia: 0,
  };
  charLogs.forEach(log => {
    if (categoryScores[log.category] !== undefined) {
      categoryScores[log.category] += log.merits;
    }
  });

  // Calculate merits needed for next perk
  const meritsNeeded = perkInfo.nextPerkCost - perkInfo.progressToNext;

  // Last 3 achievements
  const lastAchievements = charLogs.slice(0, 3);

  const handleRedeemPerk = () => {
    if (perkInfo.canRedeem) {
      redeemPerk(character.id);
    }
  };

  return (
    <div className="flex flex-col h-full text-skyrim-ink animate-fadeIn">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="font-cinzel text-base font-bold tracking-widest text-skyrim-inkLight uppercase flex items-center justify-center gap-2">
          <span>1. Méritos do Dragonborn</span>
        </h2>
        <OrnamentalDivider light={true} />
        <h3 className="font-cinzel text-xs font-bold tracking-widest text-skyrim-ink/60 uppercase mt-1">
          Resumo Geral
        </h3>
      </div>

      {/* SUMMARY BOX (Current Merits & Next Reward) */}
      <div className="grid grid-cols-2 border border-[#4a3f31]/30 rounded-sm mt-4 bg-[#e5d6b1]/40 divide-x divide-[#4a3f31]/30">
        <div className="p-3 text-center flex flex-col justify-center">
          <span className="text-[10px] font-bold font-cinzel tracking-wider text-skyrim-ink/65 uppercase">
            MÉRITOS ATUAIS
          </span>
          <div className="flex items-baseline justify-center gap-1.5 mt-1">
            <span className="font-cinzel text-3xl font-extrabold text-skyrim-ink">
              {perkInfo.currentMerits}
            </span>
            <span className="font-cinzel text-sm text-skyrim-ink/50">
              / {titleInfo.maxMerits === Infinity ? '∞' : titleInfo.maxMerits + 1}
            </span>
          </div>
          <span className="text-[9px] font-bold text-skyrim-ink/55 mt-0.5 tracking-tighter">
            (Total Obtido: {totalHistoricalMerits})
          </span>
        </div>

        <div className="p-3 flex flex-col justify-center text-center">
          <span className="text-[10px] font-bold font-cinzel tracking-wider text-skyrim-ink/65 uppercase">
            PRÓXIMA RECOMPENSA
          </span>
          <div className="text-xs font-sans mt-2 font-semibold text-skyrim-ink/80 leading-snug">
            {perkInfo.canRedeem ? (
              <span className="text-emerald-800 font-bold block animate-pulse">
                Pontos de Perk prontos para resgate!
              </span>
            ) : (
              <span>
                Faltam <strong className="font-bold text-skyrim-crimson">{meritsNeeded}</strong> {meritsNeeded === 1 ? 'mérito' : 'méritos'} para ganhar 1 ponto de perk.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SKILL LEVEL PROGRESS BAR */}
      <div className="mt-4 px-1">
        <SkillProgressBar value={perkInfo.progressToNext} max={10} />
      </div>

      {/* CURRENT TITLE */}
      <div className="mt-5 text-center">
        <span className="text-[10px] font-bold font-cinzel tracking-widest text-skyrim-ink/60 uppercase">
          TÍTULO ATUAL
        </span>
        <h4 className="font-cinzel text-lg font-black text-skyrim-goldDark tracking-widest uppercase mt-0.5">
          {titleInfo.name}
        </h4>
        
        {/* Diamond Rank Indicator */}
        <div className="flex justify-center items-center gap-1.5 my-1.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const isActive = titleInfo.rankIndex >= i;
            return (
              <React.Fragment key={i}>
                {i > 0 && <div className={`w-3.5 h-[1px] ${isActive ? 'bg-skyrim-gold' : 'bg-skyrim-ink/20'}`} />}
                <div 
                  className={`
                    w-2.5 h-2.5 transform rotate-45 border transition-all duration-500
                    ${isActive 
                      ? 'bg-skyrim-gold border-skyrim-goldDark shadow-[0_0_5px_rgba(197,155,39,0.5)]' 
                      : 'bg-[#ebdcb9] border-skyrim-ink/30'
                    }
                  `}
                  title={titleInfo.name}
                />
              </React.Fragment>
            );
          })}
        </div>

        <p className="text-xs font-serif italic text-skyrim-inkLight leading-relaxed max-w-[280px] mx-auto px-2">
          "{titleInfo.lore}"
        </p>
      </div>

      {/* REDEEM PERK ACTION */}
      <div className="mt-4 p-2 bg-[#ebdcb9] border border-[#4a3f31]/20 rounded flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#4a3f31]/10 rounded-full text-skyrim-goldDark">
            <Trophy size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-wider text-skyrim-ink/60 uppercase">
              PERKS RESGATADOS
            </div>
            <div className="text-sm font-bold font-cinzel text-skyrim-ink">
              {character.perksRedeemed} {character.perksRedeemed === 1 ? 'Ponto' : 'Pontos'}
            </div>
          </div>
        </div>

        <button
          onClick={handleRedeemPerk}
          disabled={!perkInfo.canRedeem}
          className={`
            px-3 py-1.5 rounded font-cinzel text-xs font-bold tracking-widest uppercase transition-all duration-300
            flex items-center gap-1.5 shadow
            ${perkInfo.canRedeem 
              ? 'bg-skyrim-gold hover:bg-skyrim-goldLight text-[#0c0d0f] animate-bounce hover:scale-105 border border-skyrim-goldDark shadow-skyrim-gold'
              : 'bg-[#d8c8a4] text-skyrim-ink/40 border border-skyrim-ink/10 cursor-not-allowed'
            }
          `}
        >
          <span>Resgatar Perk</span>
          <Sparkles size={11} className={perkInfo.canRedeem ? 'animate-pulse' : ''} />
        </button>
      </div>

      {/* CATEGORIES & RULES SIDE-BY-SIDE */}
      <div className="grid grid-cols-12 gap-3 mt-5">
        {/* Categories Scores */}
        <div className="col-span-6 flex flex-col gap-1.5 justify-center">
          <span className="text-[10px] font-bold font-cinzel tracking-wider text-skyrim-ink/65 uppercase border-b border-[#4a3f31]/25 pb-0.5">
            CATEGORIAS
          </span>
          {Object.values(CATEGORIES).map((cat) => {
            const score = categoryScores[cat.key];
            return (
              <div key={cat.key} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 font-bold text-skyrim-ink/85">
                  <span className="text-sm select-none">{cat.emoji}</span>
                  <span className="font-cinzel tracking-wider text-[11px] font-semibold">{cat.label}</span>
                </span>
                <span className="font-cinzel font-bold text-skyrim-inkLight">{score}</span>
              </div>
            );
          })}
        </div>

        {/* Rules Box */}
        <div className="col-span-6 border border-[#4a3f31]/25 rounded bg-[#ebdcb9]/30 p-2 text-[10px] flex flex-col justify-between">
          <div className="text-center font-cinzel font-bold border-b border-[#4a3f31]/15 pb-0.5 mb-1 uppercase tracking-wider text-skyrim-ink/70">
            Como Ganhar
          </div>
          <ul className="space-y-0.5 list-disc pl-3.5 text-skyrim-inkLight leading-tight">
            <li>Menores <span className="font-bold text-skyrim-ink">+2</span></li>
            <li>Importantes <span className="font-bold text-skyrim-ink">+5</span></li>
            <li>Grandes <span className="font-bold text-skyrim-ink">+10</span></li>
            <li>Lendários <span className="font-bold text-skyrim-ink">+25</span></li>
          </ul>
          <div className="border-t border-[#4a3f31]/15 pt-1 mt-1 text-center font-bold font-cinzel text-[9px] text-skyrim-ink/60 tracking-wider">
            10 MÉRITOS = 1 PERK
          </div>
        </div>
      </div>

      {/* LAST ACHIEVEMENTS */}
      <div className="mt-5 border-t border-[#4a3f31]/20 pt-4 flex-1 flex flex-col justify-end">
        <h4 className="text-[10px] font-bold font-cinzel tracking-wider text-skyrim-ink/65 uppercase mb-2">
          ÚLTIMAS CONQUISTAS
        </h4>
        <div className="space-y-1.5 flex-1 min-h-[70px]">
          {lastAchievements.length === 0 ? (
            <div className="text-xs font-serif italic text-skyrim-ink/50 py-2">
              Nenhuma ação registrada neste livro ainda...
            </div>
          ) : (
            lastAchievements.map((log) => {
              const cat = CATEGORIES[log.category];
              const isPositive = log.merits >= 0;
              return (
                <div key={log.id} className="text-xs flex items-start gap-1">
                  <span className="text-xs mt-0.5 select-none text-skyrim-ink/60">✦</span>
                  <div className="flex-1 font-serif text-[#3e3427] leading-snug">
                    <span className="font-sans font-bold text-[10px] mr-1 select-none">
                      [{cat?.emoji}]
                    </span>
                    {log.description}
                    <span className={`ml-1.5 font-bold font-cinzel tracking-wider ${isPositive ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {isPositive ? `+${log.merits}` : log.merits}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
