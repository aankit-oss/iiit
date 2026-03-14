import { WORLD_SIZE } from '../utils/gpsToWorld';

/**
 * Tile IDs:
 * 0 = floor (open)
 * 1 = wall (solid)
 * 2 = floor-variant (subtle visual only)
 */
export type TileId = 0 | 1 | 2;

function generateMap(): TileId[][] {
  const map: TileId[][] = Array.from({ length: WORLD_SIZE }, (_, row) =>
    Array.from({ length: WORLD_SIZE }, (_, col) => {
      // Border walls
      if (row === 0 || row === WORLD_SIZE - 1 || col === 0 || col === WORLD_SIZE - 1) return 1;
      // Internal rooms — simple predefined wall islands
      if (row % 10 === 5 && col > 5 && col < WORLD_SIZE - 5 && col % 4 !== 0) return 1;
      if (col % 10 === 5 && row > 5 && row < WORLD_SIZE - 5 && row % 4 !== 0) return 1;
      // Floor variants for texture
      if ((row + col) % 7 === 0) return 2;
      return 0;
    })
  );
  return map;
}

export const GAME_MAP: TileId[][] = generateMap();
