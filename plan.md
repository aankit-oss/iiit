
  Phase 1: Project Initialization & Architecture Setup
   1. Initialize the Project: Scaffold a new React + TypeScript project using Vite.
   2. Install Dependencies: Install Tailwind CSS v3, zustand, framer-motion, lucide-react, react-use, and clsx/tailwind-merge (for UI utility).
   3. Establish Directory Structure: Create the exact folder hierarchy specified in the prompt (src/components/ui, src/components/radar, src/store, src/styles,  
      etc.).
   4. Clean Boilerplate: Remove Vite's default CSS and assets. Replace the favicon.ico with an inline SVG of a red monster silhouette in index.html. Add Google  
      Fonts imports (Share Tech Mono, VT323, Courier Prime, Orbitron) to index.html.


  Phase 2: Design System & Global Styling
   1. Configure CSS Variables: Open src/styles/globals.css and define the requested exact color palette (--bg-void, --bg-surface, --accent-red, etc.) as well as 
      the --scanline gradient and text glow variables.
   2. Configure Tailwind: Map the custom CSS variables to Tailwind's tailwind.config.js theme object so they can be used via utility classes (e.g., bg-void,     
      text-accent-cyan).
   3. Implement Global Polish: Add custom CSS rules for the thin cyan scrollbar, the CRT vignette pseudo-element, and the base CRT scanline overlay. Ensure body 
      has a dark background and prevents horizontal scrolling.


  Phase 3: State Management & Game Logic
   1. Mock Data Generation: Create src/data/hardcodedPlayers.ts featuring the 5 specified agents (Hopper, Wheeler, Byers, Hargrove, Unknown Entity) with thematic
      initial coordinates and status states.
   2. Implement Zustand Store: Create src/store/gameStore.ts matching the exact interface provided. Include actions for setScreen, toggleViewAs, addIntelEvent,  
      and triggerProximityAlert.
   3. Simulation Hooks: Build src/hooks/useGameSimulation.ts using react-use (useInterval). Program the Demogorgon to incrementally update its (x, y) coordinates
      toward a random player every 2 seconds and trigger proximityAlertActive if distance drops below 15.


  Phase 4: Foundational Effects & Components
   1. Visual Effects Components:
      - Build CRTOverlay.tsx (fixed position pointer-events-none div with scanlines and vignette).
      - Build GlitchText.tsx (using Framer Motion or CSS keyframes to swap characters).
      - Build ParticleField.tsx (drifting red/maroon SVG particles for the "Upside Down" effect).
   2. Layout Wrappers: Create an AppContainer that applies the CRTOverlay and ParticleField globally across all screens.


  Phase 5: Complex Feature Development (The Radar)
   1. Radar Canvas: Build RadarCanvas.tsx as an SVG element. Draw concentric circles (10m, 25m, 50m) and the crosshairs.
   2. Radar Sweep: Implement SweepLine.tsx utilizing a conic-gradient that rotates 360 degrees infinitely via CSS animation.
   3. Radar Blips:
      - Build PlayerBlip.tsx for the cyan dots.
      - Build DemogorgonBlip.tsx for the pulsing red skull, including the 15m danger radius ring.
   4. Coordinate Mapping: Implement a utility function to map the hardcoded game coordinates to the localized SVG  viewBox coordinates.


  Phase 6: Screen Implementation (Sequential)
   1. Boot Screen: Implement typing text effect ("HAWKINS NATIONAL LABORATORY..."), loading bar, and a setTimeout to automatically dispatch the state change to  
      the 'lobby' screen.
   2. Lobby Screen: Implement the two-column layout. Use Framer Motion to stagger the entrance of the 5 hardcoded player cards. Add the glowing "INITIATE        
      PROTOCOL" button.
   3. Role Reveal Screen: Read viewAs from Zustand. Render either the Security (cyan) or Demogorgon (red/glitch) variant with the appropriate thematic copy and  
      SVG illustrations.
   4. Main Game HUD (Hero Screen):
      - Assemble the 3-panel layout (Agent Status Left, Radar Center, Intel Feed Right).
      - Left Panel: Map over players, show signal bars, and a simulated chat log.
      - Right Panel: Use useInterval to append new thematic strings to the IntelFeedPanel log, auto-scrolling to the bottom.
      - Responsiveness: Ensure CSS media queries stack these panels into collapsible sections on mobile devices.
   5. Proximity Alert Screen: Create an absolute, full-screen, z-index-top overlay that flashes red. Use CSS to shake the viewport. Include a 5-second
      auto-dismiss timeout.
  Phase 7: App Orchestration & Demo Controls
   1. Main Router: In App.tsx, implement a standard React switch/conditional rendering block that listens to the screen value in the Zustand store and renders
      the active screen component wrapped in an AnimatePresence (for Framer Motion fade/wipe transitions).
   2. Demo Panel: Build the floating bottom-right controls panel as requested. Wire up buttons to force state overrides (setScreen('alert'), toggleViewAs(),
      etc.) to allow judges to instantly jump between states.


  Phase 8: Final Review & Polish
   1. Thematic Copy Check: Verify absolutely no "Lorem Ipsum" exists. Ensure all text aligns with the Stranger Things/Hawkins Lab military lore.
   2. Animation Audit: Verify the chromatic aberration on titles, the radar sweep fluidity, the glitch text readability, and the screen transition wipes.
   3. Zero Backend Validation: Ensure the app functions entirely offline/in-memory with no failing fetch requests.

                                                                              