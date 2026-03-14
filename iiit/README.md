# 🧪 HAWKINS NATIONAL LABORATORY: RADAR INTERFACE

A high-fidelity, retro-futuristic radar simulation interface inspired by the "Upside Down" lore. This project features a CRT-aesthetic dashboard, real-time entity tracking, and a dynamic "Demogorgon" proximity alert system.

## 🌌 Project Overview

This application simulates a classified military monitoring station. It tracks multiple "agents" and a hostile "Unknown Entity" (Demogorgon) within the Hawkins vicinity. The interface is designed with a heavy 1980s computing aesthetic, featuring scanlines, chromatic aberration, and glitch effects.

### Key Features
- **📟 CRT Simulation**: Global scanline overlays, vignette effects, and phosphor-glow styling.
- **📡 Real-time Radar**: An SVG-based concentric radar system with a continuous sweep line and entity blips.
- **👾 Proximity Alerts**: High-priority screen-shake and flashing red alerts when the "Unknown Entity" enters a 15m radius of any agent.
- **🌑 Dual Perspectives**: Switch between "Security View" (Hawkins Lab) and "Entity View" (The Upside Down), each with unique color schemes and thematic copy.
- **🧠 State Management**: Powered by Zustand to handle screen transitions, agent coordinates, and event logs.
- **🔄 Dynamic Simulation**: A custom hook manages the movement of the Demogorgon, which stalks agents in real-time.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Simulation Hooks**: [react-use](https://github.com/streamich/react-use)

---

## 📂 Directory Structure

```text
app/
├── src/
│   ├── components/
│   │   ├── controls/     # Global toggles and demo panels
│   │   ├── radar/        # SVG Radar components (Sweep, Blips, Canvas)
│   │   ├── screens/      # Full-page screen components (Lobby, Hero, etc.)
│   │   └── ui/           # Reusable UI elements (CRTOverlay, GlitchText)
│   ├── data/             # Hardcoded player/agent profiles
│   ├── hooks/            # useGameSimulation and other custom logic
│   ├── store/            # Zustand gameStore implementation
│   ├── styles/           # Tailwind globals and CRT effects
│   ├── types/            # TypeScript interfaces/types
│   ├── App.tsx           # Main router and screen orchestrator
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── tailwind.config.js    # Custom CRT color palette and theme extensions
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd iiit/app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🛡️ Interface Protocol (Screens)

1. **Boot Sequence**: System initialization and hardware checks.
2. **Lobby/Ready**: Agent roster display and "Protocol Initiation".
3. **Main HUD (Hero)**: 
   - **Left Panel**: Agent status, signal strength, and health.
   - **Center Panel**: Real-time SVG Radar tracking.
   - **Right Panel**: Live "Intel Feed" log of events.
4. **Proximity Alert**: Emergency override when a threat is detected within 15 meters.

## 🧪 Simulation Logic

The Demogorgon's behavior is dictated by `useGameSimulation.ts`:
- It moves toward a random player every 2 seconds.
- It calculates distance using the Euclidean formula.
- It triggers a global `proximityAlertActive` state in the store if any agent is in danger.

---

## 🎨 Design System

The project uses a custom color palette defined in `tailwind.config.js`:
- `bg-void`: The deep black background.
- `accent-cyan`: Security/Lab primary color.
- `accent-red`: Hostile/Entity primary color.
- `bg-surface`: Component background with transparency.

---

*“Friends don’t lie. But the Lab does.”*
