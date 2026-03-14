import { useEffect, useRef, useCallback } from 'react';
import { TILE_SIZE, WORLD_SIZE } from '../../utils/gpsToWorld';
import { GAME_MAP } from '../../data/gameMap';
import type { TileId } from '../../data/gameMap';

// ─── Colours ───────────────────────────────────────────────────────────
const COLOURS = {
  wall:        '#0f1a1a',
  wallBorder:  '#193232',
  floor:       '#060f0f',
  floorAlt:    '#0a1515',
  floorGrid:   'rgba(6,182,212,0.04)',
  torchColor:  'rgba(6,182,212,0.18)',
  demoTorch:   'rgba(192,57,43,0.18)',
};

const AGENT_COLOURS: Record<string, string> = {
  eleven: '#ec4899',
  hopper: '#06b6d4',
  joyce:  '#f59e0b',
  mike:   '#8b5cf6',
  dustin: '#10b981',
  max:    '#ef4444',
  demogorgon: '#c0392b',
};

export interface SpriteState {
  id: string;
  name: string;           // matches AGENT_COLOURS key
  tx: number;             // tile x
  ty: number;             // tile y
  isDemogorgon?: boolean;
  bobOffset?: number;     // sin-wave computed externally
}

interface GameCanvasProps {
  /** The local player's tile position */
  playerTx: number;
  playerTy: number;
  /** Local player's agent name for colour lookup */
  playerAgent: string;
  /** Whether local player is demogorgon */
  isDemogorgon: boolean;
  /** Other sprites to render */
  sprites: SpriteState[];
  /** Canvas container size in px (defaults to 100% parent) */
  width?: number;
  height?: number;
}

// ─── Draw helpers ────────────────────────────────────────────────────
function drawTile(ctx: CanvasRenderingContext2D, tile: TileId, px: number, py: number) {
  if (tile === 1) {
    // Wall
    ctx.fillStyle = COLOURS.wall;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = COLOURS.wallBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
  } else {
    // Floor (0) or floor-variant (2)
    ctx.fillStyle = tile === 2 ? COLOURS.floorAlt : COLOURS.floor;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    // Subtle grid
    ctx.strokeStyle = COLOURS.floorGrid;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
  }
}

function drawAgentSprite(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  color: string,
  label: string,
  bobOffset: number
) {
  const cx = px + TILE_SIZE / 2;
  const cy = py + TILE_SIZE / 2 + bobOffset;
  const r = 9;

  // Glow halo
  const grd = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 2.5);
  grd.addColorStop(0, `${color}50`);
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Body circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Inner hair band
  ctx.fillStyle = `${color}80`;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.3, r * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Name label
  ctx.fillStyle = color;
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(label.slice(0, 3).toUpperCase(), cx, cy + r + 2);
}

function drawDemogorgon(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  bobOffset: number,
  t: number // time for spike animation
) {
  const cx = px + TILE_SIZE / 2;
  const cy = py + TILE_SIZE / 2 + bobOffset;
  const r = 11;
  const spikes = 8;

  // Radiating spikes
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2 + t * 0.5;
    const len = r + 4 + Math.sin(t * 2 + i) * 3;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r * 0.7, cy + Math.sin(angle) * r * 0.7);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Body
  ctx.fillStyle = '#7f1d1d';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Red eyes
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(cx - 3.5, cy - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 3.5, cy - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Glow pulse around it
  const grd = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 3);
  grd.addColorStop(0, 'rgba(192,57,43,0.3)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawTorchGlow(
  ctx: CanvasRenderingContext2D,
  isDemogorgon: boolean,
  canvasW: number,
  canvasH: number
) {
  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const r = TILE_SIZE * 5;
  const color = isDemogorgon ? COLOURS.demoTorch : COLOURS.torchColor;

  const grd = ctx.createRadialGradient(cx, cy, TILE_SIZE, cx, cy, r);
  grd.addColorStop(0, color);
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Darkness vignette outside torch range
  const vigGrd = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.6);
  vigGrd.addColorStop(0, 'transparent');
  vigGrd.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = vigGrd;
  ctx.fillRect(0, 0, canvasW, canvasH);
}

// ─── Main component ──────────────────────────────────────────────────
export function GameCanvas({
  playerTx,
  playerTy,
  playerAgent,
  isDemogorgon,
  sprites,
  width = 640,
  height = 480,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0); // animation time

  const render = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    tRef.current = timestamp / 1000;
    const t = tRef.current;

    // Camera: keep player centred
    const camX = playerTx * TILE_SIZE - width / 2 + TILE_SIZE / 2;
    const camY = playerTy * TILE_SIZE - height / 2 + TILE_SIZE / 2;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(-camX, -camY);

    // ─── Tiles ─────────────────────────────────────────────────────
    const startTx = Math.max(0, Math.floor(camX / TILE_SIZE));
    const endTx   = Math.min(WORLD_SIZE - 1, Math.ceil((camX + width) / TILE_SIZE));
    const startTy = Math.max(0, Math.floor(camY / TILE_SIZE));
    const endTy   = Math.min(WORLD_SIZE - 1, Math.ceil((camY + height) / TILE_SIZE));

    for (let ty = startTy; ty <= endTy; ty++) {
      for (let tx = startTx; tx <= endTx; tx++) {
        drawTile(ctx, GAME_MAP[ty][tx], tx * TILE_SIZE, ty * TILE_SIZE);
      }
    }

    // ─── Other sprites ─────────────────────────────────────────────
    for (const sprite of sprites) {
      const bob = Math.sin(t * 3 + sprite.id.charCodeAt(0)) * 1.5;
      const spritePx = sprite.tx * TILE_SIZE;
      const spritePy = sprite.ty * TILE_SIZE;
      if (sprite.isDemogorgon) {
        drawDemogorgon(ctx, spritePx, spritePy, bob, t);
      } else {
        const color = AGENT_COLOURS[sprite.name] ?? '#06b6d4';
        drawAgentSprite(ctx, spritePx, spritePy, color, sprite.name, bob);
      }
    }

    // ─── Player sprite ─────────────────────────────────────────────
    const playerBob = Math.sin(t * 4) * 1.5;
    const playerPx = playerTx * TILE_SIZE;
    const playerPy = playerTy * TILE_SIZE;
    if (isDemogorgon) {
      drawDemogorgon(ctx, playerPx, playerPy, playerBob, t);
    } else {
      const pColor = AGENT_COLOURS[playerAgent] ?? '#06b6d4';
      drawAgentSprite(ctx, playerPx, playerPy, pColor, playerAgent, playerBob);
    }

    ctx.restore();

    // ─── Torch glow (screen-space, after restore) ──────────────────
    drawTorchGlow(ctx, isDemogorgon, width, height);

    rafRef.current = requestAnimationFrame(render);
  }, [playerTx, playerTy, playerAgent, isDemogorgon, sprites, width, height]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="block"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
