import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';

const SERVER_URL = 'http://localhost:3001';

interface UseSocketOptions {
  /** The room/game code to join */
  roomCode: string;
  playerId: string;
  playerName: string;
  role: 'security' | 'demogorgon';
  initialX: number;
  initialY: number;
}

export function useSocket(options: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const lastEmitRef = useRef<number>(0);

  const {
    updatePlayerStatus,
    updateDemogorgonCoords,
    setGameResult,
    setScreen,
    addIntelEvent,
  } = useGameStore.getState();

  // ── Connect on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id);
      socket.emit('joinRoom', {
        roomCode: options.roomCode,
        playerId: options.playerId,
        playerName: options.playerName,
        role: options.role,
        x: options.initialX,
        y: options.initialY,
      });
    });

    // ── Remote player moved ──────────────────────────────────────────────────
    socket.on('playerMoved', (data: { playerId: string; x: number; y: number }) => {
      // If the demogorgon is moving — update demogorgon coords in store
      // (we don't know which playerId is the demogorgon on the client;
      //  we just expose all position events and let the component decide)
      updateDemogorgonCoords({ x: data.x, y: data.y });
    });

    // ── Player caught ────────────────────────────────────────────────────────
    socket.on('playerCaught', (data: { playerId: string }) => {
      updatePlayerStatus(data.playerId, 'caught');
      addIntelEvent({
        timestamp: new Date().toLocaleTimeString(),
        message: `⚠ AGENT ELIMINATED — tracking signal lost.`,
        type: 'warning',
      });
    });

    // ── Accusation broadcast ─────────────────────────────────────────────────
    socket.on('playerAccused', (data: { accusedPlayerId: string; accuserId: string }) => {
      addIntelEvent({
        timestamp: new Date().toLocaleTimeString(),
        message: `⚠ ACCUSATION FILED — suspect: ${data.accusedPlayerId}`,
        type: 'warning',
      });
    });

    // ── Game over ────────────────────────────────────────────────────────────
    socket.on('gameOver', (data: { winner: 'demogorgon' | 'security'; fates: { name: string; status: string }[] }) => {
      setGameResult({ winner: data.winner, fates: data.fates });
      setScreen('gameover');
    });

    socket.on('disconnect', () => {
      console.log('[socket] disconnected');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.roomCode, options.playerId]);

  // ── Emit position update (throttled to 200ms) ─────────────────────────────
  const emitPosition = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastEmitRef.current < 200) return;
    lastEmitRef.current = now;
    socketRef.current?.emit('positionUpdate', {
      playerId: options.playerId,
      x,
      y,
    });
  }, [options.playerId]);

  // ── Emit catch attempt ────────────────────────────────────────────────────
  const emitCatch = useCallback((targetPlayerId: string) => {
    socketRef.current?.emit('catchAttempt', { targetPlayerId });
  }, []);

  // ── Emit accuse attempt ───────────────────────────────────────────────────
  const emitAccuse = useCallback((accusedPlayerId: string) => {
    socketRef.current?.emit('accuseAttempt', {
      accusedPlayerId,
      accuserId: options.playerId,
    });
  }, [options.playerId]);

  return { emitPosition, emitCatch, emitAccuse };
}
