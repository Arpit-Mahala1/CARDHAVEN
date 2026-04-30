# CARDHAVEN: Complete Implementation Plan
## A Free Browser-Based Roguelike Deck Builder with Mystical-Minimal Aesthetic

**Status:** Ready to Build | **Timeline:** 3-4 months (MVP) → 12+ months (Live Service)  
**Budget:** $0 (completely free tools & services)  
**Target:** 100k+ players with real-time leaderboards

---

## PART 0: GAME REBRAND & AESTHETIC DIRECTION

### Why "Cardhaven"?
- **Memorable**: One word, mystical, easy to spell
- **On-brand**: Suggests sanctuary, collection, discovery
- **Available**: Unique enough to own across platforms
- **Timeless**: Doesn't feel dated (unlike "DeckDungeon" which is generic)

### Aesthetic Tone: **Mystical-Minimalism**
A game that feels like an ancient cardshop tucked in a forgotten corner of the internet.

**Visual Language:**
- **Color Palette:**
  - Primary: Deep teal/purple (`#1a1f3a`, `#2d1f4a`)
  - Accent: Warm gold (`#d4af37`), soft green (`#6b9d7a`)
  - Neutral: Off-white (`#f5f1e8`), dark slate (`#0a0e1a`)
  
- **Typography:**
  - Display font: "Crimson Text" (serif, elegant, mystical)
  - Body font: "Inter" (clean, readable, modern)
  - UI accents: Monospace for stats/numbers

- **Visual Elements:**
  - Hand-drawn card borders (SVG)
  - Subtle particle effects (glowing runes, floating dust)
  - Minimalist enemy portraits (silhouettes with glowing eyes)
  - Smooth transitions, no harsh animations
  - Cards have tactile depth (shadow, slight 3D perspective on hover)

- **UI Philosophy:**
  - Whitespace-heavy design
  - Large, readable text
  - Icons instead of buttons where possible
  - Cards as primary interaction objects
  - Information density only where needed

**Why This Works:**
- Stands out from bright, cartoony deck builders
- Appeals to roguelike fans AND indie game enthusiasts
- Feels premium despite being free
- Scales well to mobile (not cluttered)

---

## PART 1: OVERVIEW & CORE VISION

### What is Cardhaven?
A browser-based roguelike deck builder where players:
- Build a deck from 20-30 cards during a run
- Battle procedurally-generated enemies
- Earn upgrades (relics, potions, new cards) after each victory
- Reach the final boss for maximum prestige
- Compete on real-time leaderboards
- Unlock cosmetics (card sleeves, avatars) with in-game currency

### Key Differentiators from MVP to Live
1. **Minimalist UI first** (most indie roguelikes are cluttered)
2. **Real-time leaderboards** (live competition aspect)
3. **No energy systems, no battle pass pressure** (play when you want)
4. **Pure skill-based progression** (no power creep)
5. **Cosmetics-only monetization** (respects player time)

### Why This Works at Scale (No Money Needed)
- **Turn-based = low server load**: No real-time physics, just JSON state validation
- **Free hosting**: Firebase (100GB data, 100k concurrent users free tier), Vercel (unlimited deploys)
- **Minimalist art style = fast production**: No complex animations or 3D models needed
- **Monetization-ready**: Cosmetics layer on top (add later without affecting core gameplay)

---

## PART 2: TECHNOLOGY STACK (ALL FREE)

### Frontend Stack
**Core:**
- **React 18** with TypeScript
- **Vite** (10x faster than CRA)
- **Tailwind CSS** (utility-first styling)
- **Phaser 3** (game engine for animations/particles)

**Why NOT Three.js for this project:**
- Overkill for turn-based card game (no 3D needed)
- Adds 500KB+ bundle size
- Particle effects + animations work perfectly in 2D
- Phaser 3 built specifically for games like this
- Three.js would increase complexity 10x without gameplay benefit

**Graphics Library Stack:**
- **Phaser 3**: Card animations, enemy visuals, UI effects
- **Canvas 2D**: Fallback for simple rendering
- **SVG**: Hand-drawn card borders, icons, UI elements
- **CSS animations**: Transitions, hovers (minimal overhead)

**Deployment:**
- **Vercel** (React hosting, instant deploys, free tier perfect)
- **Firebase Hosting** (static files, CDN, free custom domain)

### Backend & Database
**Firebase (Recommended for MVP):**
- Firestore (JSON documents, better than Realtime DB)
- Firebase Auth (email/Google/anonymous)
- Cloud Functions (validate scores, prevent cheating)
- Hosting (static + serverless)

**Why Firebase for Cardhaven:**
- Automatic scaling (handle 100k players instantly)
- Built-in security rules (prevent database hacks)
- Real-time leaderboard with indexing
- Offline-first support (play offline, sync when online)
- 0 DevOps overhead

### Analytics & Monitoring
- **Firebase Analytics** (free, built-in)
- **Sentry** (error tracking, 5k errors/month free)
- **Google Analytics 4** (user behavior, free)

---

## PART 3: PROJECT STRUCTURE (OPTIMIZED FOR AI)

```
cardhaven/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BattleScreen.tsx          # Main gameplay
│   │   │   ├── Card.tsx                  # Card UI component
│   │   │   ├── Enemy.tsx                 # Enemy display with animations
│   │   │   ├── Leaderboard.tsx           # Real-time rankings
│   │   │   ├── RewardScreen.tsx          # Floor completion screen
│   │   │   ├── MainMenu.tsx              # Home screen
│   │   │   ├── DeckBuilder.tsx           # Deck customization
│   │   │   └── LoadingScreen.tsx         # Minimalist loader
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx              # Main entry
│   │   │   ├── GamePage.tsx              # Game wrapper
│   │   │   ├── LeaderboardPage.tsx       # Stats & rankings
│   │   │   └── ProfilePage.tsx           # Player stats
│   │   │
│   │   ├── hooks/
│   │   │   ├── useGameState.ts           # Game state management
│   │   │   ├── useLeaderboard.ts         # Leaderboard data
│   │   │   ├── useAuth.ts                # Firebase auth
│   │   │   ├── useLocalStorage.ts        # Offline persistence
│   │   │   └── usePhaserScene.ts         # Phaser integration
│   │   │
│   │   ├── utils/
│   │   │   ├── battleEngine.ts           # Turn resolution logic
│   │   │   ├── cardGenerator.ts          # Card reward system
│   │   │   ├── enemyGenerator.ts         # Procedural enemies
│   │   │   ├── balanceData.ts            # All numbers (cost, dmg, etc)
│   │   │   ├── storage.ts                # Local/Firebase storage
│   │   │   ├── random.ts                 # Seedable RNG for replays
│   │   │   └── validators.ts             # Server-side validation
│   │   │
│   │   ├── types/
│   │   │   └── index.ts                  # All TypeScript interfaces
│   │   │
│   │   ├── data/
│   │   │   ├── cards.json                # 30+ card definitions
│   │   │   ├── enemies.json              # 5+ enemy templates
│   │   │   ├── relics.json               # 15+ relic definitions
│   │   │   └── constants.ts              # Game balance numbers
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css               # Tailwind imports, themes
│   │   │   ├── animations.css            # Keyframe animations
│   │   │   └── variables.css             # CSS custom properties
│   │   │
│   │   ├── assets/
│   │   │   ├── cards/                    # Card artwork (SVG/PNG)
│   │   │   ├── enemies/                  # Enemy sprites
│   │   │   ├── icons/                    # UI icons
│   │   │   └── audio/                    # Optional sound effects
│   │   │
│   │   ├── firebase.ts                   # Firebase config
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/ (OPTIONAL - Phase 2)
│   ├── functions/
│   │   ├── submitScore.ts                # Validate & store game runs
│   │   ├── getLeaderboard.ts             # Query top scores
│   │   └── validateRun.ts                # Anti-cheat logic
│   │
│   ├── firestore.rules                   # Security rules
│   ├── .firebaserc
│   └── firebase.json
│
├── docs/
│   ├── ARCHITECTURE.md                   # System design overview
│   ├── CARD_BALANCE.md                   # Complete balance guide
│   ├── ENEMIES.md                        # Enemy design & spawning
│   ├── ROADMAP.md                        # Features by phase
│   ├── STYLE_GUIDE.md                    # Visual/UI standards
│   └── AI_AGENT_GUIDE.md                 # Instructions for Claude Code
│
└── README.md
```

---

## PART 4: PHASE 1 - MVP (MONTHS 1-4)

### Sprint Breakdown (13 weeks)

**Sprint 1-2: Foundation (Weeks 1-3)**
- Project setup (React, Firebase, Vite)
- Core data structures & types
- Firebase authentication
- Local state management

**Sprint 3-4: Battle System (Weeks 4-7)**
- Card playing mechanics
- Enemy turn resolution
- Health/damage/block system
- Status effects (poison, vulnerable, etc)
- Enemy AI & intent display

**Sprint 5-6: UI & Leaderboards (Weeks 8-10)**
- Main game screen with card hand
- Enemy display & animations
- Real-time leaderboard
- Player profile page
- Game over/win screens

**Sprint 7-8: Balance & Polish (Weeks 11-13)**
- Playtesting 20+ full runs
- Balance adjustments
- Bug fixes
- Mobile optimization
- Deploy to Vercel

### What MVP Includes
✅ 30 core cards with distinct mechanics
✅ 5 enemy types with procedural scaling
✅ 15 relics (passive artifacts)
✅ Real-time leaderboard (top 100 players)
✅ Authentication (email + Google OAuth)
✅ Deck customization
✅ Mobile responsive UI
✅ Sound effects (optional)

### What MVP Excludes
❌ Character classes (add in Phase 2)
❌ Story campaign (Phase 2)
❌ Cosmetics shop (Phase 3)
❌ PvP modes (Phase 3)
❌ Complex modifiers (Phase 2)

---

## PART 5: AESTHETIC IMPLEMENTATION GUIDE

### Card Design (Visual)
Each card in Cardhaven should feel like an artifact, not a video game button.

**Card Layout:**
```
┌─────────────────────┐
│  ▔▔▔ STRIKE ▔▔▔    │
│  Cost: 1 ⚡        │
│                     │
│  [Hand with sword]  │ ← SVG illustration
│                     │
│  "Deal 6 damage"    │
│                     │
│  ✦ Common           │
└─────────────────────┘
```

**Design Details:**
- Thin gold borders (mystical feel)
- Hand-drawn card texture (subtle SVG noise)
- Rarity colors: Common (gray), Uncommon (green), Rare (blue), Legendary (gold)
- Icons for cost/damage/block (not text-heavy)
- Hover effect: slight lift + golden glow

### Battle Screen Layout
```
═══════════════════════════════════════════════════════
                    ENEMIES (top)
  [Goblin HP: 8/10]  [Goblin HP: 8/10]
  Intent: ⚔ 3        Intent: ⚔ 3

═══════════════════════════════════════════════════════
              PLAYER STATS (middle-right)
  Health: 20/30  ❤
  Energy: 3/3    ⚡
  Floor: 5       🏛

═══════════════════════════════════════════════════════
                HAND (bottom)
   [Card1] [Card2] [Card3] [Card4] [Card5]
   
   [End Turn Button - subtle, bottom center]
═══════════════════════════════════════════════════════
```

### Color Palette (CSS Variables)
```css
:root {
  --primary-dark: #1a1f3a;      /* Background */
  --primary-accent: #2d1f4a;    /* Cards */
  --secondary-gold: #d4af37;    /* Highlight */
  --accent-green: #6b9d7a;      /* Success */
  --accent-red: #c73e1d;        /* Danger */
  --text-primary: #f5f1e8;      /* Light text */
  --text-secondary: #a0a0a0;    /* Dim text */
}
```

---

## PART 6: HUMAN DEVELOPMENT WORKFLOW

### Your Role as Developer
You're NOT coding every line. You're:
1. **Design decisions** - Which cards/enemies feel fun?
2. **Balance tuning** - Is this card too strong?
3. **Testing & feedback** - Does this feel good to play?
4. **Playtesting** - Playing 20+ full runs to find bugs
5. **Iteration** - "Make the poison effect less punishing"

### How to Work with Claude Code
1. **Give it this document** (the AI-optimized guide below)
2. **Review the code it produces** (always review, never blindly accept)
3. **Test features** in the browser as you go
4. **Report issues clearly** ("The leaderboard doesn't update" not "it's broken")
5. **Request small changes** ("Make cards glow on hover" not "redesign everything")

### Weekly Cadence
**Monday-Wednesday:** Code features (Claude Code handles implementation)
**Thursday:** Playtesting, balance review
**Friday:** Polish, bug fixes, deploy to staging
**Weekend:** Optional - test with friends, gather feedback

---

## PART 7: MONETIZATION (FUTURE - NOT MVP)

Cardhaven stays free to play forever. Revenue comes from optional cosmetics:

**Card Sleeves** ($0.99-2.99)
- Different art styles (cosmic, runic, vintage)
- No gameplay advantage

**Character Avatars** ($1.99)
- Profile pictures for leaderboard
- Seasonal themes

**Emotes** ($0.49-0.99)
- Post-battle reactions
- Limited edition seasonal

**Battle Pass** ($4.99 per 2-month season)
- 30 cosmetic rewards
- No gameplay progression gating

All cosmetics are purely visual. The game is balanced perfectly for free play.

---

## PART 8: SUCCESS METRICS

### Launch Goals (Month 4)
- [ ] 1,000 unique players in first week
- [ ] 100+ daily active users
- [ ] Average run length: 15-20 minutes
- [ ] Win rate: 5-10% (stays challenging)
- [ ] 95%+ uptime (Firebase reliability)
- [ ] <2 second load time

### Scaling Goals (Month 12)
- [ ] 10,000+ registered players
- [ ] 1,000+ daily active users
- [ ] Real-time leaderboard with 50+ fresh scores daily
- [ ] <500ms leaderboard update time
- [ ] Mobile players: 40% of traffic
- [ ] Average session: 30-45 minutes

### Health Metrics to Track
- Player retention: % returning 7 days later
- Session length: Average time per run
- Win/loss ratio: Should hover 5-10% win rate
- Bounce rate: % players who leave after 1 run
- Platform: Mobile vs desktop breakdown

---

## PART 9: DEPLOYMENT CHECKLIST

### Before MVP Launch
- [ ] All 30 cards defined & balanced
- [ ] 5 enemies with procedural scaling tested
- [ ] Leaderboard tested with 100+ fake entries
- [ ] Authentication works (email + Google OAuth)
- [ ] Mobile UI responsive (tested on iPhone/Android)
- [ ] Battle runs 60fps (tested on low-end device)
- [ ] Firebase security rules locked down
- [ ] Privacy policy written (use iubenda free tier)
- [ ] Error handling for offline mode
- [ ] Sentry crash reporting configured

### Launch Day Checklist
- [ ] Deploy frontend to Vercel
- [ ] Verify Firebase read/write ops
- [ ] Test game from fresh account (no cache)
- [ ] Leaderboard accepts scores
- [ ] Share on: Twitter, Reddit (r/gamedev), Discord communities
- [ ] Monitor Sentry for crashes
- [ ] Have support email ready

---

## PART 10: QUICK REFERENCE

### Free Tools Used
| Purpose | Tool | Free Tier |
|---------|------|-----------|
| Frontend | React + Vite | Unlimited |
| Styling | Tailwind CSS | Free (CDN) |
| Game Engine | Phaser 3 | Free, open-source |
| Database | Firebase Firestore | 1GB storage, 50k reads/day |
| Hosting | Vercel + Firebase | Unlimited bandwidth |
| Auth | Firebase Auth | Unlimited users |
| Monitoring | Sentry | 5k errors/month |
| Design | Figma Community | 3 projects |
| Analytics | Google Analytics | Unlimited |

### Key Files to Modify for Balance
- `src/data/cards.json` - Card costs and effects
- `src/utils/balanceData.ts` - All game numbers
- `src/data/enemies.json` - Enemy health/damage
- `docs/CARD_BALANCE.md` - Track all changes

---

**You've got this.** 🎮 Start with the AI Implementation Guide below when you're ready to code.
