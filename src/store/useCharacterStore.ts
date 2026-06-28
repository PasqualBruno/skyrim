import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character, AchievementLog, MeritCategory } from '../types';

interface CharacterState {
  characters: Character[];
  currentCharacterId: string | null;
  logs: AchievementLog[];
  addCharacter: (name: string, race?: string, className?: string) => void;
  deleteCharacter: (id: string) => void;
  setCurrentCharacter: (id: string | null) => void;
  addLog: (characterId: string, description: string, category: MeritCategory, merits: number) => void;
  deleteLog: (logId: string) => void;
  redeemPerk: (characterId: string) => void;
  importData: (characters: Character[], logs: AchievementLog[], currentCharacterId: string | null) => void;
}

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set) => ({
      characters: [],
      currentCharacterId: null,
      logs: [],

      addCharacter: (name, race, className) => set((state) => {
        const newChar: Character = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
          name,
          race: race || '',
          class: className || '',
          createdAt: Date.now(),
          perksRedeemed: 0,
        };
        const nextCharacters = [...state.characters, newChar];
        return {
          characters: nextCharacters,
          currentCharacterId: state.currentCharacterId ? state.currentCharacterId : newChar.id,
        };
      }),

      deleteCharacter: (id) => set((state) => {
        const nextCharacters = state.characters.filter((c) => c.id !== id);
        const nextLogs = state.logs.filter((l) => l.characterId !== id);
        let nextCurrentId = state.currentCharacterId;
        if (state.currentCharacterId === id) {
          nextCurrentId = nextCharacters.length > 0 ? nextCharacters[0].id : null;
        }
        return {
          characters: nextCharacters,
          logs: nextLogs,
          currentCharacterId: nextCurrentId,
        };
      }),

      setCurrentCharacter: (id) => set({ currentCharacterId: id }),

      addLog: (characterId, description, category, merits) => set((state) => {
        const newLog: AchievementLog = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
          characterId,
          description,
          category,
          merits,
          timestamp: Date.now(),
        };
        return {
          logs: [newLog, ...state.logs],
        };
      }),

      deleteLog: (logId) => set((state) => {
        const logToDelete = state.logs.find(l => l.id === logId);
        if (!logToDelete) return {};

        const charId = logToDelete.characterId;
        const remainingLogs = state.logs.filter((l) => l.id !== logId);
        
        // Calculate new total merits for the affected character
        const newTotal = remainingLogs
          .filter(l => l.characterId === charId)
          .reduce((sum, l) => sum + l.merits, 0);

        const updatedCharacters = state.characters.map((char) => {
          if (char.id === charId) {
            // Deducted logs could make total merits drop, adjust redeemed perks if needed
            const maxPerksPossible = Math.floor(Math.max(0, newTotal) / 10);
            return {
              ...char,
              perksRedeemed: Math.min(char.perksRedeemed, maxPerksPossible),
            };
          }
          return char;
        });

        return {
          logs: remainingLogs,
          characters: updatedCharacters,
        };
      }),

      redeemPerk: (characterId) => set((state) => {
        const updatedCharacters = state.characters.map((char) => {
          if (char.id === characterId) {
            return {
              ...char,
              perksRedeemed: char.perksRedeemed + 1,
            };
          }
          return char;
        });
        return { characters: updatedCharacters };
      }),

      importData: (characters, logs, currentCharacterId) => set({
        characters,
        logs,
        currentCharacterId,
      }),
    }),
    {
      name: 'dragonborn-merit-tracker',
    }
  )
);
