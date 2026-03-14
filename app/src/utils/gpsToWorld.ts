/**
 * gpsToWorld: converts real-world GPS-style coords (x,y) to tile coordinates.
 * The game world is WORLD_SIZE x WORLD_SIZE tiles.
 * GPS coords range from -100 to +100 on each axis.
 */
export const TILE_SIZE = 32;
export const WORLD_SIZE = 40; // 40x40 tiles

export function gpsToWorld(gpsX: number, gpsY: number): { tx: number; ty: number } {
  // Normalize from [-100, 100] to [0, WORLD_SIZE-1]
  const tx = Math.floor(((gpsX + 100) / 200) * WORLD_SIZE);
  const ty = Math.floor(((gpsY + 100) / 200) * WORLD_SIZE);
  return {
    tx: Math.max(1, Math.min(WORLD_SIZE - 2, tx)),
    ty: Math.max(1, Math.min(WORLD_SIZE - 2, ty)),
  };
}

export function worldToPixel(tx: number, ty: number): { px: number; py: number } {
  return { px: tx * TILE_SIZE, py: ty * TILE_SIZE };
}
