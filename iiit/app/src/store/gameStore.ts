import { create } from 'zustand';
import type { GameState } from '../types/game';
import { HARDCODED_PLAYERS } from '../data/hardcodedPlayers';

const INITIAL_STATE = {
  screen: 'boot' as const,
  viewAs: 'security' as const,
  players: HARDCODED_PLAYERS,
  demogorgonCoords: { x: 45, y: 45 },
  intelFeed: [
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      message: 'SYSTEM INITIALIZATION COMPLETE',
      type: 'system' as const,
    },
  ],
  proximityAlertActive: false,
  selectedAgent: null,
  agentCodename: '',
  gameResult: null,
};

export const useGameStore = create<GameState>((set) => ({
  ...INITIAL_STATE,

  setScreen: (screen) => set({ screen }),

  toggleViewAs: () =>
    set((state) => ({
      viewAs: state.viewAs === 'security' ? 'demogorgon' : 'security',
    })),

  updateDemogorgonCoords: (coords) => set({ demogorgonCoords: coords }),

  addIntelEvent: (event) =>
    set((state) => ({
      intelFeed: [
        ...state.intelFeed,
        { ...event, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),

  setProximityAlert: (active) => set({ proximityAlertActive: active }),

  updatePlayerStatus: (id, status) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === id ? { ...p, status } : p)),
    })),

  setAgent: (name) => set({ selectedAgent: name }),

  setCodename: (name) => set({ agentCodename: name }),

  setGameResult: (result) => set({ gameResult: result }),

  resetGame: () => set({ ...INITIAL_STATE, screen: 'landing' }),
}));
