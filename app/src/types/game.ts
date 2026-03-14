export type ScreenState = 'boot' | 'landing' | 'character-select' | 'reveal' | 'lobby' | 'hero' | 'alert' | 'game' | 'gameover';
export type ViewAs = 'security' | 'demogorgon';

export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  status: 'safe' | 'danger' | 'unknown' | 'caught';
}

export interface IntelEvent {
  id: string;
  timestamp: string;
  message: string;
  type: 'system' | 'warning' | 'critical';
}

export interface GameResult {
  winner: 'demogorgon' | 'security';
  fates: { name: string; status: string }[];
}

export interface GameState {
  screen: ScreenState;
  viewAs: ViewAs;
  players: Player[];
  demogorgonCoords: { x: number; y: number };
  intelFeed: IntelEvent[];
  proximityAlertActive: boolean;
  selectedAgent: string | null;
  agentCodename: string;
  gameResult: GameResult | null;

  // Actions
  setScreen: (screen: ScreenState) => void;
  toggleViewAs: () => void;
  updateDemogorgonCoords: (coords: { x: number; y: number }) => void;
  addIntelEvent: (event: Omit<IntelEvent, 'id'>) => void;
  setProximityAlert: (active: boolean) => void;
  updatePlayerStatus: (id: string, status: Player['status']) => void;
  setAgent: (name: string) => void;
  setCodename: (name: string) => void;
  setGameResult: (result: GameResult) => void;
  resetGame: () => void;
}
