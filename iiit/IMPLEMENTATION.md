# 🧪 HAWKINS LAB: EXPANSION & IMPLEMENTATION ROADMAP

This document outlines the specific features from the `demogorgon-hunt-ui-spec.md` that are currently missing in the existing "Radar Interface" and provides a phased plan to integrate them.

---

## 🚩 Phase 1: Advanced Navigation & Role Flow
*Goal: Move from a single-screen dashboard to a complete game lifecycle.*

### [x] 1.1 Terminal Landing Screen
- **Component**: `LandingScreen.tsx`
- **Features**:
  - Typewriter terminal effect for "HAWKINS NATIONAL LABORATORY".
  - Inputs for "Agent Codename" and "Room Access Code".
  - Glowing "ENTER HAWKINS LAB" primary CTA.
  - "Uplink Active" pulsing status indicator.

### [x] 1.2 Character Selection Grid
- **Component**: `CharacterSelectScreen.tsx`
- **Features**:
  - 3x2 grid of agent cards (Eleven, Hopper, Joyce, Mike, Dustin, Max).
  - Hover/Selected states with character-specific accent colors.
  - "TAKEN" overlay for agents selected by other players.

### [x] 1.3 Role Reveal "CRT Slam"
- **Component**: `RoleRevealScreen.tsx`
- **Features**:
  - Flash-to-black "CRT Slam" entrance animation.
  - **Demogorgon Reveal**: Crimson radial pulse + `glitchSlice` text animation.
  - **Security Reveal**: Blue radial pulse + `staticReveal` blur animation.
  - Objective cards (e.g., "Catch all agents" vs. "Watch radar for blips").

---

## 🕹️ Phase 2: The 2D World (Canvas Core)
*Goal: Transition the "Radar" to a HUD element and implement a top-down playable world.*

### [x] 2.1 HTML Canvas Engine
- **Component**: `GameCanvas.tsx`
- **Features**:
  - 32x32px tile-based rendering system.
  - Wall and Floor tile variations with subtle grid lines.
  - Camera system that keeps the player character centered.

### [x] 2.2 Character Sprite Rendering
- **Logic**: Primitive-based canvas drawing (no PNGs).
- **Details**:
  - Unique body/hair colors for each of the 6 agents.
  - "Walking Bob" animation (sin-wave vertical offset).
  - Demogorgon sprite with radiating spikes and red eyes.

### [x] 2.3 Interaction Layer
- **Component**: `DPadOverlay.tsx` (Mobile-first movement).
- **Logic**: `gpsToWorld` utility to bridge real-world coordinates to game tiles.
- **Visuals**: "Torch Glow" radial gradient around the player's sprite.

---

## 📡 Phase 3: Interactive Mechanics & HUD
*Goal: Add role-specific actions and refine the heads-up display.*

### [x] 3.1 Role-Specific Action Buttons
- **Demogorgon**: `CATCH` button (activates when within 1.5 tiles of an agent).
- **Security**: `ACCUSE` button (always visible, used to identify the monster).

### [x] 3.2 HUD Refinement
- **Mini-Radar**: Shrink the current SVG radar into a bottom-right circular HUD.
- **Top Bar**: Display Role Badge (Security/Demogorgon), "Alive" count, and a countdown timer.
- **Alert Banner**: "⚠ DEMOGORGON NEAR" flashing text below the top bar.

### [x] 3.3 Haptic Feedback
- **Logic**: Use `navigator.vibrate` for proximity alerts (200ms pulses).

---

## 🌐 Phase 4: Multiplayer & Game Over
*Goal: Synchronize state and provide a definitive ending.*

### [x] 4.1 Socket.IO Integration
- **Events**: `positionUpdate`, `catchAttempt`, `accuseAttempt`, `roleAssigned`.
- **Server**: `/server/src/index.ts` — Node.js + Express + Socket.IO on port 3001.
- **Hook**: `useSocket.ts` — throttled emit, graceful offline fallback.

### [x] 4.2 Game Over Summary
- **Component**: `GameOverScreen.tsx`
- **Features**:
  - "Agent Fates" list (e.g., "Eleven: SURVIVED", "Mike: CAUGHT").
  - Final role reveal (revealing who the Demogorgon actually was).
  - Role-colored Particle Burst on victory.

---

## 🎨 Phase 5: Design System Expansion [x]
- **New color tokens**: `--accent-indigo` `#5b2fc9`, `--accent-amber` `#c49a3c`, `--accent-crimson` `#c0392b`, `--accent-violet` `#7c3aed`, `--accent-green` `#22c55e`.
- **Glow utilities**: `text-glow-*` and `glow-*` (box-shadow) for all 6 accents.
- **Animations**: `crt-flicker`, `amber-pulse`, `portal-shimmer`, `danger-throb`, `uplink-blink`, `glitch-slice`, `scanline-sweep`, `cursor-blink`, `spin-slow`.
- **Component layer**: `.badge`, `.btn-crt`, `.glass-panel`, `.hud-label`, `.portal-ring`, `.status-orb` families.
- **Typography**: `Share Tech Mono` forced globally via `*` selector; display/terminal classes preserved.
- **BootSequence**: Portal ring (indigo spin), amber terminal prompts, green success, glass-panel-dark, CRT version stamp.
- **CRTOverlay**: Deeper vignette (82% falloff), scanline sweep animation, phosphor bloom bar.
- **Tailwind config**: 5 new colors, 6 box-shadows, 5 text-shadows, 9 animation registrations, 3 background gradients.
- **index.html**: Title updated to "Hawkins Lab — Upside Down Surveillance"; Orbitron explicit weights.
