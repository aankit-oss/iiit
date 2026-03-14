# Demogorgon Hunt — Complete UI Specification
### Full Screen Flow: Landing → Lobby → Character Select → Role Reveal → Main Game → Game Over

> **Document Type:** Frontend UI Specification  
> **Project:** Demogorgon Hunt — Real-Time Multiplayer Location-Based Game  
> **Stack:** React · Socket.IO · HTML Canvas · Share Tech Mono · Tailwind (utilities only)  
> **Target Device:** Mobile Portrait · 360px–430px width · iOS + Android  
> **Theme:** Cinematic Stranger Things — dark, animated, modern. Not costume. Not parody.

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Global Layout Rules](#2-global-layout-rules)
3. [Screen 01 — Landing / Join](#3-screen-01--landing--join)
4. [Screen 02 — Multiplayer Lobby](#4-screen-02--multiplayer-lobby)
5. [Screen 03 — Character Selection](#5-screen-03--character-selection)
6. [Screen 04 — Role Reveal](#6-screen-04--role-reveal)
7. [Screen 05 — Main Game (2D World View)](#7-screen-05--main-game-2d-world-view)
8. [Screen 06 — Game Over](#8-screen-06--game-over)
9. [Animation Catalogue](#9-animation-catalogue)
10. [Socket.IO Event Map](#10-socketio-event-map)
11. [Component Tree](#11-component-tree)
12. [State Machine](#12-state-machine)

---

## 1. Design System

### 1.1 Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#06060d` | Root background — deep space black |
| `--bg-surface` | `#0e0e1a` | Cards, panels, elevated surfaces |
| `--bg-overlay` | `rgba(8,4,16,0.92)` | Modal and card backgrounds |
| `--accent-crimson` | `#c0392b` | Demogorgon, danger, alerts, primary CTA |
| `--accent-crimson-glow` | `rgba(192,57,43,0.35)` | Glow effects, border halos |
| `--accent-indigo` | `#5b2fc9` | Portals, Upside Down dimension effects |
| `--accent-blue` | `#1e5fa5` | Security agents, safe states |
| `--accent-amber` | `#c49a3c` | HUD text, timers, labels — CRT phosphor |
| `--accent-green` | `#2ecc71` | "You" indicator, alive status, online dot |
| `--text-primary` | `#e8e0d0` | Main body text on dark backgrounds |
| `--text-muted` | `rgba(200,190,220,0.65)` | Secondary labels and descriptions |
| `--text-hint` | `rgba(139,115,85,0.6)` | Tertiary hints, disabled states |
| `--border-subtle` | `rgba(100,100,150,0.2)` | Default card and panel borders |
| `--border-crimson` | `rgba(192,57,43,0.4)` | Demogorgon-state borders |
| `--border-blue` | `rgba(30,95,165,0.4)` | Security-state borders |

### 1.2 Typography

| Role | Font | Size | Weight | Letter Spacing |
|---|---|---|---|---|
| Display / Screen titles | Share Tech Mono | 26–28px | 400 | 0.06em |
| Section heading | Share Tech Mono | 16–18px | 400 | 0.08em |
| Body / description | Share Tech Mono | 12px | 400 | 0.05em |
| Label / badge | Share Tech Mono | 9–10px | 400 | 0.15–0.2em |
| HUD timer | Share Tech Mono | 18px | 400 | 0.05em |
| Button text | Share Tech Mono | 12–13px | 400 | 0.12em |

> **Rule:** Labels and badges → ALL CAPS. Messages and descriptions → Sentence case. Never mix within the same element.

**Font loading (index.html):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
```

### 1.3 Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | 4px | Icon-to-label gaps |
| `--space-sm` | 8px | Internal padding, badge gaps |
| `--space-md` | 12px | Card internal gaps |
| `--space-lg` | 16px | Section separation |
| `--space-xl` | 24px | Screen section separation |
| `--space-2xl` | 32px | Major layout gaps |

### 1.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 5px | Badges, chips, tags |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Screen containers |
| `--radius-full` | 9999px | Pills, avatar circles |

### 1.5 Global CRT Scanline Overlay

Applied as a `::before` pseudo-element on the root `#app` container. Subtle — not retro parody.

```css
#app::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.06) 3px,
    rgba(0, 0, 0, 0.06) 4px
  );
  pointer-events: none;
  z-index: 9999;
  border-radius: inherit;
}
```

---

## 2. Global Layout Rules

### 2.1 Screen Transitions

All screen-to-screen transitions use a unified animation:

```css
/* Entering screen */
@keyframes screenEnter {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Exiting screen */
@keyframes screenExit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-12px); }
}
```

- Duration: `400ms`  
- Easing: `ease-in-out`  
- Exception: Role Reveal uses a CRT-slam transition (see Screen 04)

### 2.2 Button States (Global)

All buttons share this interaction model:

| State | Style |
|---|---|
| Default | Defined per variant |
| Hover | Border opacity +20%, background +8% lighter |
| Active / Press | `transform: scale(0.97)` + brief border glow pulse (100ms) |
| Disabled | 30% opacity, `cursor: not-allowed` |
| Loading | Animated `...` appended to label, border pulses |

### 2.3 Input States (Global)

| State | Style |
|---|---|
| Default | Dark fill, `--border-subtle` border |
| Focus | Bottom border switches to `--accent-crimson`, full opacity |
| Error | Shake animation (horizontal, 6px, 3 cycles, 300ms) + red border |
| Filled | Label shrinks to 9px above field |

### 2.4 Touch Targets

All interactive elements: minimum `44px × 44px` touch area, regardless of visual size. Use padding on small elements to satisfy this.

---

## 3. Screen 01 — Landing / Join

**Purpose:** First impression. Authentication into a room. Terminal boot aesthetic.  
**Route:** `/` or `/join`  
**Socket events triggered:** `emit('joinRoom', { nickname, roomCode })` on confirm

---

### 3.1 Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│         [GLOBAL CRT OVERLAY]        │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  ◈ HAWKINS NATIONAL LAB...   │  │  ← typewriter
│  │                               │  │
│  │  ● UPLINK ACTIVE              │  │  ← green pulse dot
│  │                               │  │
│  │  DEMOGORGON_                  │  │  ← crimson, blinking cursor
│  │  HUNT PROTOCOL · CLASSIFIED   │  │  ← amber, small
│  │                               │  │
│  │  ▸ AGENT CODENAME             │  │
│  │  [ __________________ ]       │  │
│  │                               │  │
│  │  ▸ ROOM ACCESS CODE           │  │
│  │  [ __________________ ]       │  │
│  │  ─────────────────────────    │  │
│  │  [ ENTER HAWKINS LAB ]        │  │  ← primary CTA
│  │  ◈ HOST A NEW SESSION         │  │  ← ghost CTA
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 3.2 Card Specification

| Property | Value |
|---|---|
| Max width | 360px |
| Background | `rgba(8,4,16,0.92)` |
| Border | `1px solid rgba(120,60,200,0.3)` |
| Top accent | `3px solid var(--accent-crimson)` |
| Border radius | `var(--radius-lg)` |
| Padding | `28px 24px` |
| Centered | Vertically + horizontally in viewport |

### 3.3 Boot Sequence Animation

Plays on mount. Total duration: **1.4 seconds**.

| Step | Element | Animation | Duration |
|---|---|---|---|
| 1 | Card | Slide up from `y+20`, opacity `0→1` | 300ms |
| 2 | "HAWKINS NATIONAL LABORATORY" | Typewriter, 40ms/char | ~800ms |
| 3 | "CLASSIFIED UPLINK ACTIVE" | CRT flicker (3 rapid opacity flashes at 0→1), then steady | 200ms |
| 4 | Status dot | Fade in + begin pulse loop | 100ms |
| 5 | Form fields | Fade in together | 200ms |

### 3.4 Element Details

#### Status Row
```
● UPLINK ACTIVE
```
- Green dot (`6px`, `border-radius: 50%`, `background: var(--accent-green)`)
- Pulse animation: `opacity: 1 → 0.3 → 1`, duration `2s`, `ease-in-out`, `infinite`
- Text: `UPLINK ACTIVE`, 10px amber, letter-spacing `0.1em`

#### Title Block
```
DEMOGORGON_
HUNT PROTOCOL · CLASSIFIED
```
- `DEMOGORGON`: 26px Share Tech Mono, `var(--accent-crimson)`
- Cursor `_`: blinks at `1.2s` step-end cycle (`opacity: 1 → 0`)
- Subtitle: 10px amber, `letter-spacing: 0.15em`

#### Input Fields

Both inputs share this spec:

```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(180,30,30,0.3);
border-radius: var(--radius-md);
padding: 10px 12px;
color: var(--text-primary);
font-family: 'Share Tech Mono', monospace;
font-size: 14px;
```

- Label above: `10px`, amber, `letter-spacing: 0.12em`, ALL CAPS
- Focus: bottom border → `var(--accent-crimson)`, full opacity, transition `200ms`
- Placeholder: `color: rgba(139,115,85,0.4)`

#### Primary Button — "[ ENTER HAWKINS LAB ]"

```css
width: 100%;
padding: 13px;
background: rgba(192,57,43,0.85);
border: 1px solid rgba(220,80,60,0.6);
border-radius: var(--radius-md);
color: #f0e8e0;
font-family: 'Share Tech Mono', monospace;
font-size: 13px;
letter-spacing: 0.12em;
cursor: pointer;
transition: background 0.15s;
```

#### Ghost Button — "◈ HOST A NEW SESSION"

```css
width: 100%;
padding: 10px;
background: transparent;
border: 1px solid rgba(139,115,85,0.3);
border-radius: var(--radius-md);
color: rgba(139,115,85,0.8);
font-size: 11px;
letter-spacing: 0.1em;
```

### 3.5 Error State

Triggered when `roomNotFound` event received from server:

```
ACCESS DENIED · ROOM NOT FOUND
```

- Room code input: horizontal shake animation
- Error message: appears below input in `var(--accent-crimson)`, 10px, fade in 150ms
- Shake keyframe:

```css
@keyframes inputShake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
/* duration: 300ms, timing: ease-in-out */
```

---

## 4. Screen 02 — Multiplayer Lobby

**Purpose:** Pre-game gathering space. Live player presence. Host controls.  
**Route:** `/lobby/:roomCode`  
**Socket events:** listens on `playerListUpdate`, `gameStarting`

---

### 4.1 Layout Structure

```
┌──────────────────────────────────┐
│  ROOM CODE: HAWK-7721  [QR CODE] │  ← top strip
│  [ COPY INVITE LINK ]            │
├──────────────────────────────────┤
│                                  │
│  ▸ AGENTS IN LOBBY               │
│  3 / 8 AGENTS CONNECTED          │
│                                  │
│  ┌──────────────────────────┐    │
│  │ EL  Eleven    HOST  YOU  │    │  ← your row (green border)
│  └──────────────────────────┘    │
│  ┌──────────────────────────┐    │
│  │ MW  MikeWheeler          │    │
│  └──────────────────────────┘    │
│  ┌──────────────────────────┐    │
│  │ DH  DustyHend            │    │
│  └──────────────────────────┘    │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │  ← waiting slot
│   AWAITING AGENT...              │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
│                                  │
├──────────────────────────────────┤
│  [ INITIATE HUNT PROTOCOL ]      │  ← host only / sticky
│  MINIMUM 3 AGENTS REQUIRED       │
└──────────────────────────────────┘
```

### 4.2 Top Strip — Room Info

| Element | Spec |
|---|---|
| Label "ROOM CODE" | 9px amber, `letter-spacing: 0.15em` |
| Code value "HAWK-7721" | 20px amber mono |
| QR code box | 64×64px white square, `border-radius: 6px`, right-aligned |
| QR label "SCAN TO JOIN" | 9px amber, below QR |
| Copy link button | 10px amber, ghost style, below code |

### 4.3 Player List Cards

#### Connected Player Row

```css
display: flex;
align-items: center;
gap: 10px;
background: rgba(255,255,255,0.04);
border: 1px solid rgba(100,100,150,0.25);
border-radius: 8px;
padding: 10px 12px;
```

| Element | Spec |
|---|---|
| Avatar circle | 30px diameter, initials (2 chars), color hash-derived from name |
| Player name | 13px mono, `var(--text-primary)` |
| HOST badge | 9px amber text, amber background at 12%, amber border at 30% |
| YOU badge | 9px green text, green background at 10%, green border at 30% |

**Your row special state:**
```css
border: 1px solid rgba(46,204,113,0.4);
```

**Stagger-in animation (new player joins):**
- Slides in from `x+20`, opacity `0→1`
- Duration: `200ms ease-out`
- Each new card delays `0ms` (no stagger needed for single joins)

**Player disconnect animation:**
- `opacity 1→0` + `max-height collapse to 0` + `margin collapse`
- Duration: `150ms`

#### Waiting Slot

```css
border: 1px dashed rgba(100,100,150,0.2);
border-radius: 8px;
padding: 10px 12px;
```

- Pulsing empty circle (30px, dashed border, no fill): `opacity 0.3→0.9→0.3`, `1.8s ease-in-out infinite`
- Text: `AWAITING AGENT...` in muted amber, 11px

### 4.4 Player Count Indicator

```
3 / 8 AGENTS CONNECTED
```

- Count number (`3`): amber, transitions with `scale(1.2)→scale(1)` bounce on change, `150ms`
- Total (`/ 8 AGENTS CONNECTED`): muted, 11px

### 4.5 Start Button (Host Only)

```css
width: 100%;
padding: 14px;
background: rgba(192,57,43,0.85);
border: 1px solid rgba(220,80,60,0.6);
border-radius: 8px;
color: #f0e8e0;
font-size: 13px;
letter-spacing: 0.15em;
```

- Border glow animation when ≥3 players ready:
```css
@keyframes readyGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(192,57,43,0); }
  50%       { box-shadow: 0 0 0 4px rgba(192,57,43,0.4); }
}
/* duration: 2s, infinite */
```

- **Non-host players** see instead: `WAITING FOR HOST TO START...` with a 3-dot bounce animation

**Minimum players note:** `MINIMUM 3 AGENTS REQUIRED · HOST ONLY` — 10px muted amber, centered below button

---

## 5. Screen 03 — Character Selection

**Purpose:** Player identity assignment. Choose your agent before the hunt begins.  
**Trigger:** After joining lobby successfully. Before role reveal.  
**Socket events:** `emit('characterSelected', { charId })` · listen `characterLocked`

---

### 5.1 Layout Structure

```
┌──────────────────────────────────┐
│  ◈ HAWKINS NATIONAL LABORATORY   │  ← label
│  Choose your agent               │  ← title
│                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐     │
│  │  EL  │ │  HO  │ │  JO  │     │  ← character cards
│  │Eleven│ │Hopper│ │ Joyce│     │
│  └──────┘ └──────┘ └──────┘     │
│  ┌──────┐ ┌──────┐ ┌──────┐     │
│  │  MI  │ │  DU  │ │  MA  │     │
│  │ Mike │ │Dustin│ │  Max │     │
│  └──────┘ └──────┘ └──────┘     │
│                                  │
│  [ CONFIRM AGENT ]               │  ← inactive until selected
└──────────────────────────────────┘
```

### 5.2 Character Card Specification

| Property | Value |
|---|---|
| Size | 80px × 100px |
| Background | `rgba(14,14,26,0.9)` |
| Border (default) | `1px solid rgba(255,255,255,0.1)` |
| Border (selected) | `1px solid <character accent color>` |
| Border radius | `var(--radius-md)` |
| Padding | `8px 4px` |

**Selected state:**
```css
border-color: <char accent>;
box-shadow: 0 0 0 2px <char accent at 30%>;
transform: scale(1.04);
transition: all 0.15s ease;
```

**Hover state:**
```css
border-color: <char accent at 60%>;
transform: scale(1.02);
```

**Taken state (another player selected this character):**
```css
opacity: 0.4;
filter: grayscale(0.6);
cursor: not-allowed;
```
- Overlay badge: `TAKEN` in 8px muted text, centered over sprite

### 5.3 Character Roster

| Character | Body Color | Hair Color | Skin Tone | Accent Color |
|---|---|---|---|---|
| Eleven | `#c080e0` | `#2a1a0a` | `#e8c8a0` | `#9040c0` |
| Hopper | `#4a6a8a` | `#5a4030` | `#d4a878` | `#8ab0d0` |
| Joyce | `#c04060` | `#2a1808` | `#e8b888` | `#e06080` |
| Mike | `#2050a0` | `#1a0e06` | `#e8c8a0` | `#4080d0` |
| Dustin | `#208060` | `#1a1208` | `#d8b878` | `#40c090` |
| Max | `#c06020` | `#8a1a08` | `#e8c0a0` | `#e08040` |

**Pixel art sprite rendering (HTML Canvas, 56×56px per card):**
- Body block: `14px wide × 12px tall` at character body color
- Head: `14px` diameter circle at skin tone
- Hair: top arc `+ 4px rect cap` at hair color
- Arms: `4px × 8px` left and right stubs at skin tone
- Legs: `5px × 10px` left and right stubs at body color
- Scale: render at 1× then CSS scale `transform: scale(2)` for crispness

### 5.4 Confirm Button

- Inactive (no selection): `opacity: 0.35`, disabled
- Active (selection made): Animates in with `scale(0.9)→scale(1)`, `150ms`
- Text: `[ CONFIRM AGENT ]`

### 5.5 Transition Out

When host starts game after all characters locked:
1. All cards fly upward simultaneously: `translateY(-60px)` + `opacity: 0`, `300ms staggered 40ms each`
2. Screen fades to black over `200ms`
3. Role Reveal screen slams in

---

## 6. Screen 04 — Role Reveal

**Purpose:** The dramatic heart of the game. Private, full-screen, role assignment reveal.  
**Socket event received:** `roleAssigned: { role: 'DEMOGORGON' | 'SECURITY' }`  
**Each player sees ONLY their own screen**

---

### 6.1 Transition In — CRT Slam

```
1. Screen flashes white (30ms)
2. White fades to black (100ms)
3. Role card crashes in from top: translateY(-40px)→0, with spring overshoot bounce
4. Content reveals inside card (staggered, see below)
```

Spring easing for crash-in: `cubic-bezier(0.34, 1.56, 0.64, 1)`, `400ms`

### 6.2 DEMOGORGON Variant

**Full screen atmosphere:** Radial crimson pulse from center `rgba(200,30,30,0.18)` expanding outward — `2s ease-in-out infinite`

```
┌──────────────────────────────────┐
│                                  │  ← crimson radial pulse bg
│  ▸ CLASSIFIED ASSIGNMENT         │  ← 9px amber, fades in 200ms
│                                  │
│        [DEMOGORGON ICON]         │  ← SVG, 72px, slide down 300ms
│                                  │
│    YOU ARE THE                   │  ← 10px amber
│    DEMOGORGON                    │  ← 28px crimson GLITCH TEXT
│                                  │
│  You have crossed from the       │  ← 11px muted, fade in 400ms
│  Upside Down. Hunt. Catch.       │
│                                  │
│  ┌──────────────────────────┐    │
│  │ ▸ OBJECTIVES             │    │  ← crimson border card
│  │ ▸ Catch all agents       │    │
│  │ ▸ Stay hidden on radar   │    │
│  │ ▸ Use portals to escape  │    │
│  └──────────────────────────┘    │
│                                  │
│  [ BEGIN THE HUNT ]              │  ← crimson button, border glow
└──────────────────────────────────┘
```

**Glitch text animation for "DEMOGORGON":**

```css
@keyframes glitchSlice {
  0%   { clip-path: inset(0 0 100% 0); transform: translateX(0); }
  10%  { clip-path: inset(20% 0 60% 0); transform: translateX(-4px); }
  20%  { clip-path: inset(40% 0 20% 0); transform: translateX(4px); }
  30%  { clip-path: inset(60% 0 0% 0); transform: translateX(-2px); }
  40%  { clip-path: inset(0% 0 0% 0); transform: translateX(0); }
  100% { clip-path: inset(0 0 0% 0); transform: translateX(0); }
}
/* duration: 600ms, plays once, delay: 500ms after mount */
```

**Demogorgon SVG Icon (inline, no external assets):**
- Dark circle body `(r=30)` with 6 spike paths radiating outward
- Two red eyes `(r=5)` at offset positions
- Stroke: `var(--accent-crimson)`, `fill: #1a0505`

### 6.3 SECURITY Variant

**Full screen atmosphere:** Radial steel blue pulse from center `rgba(30,95,165,0.18)` — `2s ease-in-out infinite`

```
┌──────────────────────────────────┐
│                                  │  ← blue radial pulse bg
│  ▸ CLASSIFIED ASSIGNMENT         │
│                                  │
│       [FLASHLIGHT ICON]          │  ← SVG cone beam, 72px
│                                  │
│    YOU ARE                       │
│    SECURITY AGENT                │  ← 28px steel-blue STATIC TEXT
│                                  │
│  The Demogorgon walks among      │
│  you. Survive, detect, capture.  │
│                                  │
│  ┌──────────────────────────┐    │
│  │ ▸ OBJECTIVES             │    │  ← blue border card
│  │ ▸ Watch radar for blips  │    │
│  │ ▸ Vibration = danger     │    │
│  │ ▸ Accuse the Demogorgon  │    │
│  └──────────────────────────┘    │
│                                  │
│  [ ENTER HAWKINS LAB ]           │  ← blue button, border glow
└──────────────────────────────────┘
```

**Static/noise text reveal animation for "SECURITY AGENT":**

```css
@keyframes staticReveal {
  0%   { opacity: 0; letter-spacing: 0.4em; filter: blur(2px); }
  40%  { opacity: 0.6; letter-spacing: 0.2em; filter: blur(1px); }
  100% { opacity: 1; letter-spacing: 0.08em; filter: blur(0); }
}
/* duration: 500ms, ease-out, delay: 400ms */
```

**Flashlight SVG Icon:**
- SVG cone shape: narrow at origin, wide arc at far end
- Fill: `rgba(30,95,165,0.7)` with inner lighter streak
- Animated: subtle scale pulse `(1→1.05)` at `3s infinite`

### 6.4 Shared Behavior

| Behavior | Spec |
|---|---|
| CTA button border glow | Pulses for 2s to draw attention, then settles to static |
| Auto-advance | Transitions to game after 8s if user doesn't tap |
| Countdown indicator | Small "AUTO-ENTERING IN 8..." below button, counts down in seconds |
| Landscape lock | Prompt appears if device rotated: "ROTATE TO PORTRAIT MODE" |

---

## 7. Screen 05 — Main Game (2D World View)

**Purpose:** The primary game screen. Full-screen 2D canvas world. Player is always centered.  
**This is the game. The radar is secondary HUD only.**

---

### 7.1 Layer Architecture

```
Z-INDEX STACK (bottom → top):

[1]  HTML Canvas — World tiles (floor, walls, portals)
[2]  HTML Canvas — Character sprites (all players)
[3]  HTML Canvas — Effects (torch glow, portal rings)
[4]  HTML — HUD overlay (top bar, mini radar, alerts)
[5]  HTML — Controls overlay (D-pad, action buttons)
[6]  CSS  — Global CRT scanline pseudo-element
```

> Recommendation: Use a single `<canvas>` element and draw all game layers in order each frame via `requestAnimationFrame`. Keep HUD and controls as HTML elements layered on top via `position: absolute`.

### 7.2 World Rendering (Canvas)

#### Tile System

| Property | Value |
|---|---|
| Tile size | 32×32px |
| Map dimensions | 25 columns × 18 rows (expandable) |
| Camera | Centered on player character at all times |
| Coordinate system | `(worldX, worldY)` in pixels; camera offset = `player.wx - canvas.width/2` |

**Floor tile:**
- Fill: `#0e0e1a`
- Grid line: `rgba(30,30,60,0.35)`, `0.3px stroke`

**Wall tile:**
- Fill: `#1a1a2e`
- Top-edge highlight: `rgba(80,80,160,0.2)`, 2px tall strip
- Border: `rgba(60,60,100,0.5)`, `0.5px`

**Portal tile (animated, two at fixed map positions):**
- Outer ring: `rgba(120,40,200, animated)`, radius oscillates `12±3px`, `3s sin cycle`
- Inner ring: `rgba(180,80,255, animated)`, radius `7±2px`, `4s sin cycle, offset 1s`
- Fill: `rgba(100,40,200,0.2)`
- Label below: `PORTAL` in 7px amber mono

**Torch glow (player light):**
```javascript
const grad = ctx.createRadialGradient(px, py, 0, px, py, TILE * 5);
grad.addColorStop(0, 'rgba(255,200,100,0.04)');
grad.addColorStop(1, 'rgba(255,200,100,0)');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

### 7.3 Character Sprite Rendering

All sprites drawn with canvas primitives. No image assets.

#### Security Agent Sprite (16×24px logical, drawn 2×)

```
Drawing order:
1. Shadow ellipse below feet (subtle, rgba(0,0,0,0.2))
2. Body block: charColor, 14px wide × 12px tall
3. Head: skinTone circle, r=7, centered above body
4. Hair: hairColor arc (top half) + 4px rect cap
5. Arms: skinTone, 4×8px rects, left and right of body
6. Legs: charColor, 5×10px rects, below body
7. Name label: 8px mono above head — green for self, steel-blue for others
```

**Walking bob animation:**
```javascript
const bobOffset = isMoving ? Math.sin(Date.now() / 120) * 1.5 : 0;
ctx.translate(screenX, screenY + bobOffset);
```

#### Demogorgon Sprite (20×24px logical, drawn 2×)

```
Drawing order:
1. Dark circle body (r=12), fill: #1a0505
2. Accent ring: var(--accent-crimson), 1.5px stroke, r=12
3. Six spike paths radiating outward (evenly spaced, 9px inner → 16px outer)
4. Two red eyes (r=3), offset at (-4,-2) and (4,-2)
5. Name: hidden unless within 2.5-tile proximity (shows "???")
6. If Security role and >2.5 tiles away: DO NOT DRAW
```

### 7.4 HUD Overlay (HTML, `position: absolute, inset: 0, pointer-events: none`)

#### Top Bar

```
┌─────────────────────────────────┐
│  ● SECURITY    03:47    HAWK-7721│
│                         3 ALIVE  │
└─────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Background | `rgba(0,0,0,0.6)` |
| Height | ~40px |
| Padding | `8px 12px` |
| Border bottom | `1px solid rgba(100,100,150,0.15)` |

**Role badge:**
- Security: `● SECURITY` — blue text, blue pill background/border
- Demogorgon: `▲ DEMOGORGON` — crimson text, crimson pill background/border
- Font: 10px mono, `letter-spacing: 0.12em`

**Timer:**
- Default: 18px amber, `letter-spacing: 0.05em`
- Under 30 seconds: switches to crimson + blink animation `(opacity 1→0.4, 0.8s step-end infinite)`

**Room info (top right):**
- `HAWK-7721` — 9px amber
- `3 ALIVE` — 9px amber, updates live

#### Mini Radar (bottom-right HUD)

```
Position: absolute, bottom: 70px, right: 10px
Size: 70×70px canvas, border-radius: 50%
Border: 1px solid rgba(40,180,80,0.4)
Background: #040e06
```

**Radar rendering:**
- Concentric rings at 25px and 15px radius, `rgba(30,140,60,0.25)`, `0.5px`
- Sweep line: rotates `360° / 3s`, with trailing `rgba(30,180,70,0.07)` fan arc
- Self dot: green, `r=3`, always at center `(35,35)`
- Security blips: blue, `r=2.5`, positioned relative to self with scale factor `35 / (6 × TILE)`
- Demogorgon blip: crimson, `r=3`; pulsing red glow when `alertActive`; hidden if outside 6-tile radius
- Danger ring: dashed crimson circle at `ALERT_DIST × scale` radius, `0.5px, stroke-dasharray: 2 2`

**Radar label:**
```
RADAR
```
9px amber, centered below radar circle, `letter-spacing: 0.08em`

#### Alert State (Demogorgon within danger radius)

**Screen edge pulse:**
```css
@keyframes dangerEdge {
  0%, 100% { box-shadow: inset 0 0 0 0 rgba(220,40,40,0); }
  50%       { box-shadow: inset 0 0 0 3px rgba(220,40,40,0.85); }
}
/* duration: 0.5s, infinite while alert active */
```

**Alert text:**
```
⚠ DEMOGORGON NEAR
```
- Appears below top bar
- Crimson, 11px mono, `letter-spacing: 0.12em`
- Blinks: `opacity 1→0`, `0.6s step-end infinite`
- Fades in over `150ms` when alert activates

**Haptic feedback:**
```javascript
if (navigator.vibrate) {
  navigator.vibrate([200, 80, 200]);
}
```
- Re-fires every 4 seconds while alert remains active (not on every tick)

### 7.5 Controls Overlay (HTML, `pointer-events: auto`)

#### D-Pad (bottom-left)

```
      [ ▲ ]
[ ◀ ]      [ ▶ ]
      [ ▼ ]
```

- Grid: `3×3`, each cell `36×36px`, gap `3px`
- Button style: `rgba(255,255,255,0.07)` bg, `1px solid rgba(255,255,255,0.15)` border, `border-radius: 7px`
- Active/held: `rgba(255,255,255,0.18)` bg
- Arrow icons: `14px` mono characters
- Keyboard fallback: Arrow keys + WASD

#### Action Buttons (bottom-right)

**CATCH (Demogorgon only):**
- Visible only to Demogorgon role
- Activates (full opacity) when ≤1.5 tiles from a Security player
- Style: crimson text, crimson border, crimson background at 12%
- Label: `▲ CATCH`

**ACCUSE (Security only):**
- Visible only to Security role
- Always active (you can accuse anyone near you)
- Style: amber text, amber border, amber background at 10%
- Label: `◈ ACCUSE`

**Shared button spec:**
```css
font-family: 'Share Tech Mono', monospace;
font-size: 9px;
letter-spacing: 0.08em;
padding: 7px 10px;
border-radius: 6px;
min-width: 64px;
min-height: 44px;
cursor: pointer;
```

### 7.6 GPS ↔ World Coordinate Bridge

```javascript
// At game start, server sets origin = host's GPS position
const ORIGIN_LAT = hostLat;
const ORIGIN_LNG = hostLng;
const METERS_PER_TILE = 1.0; // 1 real-world meter = 1 game tile

// Convert GPS to world pixels
function gpsToWorld(lat, lng) {
  const metersLat = (lat - ORIGIN_LAT) * 111320;
  const metersLng = (lng - ORIGIN_LNG) * 111320 * Math.cos(ORIGIN_LAT * Math.PI/180);
  return {
    wx: metersLng / METERS_PER_TILE * TILE_SIZE,
    wy: -metersLat / METERS_PER_TILE * TILE_SIZE  // negative: north = up
  };
}
```

**Fallback (indoor / no GPS):**
- D-pad drives local position updates
- Position emitted to server via `positionUpdate` every `200ms`
- Server validates and broadcasts to all clients

### 7.7 NPC / Other Player Rendering

- Positions received from server via `radarUpdate` events every `~200ms`
- Client interpolates between last two positions each frame:
```javascript
player.renderX += (player.wx - player.renderX) * 0.15;
player.renderY += (player.wy - player.renderY) * 0.15;
```
- Prevents jarring teleports between ticks

---

## 8. Screen 06 — Game Over

**Purpose:** Verdict. Closure. Replay hunger.  
**Socket event:** `gameOver: { winner: 'DEMOGORGON' | 'SECURITY', stats, players }`

---

### 8.1 Transition In

```
1. Game canvas fades to 20% opacity (300ms)
2. Game Over title crashes down from y=-60 with spring bounce (400ms)
3. Stats cards fade in staggered (100ms each)
4. Player list rows slide in from left (staggered 60ms each)
5. Buttons fade in last (200ms)
6. Particle burst plays (1.5s, then stops)
```

### 8.2 DEMOGORGON WINS Variant

```
┌──────────────────────────────────┐
│                                  │  ← crimson atmosphere
│  ◈ HUNT COMPLETE                 │  ← 9px amber
│                                  │
│       [DEMOGORGON ICON]          │  ← 56px SVG
│                                  │
│      DEMOGORGON WINS             │  ← 22px crimson, glitch reveal
│                                  │
│  ┌──────────────────────────┐    │
│  │ ROUND TIME     02:14     │    │  ← stats card
│  │ AGENTS CAUGHT  3 / 3     │    │
│  │ PORTALS USED   2         │    │
│  └──────────────────────────┘    │
│                                  │
│  ▸ AGENT FATES                   │
│  ● Eleven        CAUGHT 02:01   │
│  ● MikeWheeler   CAUGHT 02:08   │
│  ● DustyHend     CAUGHT 02:14   │
│                                  │
│  [ PLAY AGAIN ]                  │
│  ◈ EXIT LOBBY                    │
└──────────────────────────────────┘
```

### 8.3 SECURITY WINS Variant

```
┌──────────────────────────────────┐
│                                  │  ← blue atmosphere
│  ◈ THREAT NEUTRALIZED            │
│                                  │
│       [FLASHLIGHT ICON]          │  ← 56px SVG
│                                  │
│       SECURITY WINS              │  ← 22px blue, static reveal
│                                  │
│  ┌──────────────────────────┐    │
│  │ ROUND TIME     01:47     │    │
│  │ SURVIVORS      2 / 3     │    │
│  │ CORRECT ACCUSE YES       │    │
│  └──────────────────────────┘    │
│                                  │
│  ▸ AGENT STATUS                  │
│  ● Eleven        SURVIVED ★     │
│  ● MikeWheeler   CAUGHT          │
│  ● DustyHend     ACCUSED ★      │
│                                  │
│  [ PLAY AGAIN ]                  │
│  ◈ EXIT LOBBY                    │
└──────────────────────────────────┘
```

### 8.4 Stats Card Specification

```css
background: rgba(255,255,255,0.04);
border: 1px solid <role accent at 25%>;
border-radius: 8px;
padding: 12px;
```

- Row layout: `space-between`
- Key: 10px muted mono
- Value: 10px mono, role accent color, bold

### 8.5 Player Fate Rows

| Status | Indicator | Color |
|---|---|---|
| CAUGHT | `●` dot | Crimson |
| SURVIVED | `●` dot + `★` | Green |
| ACCUSED CORRECTLY | `●` dot + `★` | Blue |
| TIMED OUT | `●` dot | Amber |

Timestamp shown on right when applicable: `CAUGHT 02:14` — 10px muted.

### 8.6 Roles Revealed Section

- Appears 1 second after game over screen loads
- Glitch text animation reveals who was the Demogorgon
- Label: `▸ THE DEMOGORGON WAS:` in 9px amber
- Name revealed: 16px crimson mono, glitch animation plays once

### 8.7 Particle Burst

```javascript
// 20 particles burst from center on mount
// Each particle: 4px square, role color
// Velocity: random direction, 3–8px/frame initial
// Gravity: +0.2px/frame²
// Fade: opacity 1→0 over 1.5s
// Canvas overlay, absolute positioned, pointer-events: none
```

### 8.8 Action Buttons

**"[ PLAY AGAIN ]"** — Primary
- Reuses same room code
- Re-randomizes roles and Demogorgon assignment on server
- Returns all players to Character Select screen
- Style: role-appropriate (crimson or blue)

**"◈ EXIT LOBBY"** — Ghost
- Returns to Landing screen
- Room dissolved on server side
- Style: ghost, muted amber border

---

## 9. Animation Catalogue

| Name | Element | Keyframe Description | Duration | Trigger |
|---|---|---|---|---|
| `screenEnter` | All screens | `y+12, opacity 0 → y0, opacity 1` | 400ms ease-in-out | Route change |
| `screenExit` | All screens | `y0, opacity 1 → y-12, opacity 0` | 400ms ease-in-out | Route change |
| `crtSlam` | Role Reveal | White flash → black → spring crash in | 400ms | Mount |
| `glitchSlice` | Role title | Clip-path slice + translateX offset | 600ms | Mount, 500ms delay |
| `staticReveal` | Security title | Blur + letter-spacing collapse | 500ms | Mount, 400ms delay |
| `typewrtier` | Landing header | Char-by-char reveal, 40ms/char | ~800ms | Mount |
| `crtFlicker` | Landing status | 3× rapid opacity flash | 200ms | After typewriter |
| `blink` | Cursor, alerts | `opacity 1→0`, step-end | 1.2s | Persistent |
| `inputShake` | Error inputs | Horizontal ±6px, 3 cycles | 300ms | Error event |
| `cardSlideIn` | Lobby player rows | `x+20, opacity 0 → x0, 1` | 200ms | Join event |
| `cardFadeOut` | Lobby player rows | `opacity + max-height collapse` | 150ms | Disconnect |
| `readyGlow` | Start button | `box-shadow` crimson pulse | 2s infinite | ≥3 players |
| `charConfirm` | Confirm button | `scale(0.9)→scale(1)` | 150ms | Selection made |
| `charFlyOut` | All char cards | `translateY(-60px) + opacity 0` | 300ms staggered | Game start |
| `dangerEdge` | Game screen | `inset box-shadow` crimson pulse | 0.5s infinite | Alert active |
| `radarSweep` | Radar sweep line | `rotate(0→360deg)` | 3s linear infinite | In game |
| `blipPulse` | Radar blips | `r: 5→7, opacity 1→0.7` | 1.5s ease-in-out infinite | In game |
| `portalPulse` | Portal rings | Radius oscillation via `sin(t)` | 3s continuous | In game |
| `walkBob` | Player sprite | `translateY ±1.5px` at 4hz | Based on `sin(Date.now()/120)` | Moving |
| `timerDanger` | Timer | Crimson + blink | 0.8s step-end | <30s remaining |
| `particleBurst` | Game over | 20 particles, radial burst, fade | 1.5s | Mount |
| `rolesReveal` | Game over roles | Glitch text, 1s delay | 600ms | 1s after mount |
| `springBounce` | Game over title | `cubic-bezier(0.34,1.56,0.64,1)` | 400ms | Mount |

---

## 10. Socket.IO Event Map

### Client → Server (emits)

| Event | Payload | When |
|---|---|---|
| `joinRoom` | `{ nickname, roomCode }` | Landing form submit |
| `characterSelected` | `{ charId }` | Character select confirm |
| `startGame` | `{}` | Host taps start (lobby) |
| `positionUpdate` | `{ wx, wy, timestamp }` | Every 200ms during game |
| `catchAttempt` | `{ targetId }` | Demogorgon taps CATCH |
| `accuseAttempt` | `{ targetId }` | Security taps ACCUSE |

### Server → Client (listens)

| Event | Payload | Screen |
|---|---|---|
| `roomJoined` | `{ roomCode, playerId, isHost }` | → Lobby |
| `roomNotFound` | `{}` | Landing error state |
| `playerListUpdate` | `{ players: [] }` | Lobby live list |
| `characterLocked` | `{ charId, playerId }` | Character select — mark taken |
| `gameStarting` | `{}` | → Character Select |
| `roleAssigned` | `{ role, charId }` | Role Reveal (private per socket) |
| `phaseChanged` | `{ phase }` | All screens — state machine |
| `radarUpdate` | `{ players: [{id, relX, relY, role}] }` | Game — re-render |
| `proximityAlert` | `{ level: 'LOW' \| 'HIGH' }` | Game — alert state |
| `timerUpdate` | `{ secondsRemaining }` | Game — HUD timer |
| `playerCaught` | `{ caughtId }` | Game — mark player dead |
| `gameOver` | `{ winner, stats, players }` | → Game Over |

---

## 11. Component Tree

```
<App>                           ← state machine router
  <GlobalCRTOverlay />          ← pseudo-element, always on
  
  <LandingScreen />
    <BootSequence />
    <JoinCard>
      <StatusRow />
      <TitleBlock />
      <InputField label="AGENT CODENAME" />
      <InputField label="ROOM ACCESS CODE" />
      <PrimaryButton />
      <GhostButton />
    </JoinCard>
  
  <LobbyScreen />
    <RoomHeader>
      <RoomCode />
      <QRCode />
    </RoomHeader>
    <PlayerList>
      <PlayerRow />          ← × n (animated)
      <WaitingSlot />        ← × (max - n)
    </PlayerList>
    <StartButton />          ← host only
  
  <CharacterSelectScreen />
    <CharGrid>
      <CharCard />           ← × 6
    </CharGrid>
    <ConfirmButton />
  
  <RoleRevealScreen />       ← renders DEMOGORGON or SECURITY variant
    <AtmosphereLayer />
    <RoleIcon />             ← SVG, role-dependent
    <RoleTitleGlitch />
    <RoleDescription />
    <ObjectiveCard />
    <CTAButton />
    <AutoAdvanceCountdown />
  
  <GameScreen />
    <GameCanvas />           ← main game loop, all world rendering
    <HUDLayer>
      <TopBar>
        <RoleBadge />
        <Timer />
        <RoomInfo />
      </TopBar>
      <MiniRadar />          ← separate canvas
      <AlertBanner />        ← conditional
      <DangerEdgePulse />    ← conditional
    </HUDLayer>
    <ControlsLayer>
      <DPad />
      <ActionButtons>
        <CatchButton />      ← demogorgon only
        <AccuseButton />     ← security only
      </ActionButtons>
    </ControlsLayer>
  
  <GameOverScreen />
    <ParticleBurst />
    <AtmosphereLayer />
    <ResultIcon />
    <WinnerTitle />
    <StatsCard />
    <PlayerFateList>
      <FateRow />            ← × n
    </PlayerFateList>
    <RolesRevealed />
    <PlayAgainButton />
    <ExitLobbyButton />
```

---

## 12. State Machine

```
IDLE
  │
  ├─ joinRoom success ──────────────────► LOBBY
  │                                          │
  │                                          ├─ host starts game ─────► CHARACTER_SELECT
  │                                          │                                │
  │                                          │                     all confirmed
  │                                          │                                │
  │                                          │                                ▼
  │                                          │                         ROLE_REVEAL
  │                                          │                                │
  │                                          │                        user taps CTA
  │                                          │                      (or 8s auto-advance)
  │                                          │                                │
  │                                          │                                ▼
  │                                          │                           IN_GAME
  │                                          │                                │
  │                                          │              ┌─────────────────┤
  │                                          │              │                 │
  │                                          │         all caught      correct accuse
  │                                          │         or time out     or time out
  │                                          │              │                 │
  │                                          │              └────────┬────────┘
  │                                          │                       │
  │                                          │                       ▼
  │                                          │                   GAME_OVER
  │                                          │                       │
  │                                          │          ┌────────────┴────────────┐
  │                                          │          │                         │
  │                                    play again    exit lobby
  │                                          │          │                         │
  │                                          └──────────┘                         │
  │                                                                               │
  └───────────────────────────────────────────────────────────────────────────────┘
                                          IDLE
```

**State storage:** Use `useReducer` with a `gamePhase` field, or Zustand store.  
**All transitions triggered by Socket.IO `phaseChanged` events from the server — client never self-transitions.**

---

*Demogorgon Hunt UI Specification — v1.0*  
*For internal hackathon use. Visual theme inspired by Stranger Things. No official IP reproduced.*
