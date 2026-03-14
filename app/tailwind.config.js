/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds ──────────────────────────────────────────────
        void:    'var(--bg-void)',
        surface: 'var(--bg-surface)',
        panel:   'var(--bg-panel)',

        // ── Original accents ─────────────────────────────────────────
        'accent-red':    'var(--accent-red)',
        'accent-maroon': 'var(--accent-maroon)',
        'accent-cyan':   'var(--accent-cyan)',
        'accent-blue':   'var(--accent-blue)',

        // ── Phase 5 accents ───────────────────────────────────────────
        'accent-indigo':  'var(--accent-indigo)',
        'accent-amber':   'var(--accent-amber)',
        'accent-crimson': 'var(--accent-crimson)',
        'accent-violet':  'var(--accent-violet)',
        'accent-green':   'var(--accent-green)',
      },

      fontFamily: {
        mono:     ['"Share Tech Mono"', 'monospace'],
        display:  ['Orbitron', 'sans-serif'],
        terminal: ['VT323', 'monospace'],
        courier:  ['"Courier Prime"', 'monospace'],
      },

      backgroundImage: {
        'scanline-gradient': 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, var(--crt-scanline) 50%, var(--crt-scanline))',
        'void-radial':       'radial-gradient(ellipse at center, rgba(91,47,201,0.08) 0%, transparent 70%)',
        'crimson-radial':    'radial-gradient(ellipse at center, rgba(192,57,43,0.15) 0%, transparent 70%)',
        'cyan-radial':       'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
      },

      boxShadow: {
        'glow-cyan':    '0 0 20px rgba(6,182,212,0.45)',
        'glow-red':     '0 0 20px rgba(239,68,68,0.45)',
        'glow-crimson': '0 0 30px rgba(192,57,43,0.5)',
        'glow-indigo':  '0 0 20px rgba(91,47,201,0.55)',
        'glow-amber':   '0 0 14px rgba(196,154,60,0.4)',
        'glow-green':   '0 0 10px rgba(34,197,94,0.5)',
      },

      textShadow: {
        'glow-cyan':    '0 0 18px rgba(6,182,212,0.75)',
        'glow-red':     '0 0 18px rgba(239,68,68,0.75)',
        'glow-crimson': '0 0 24px rgba(192,57,43,0.9)',
        'glow-indigo':  '0 0 18px rgba(91,47,201,0.8)',
        'glow-amber':   '0 0 18px rgba(196,154,60,0.8)',
      },

      animation: {
        'crt-flicker':    'crt-flicker 0.5s ease-in forwards',
        'amber-pulse':    'amber-pulse 2.4s ease-in-out infinite',
        'portal':         'portal-shimmer 3s ease-in-out infinite',
        'danger-throb':   'danger-throb 1.2s ease-in-out infinite',
        'uplink':         'uplink-blink 1.1s step-end infinite',
        'glitch':         'glitch-slice 0.4s steps(1) forwards',
        'scanline-sweep': 'scanline-sweep 8s linear infinite',
        'cursor':         'cursor-blink 0.8s step-end infinite',
        'spin-slow':      'spin 8s linear infinite',
      },

      letterSpacing: {
        'widest-plus': '0.35em',
        'ultra':       '0.5em',
      },

      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}
