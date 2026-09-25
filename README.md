# KAIRÓS

> **Personal Museum & Multiverse Timeline Engine**  
> A private, local-first interactive temporal visualization suite built with React, Vite, and Framer Motion.

---

## Overview

KAIRÓS transforms chronological memories into an interactive, multi-dimensional temporal map. Designed with an aesthetic pastel glassmorphism interface on clean daylight canvas, it enables tracking personal milestones, alternate reality branches, and reflective emotional metrics without sacrificing privacy.

## Key Features

- **Multiverse Timeline Canvas**: Branch-oriented temporal visualization inspired by dimensional timelines, featuring fluid cubic bezier transitions and contextual milestone cards.
- **Reality Branches (`What-If`)**: Divergent milestone exploration to record alternate decisions, hypothetical paths, and scenario retrospectives.
- **Cognitive & Temporal Analytics**: Distribution breakdowns, emotional resonance tracking, and temporal frequency statistics.
- **Zero-Cloud, Local-First Architecture**: 100% client-side execution. No telemetry, no third-party tracking, full data ownership.
- **Export & Backup**: JSON export/import capabilities for offline encrypted storage.

## Tech Stack

- **Core**: React 19, JavaScript (ESM)
- **Tooling**: Vite 6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styles**: Vanilla CSS Design System with CSS Custom Properties and Glassmorphic layers

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/0xhazroot/Kairos.git
cd Kairos

# Install verified dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Build & Production

```bash
# Create optimized production bundle
npm run build

# Preview build locally
npm run preview
```

## Project Structure

```text
kairos/
├── public/              # Static assets
├── src/
│   ├── components/      # Global layout and navigation elements
│   ├── pages/           # Views (Home, Timelines, Branches, Analytics, Profile)
│   ├── styles/          # Global tokens, reset, and glassmorphic variables
│   ├── App.jsx          # Router and view orchestrator
│   └── main.jsx         # Application entry point
├── index.html           # Document root
├── vite.config.js       # Bundler configuration
└── package.json         # Project manifest
```

## License

MIT
