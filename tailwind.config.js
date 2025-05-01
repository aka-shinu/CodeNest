/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate"

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        orbitron: ['var(--font-orbitron)'],
        rajdhani: ['var(--font-rajdhani)'],
      },
      colors: {
        'space-black': '#000510',
        'space-dark': '#050510',
        'space-darker': '#030308',
        'space-light': '#e0e0ff',
        'neon-blue': '#00f3ff',
        'neon-purple': '#9d00ff',
        'neon-pink': '#ff00f7',
        'neon-green': '#00ff9d',
        'neon-cyan': '#00ffff',
        'neon-yellow': '#ffff00',
        'nebula-purple': '#4a0080',
        'nebula-blue': '#004080',
        'hologram-blue': 'rgba(0, 243, 255, 0.1)',
        'hologram-purple': 'rgba(157, 0, 255, 0.1)',
        'hologram-pink': 'rgba(255, 0, 247, 0.1)',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "neon-glow": {
          "0%, 100%": { 
            textShadow: "0 0 5px #00f3ff, 0 0 10px #00f3ff, 0 0 15px #00f3ff",
            boxShadow: "0 0 5px #00f3ff, 0 0 10px #00f3ff, 0 0 15px #00f3ff"
          },
          "50%": { 
            textShadow: "0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff",
            boxShadow: "0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff"
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "hologram": {
          "0%, 100%": { 
            filter: "hue-rotate(0deg) brightness(1)",
            opacity: 0.8
          },
          "50%": { 
            filter: "hue-rotate(180deg) brightness(1.2)",
            opacity: 1
          },
        },
        "matrix-rain": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" },
        },
        "glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        "flicker": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
          "25%, 75%": { opacity: 0.9 },
        },
        "nebula": {
          "0%": { 
            backgroundPosition: "0% 50%",
            filter: "hue-rotate(0deg)"
          },
          "50%": { 
            backgroundPosition: "100% 50%",
            filter: "hue-rotate(180deg)"
          },
          "100%": { 
            backgroundPosition: "0% 50%",
            filter: "hue-rotate(360deg)"
          },
        },
      },
      animation: {
        "neon-glow": "neon-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scan-line": "scan-line 2s linear infinite",
        "hologram": "hologram 3s ease-in-out infinite",
        "matrix-rain": "matrix-rain 20s linear infinite",
        "glitch": "glitch 0.3s ease-in-out infinite",
        "flicker": "flicker 2s ease-in-out infinite",
        "nebula": "nebula 15s ease-in-out infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate],
} 