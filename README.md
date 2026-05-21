# Cardhaven

Live Demo: http://arpit-mahala1.github.io/CARDHAVEN/

## Project Overview

Cardhaven is a browser-based roguelike deck-building game built with React and TypeScript. The game delivers strategic turn-based combat, a collectible card progression system, and a minimalist mystical visual style.

## Key Features

- Turn-based deck-building gameplay
- Procedural run progression with battles, events, and rewards
- Strategic card synergies and relic-style upgrades
- Responsive UI built for web and mobile-friendly play
- Live deploy available at the link above

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand for state management
- Zod for validation

## Installation

```bash
cd cardhaven
npm install
```

## Development

```bash
cd cardhaven
npm run dev
```

Open the local development server URL shown in the terminal.

## Build

```bash
cd cardhaven
npm run build
```

## Deployment

This project is configured to deploy to GitHub Pages using `gh-pages`.

```bash
cd cardhaven
npm run deploy
```

## Project Structure

- `cardhaven/src/` — Application source code
- `cardhaven/src/components/` — Gameplay screens and UI components
- `cardhaven/src/pages/` — Top-level route pages
- `cardhaven/src/hooks/` — Custom React hooks for game state and logic
- `cardhaven/src/utils/` — Core game engine, balance, and generator utilities
- `cardhaven/src/data/` — Card, enemy, and relic data files
- `cardhaven/src/styles/` — Global styling and theme files

## Notes

- The game is currently delivered as a static React application.
- The repository includes existing game design documents and implementation guides for future expansion.

## License

This project is released under the MIT License. See `LICENSE` for details.
