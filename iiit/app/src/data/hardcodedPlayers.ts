import type { Player } from '../types/game';

export const HARDCODED_PLAYERS: Player[] = [
  { id: '1', name: 'Hopper', x: -20, y: 15, status: 'safe' },
  { id: '2', name: 'Wheeler', x: 10, y: 30, status: 'safe' },
  { id: '3', name: 'Byers', x: 5, y: -25, status: 'unknown' },
  { id: '4', name: 'Hargrove', x: -35, y: -10, status: 'danger' },
  { id: '5', name: 'Unknown Entity', x: 0, y: 0, status: 'danger' }, // Often treated differently, but part of player list
];
