# Cardhaven Game Design Document

## 1. Overview

**Title:** Cardhaven
**Genre:** Browser-based roguelike deck builder
**Platform:** Web (React + TypeScript)
**Tone:** Mystical-minimalism, calm strategy, tactical depth

### Concept
Cardhaven is a turn-based roguelike deck-building game where players explore a magical sanctuary of cards, battle mysterious enemies, and grow stronger through carefully chosen upgrades. Each run is a short, replayable journey with branching paths, card synergies, and high-score competition.

### Core Loop
1. Start a run with a basic starter deck.
2. Fight sequential battles in a path of rooms.
3. Choose rewards: new cards, relics, potions, or temporary upgrades.
4. Manage deck composition and adapt to enemy patterns.
5. Defeat the final boss or reach the highest floor for leaderboard points.

## 2. Gameplay Systems

### 2.1 Deck Building
- Players begin with a starter deck of 10 cards.
- Deck size grows slowly to maintain consistency and choice.
- Cards are categorized as:
  - `Attack`
  - `Defense`
  - `Utility`
  - `Power`
  - `Draw`
- New cards are rewarded after battles, events, and shop visits.
- Players may remove or upgrade cards at specific rest stops.

### 2.2 Turn Structure
- Each battle is played in alternating turns:
  - Player turn: play cards using energy, use relics, end turn.
  - Enemy turn: enemy actions resolve, dealing damage or applying effects.
- Standard energy budget is 3 per turn.
- Unused energy does not carry over.

### 2.3 Card Mechanics
- Cards have cost, effect, and rarity.
- Example card types:
  - `Strike`: Deal 6 damage.
  - `Block`: Gain 5 shield.
  - `Quick Study`: Draw 2 cards.
  - `Warding Sigil`: Apply weak to attacker next turn.
  - `Innate Spell`: Starts in opening hand.
- Cards may have conditional effects, such as `Gain extra block if you played another skill this turn.`

### 2.4 Relics and Upgrades
- Relics provide passive bonuses or triggered effects.
- Example relics:
  - `Moon Shard`: +1 energy every 5 turns.
  - `Aegis Crystal`: Start each battle with 3 block.
  - `Song of the Haven`: Draw one extra card each turn.
- Relics are rare and must be chosen carefully.
- Upgrade stations allow players to improve a card's effect once per run.

## 3. Progression and Level Design

### 3.1 Run Structure
- Runs are divided into floors with 5-7 encounters each.
- Each floor offers a choice between paths:
  - Combat encounter
  - Shop
  - Rest site
  - Event
  - Elite enemy
- The map is represented as a simple branching path with increasing difficulty.

### 3.2 Room Types
- `Standard Combat`: A normal enemy or small enemy group.
- `Elite Combat`: A stronger enemy with a powerful reward.
- `Rest`: Heal or upgrade a card.
- `Shop`: Buy cards, relics, potions, or remove a card.
- `Event`: One-time choices with risk/reward.
- `Treasure Room`: Guaranteed relic or rare card.

### 3.3 Boss Encounters
- Each final boss is unique and requires adapting to a specific pattern.
- Boss mechanics emphasize the deck building decisions players made earlier.
- Boss examples:
  - `Hallowed Sentinel`: shifts between offense and defense.
  - `Whispering Archive`: steals cards temporarily and punishes large hand sizes.

## 4. Combat and Enemy Design

### 4.1 Enemy Archetypes
- `Shade`: Weak attacker, low HP, can dodge.
- `Warden`: High block and taunt ability.
- `Lurker`: Applies poison and debuffs.
- `Mystic`: Casts spells that punish card play.

### 4.2 Encounter Flow
- Each enemy has a small move list and telegraphed action icons.
- Players can plan ahead with visible enemy intents.
- Combat should reward anticipation and efficient card use.

## 5. User Interface and Aesthetic

### 5.1 Visual Style
- Minimal, elegant UI with dark backgrounds and warm gold accents.
- Cards appear as clean panels with hand-drawn borders.
- Enemies are stylized silhouettes with glowing details.
- Animations are subtle: card hover lift, gentle rune glow, fade transitions.

### 5.2 UX Principles
- Show only essential information during battles.
- Keep the card panel uncluttered, with clear cost and effect text.
- Use consistent iconography for attack, block, draw, and power.
- Provide quick feedback on card play results and enemy actions.

## 6. Game Modes and Features

### 6.1 Standard Run
- The main mode where players advance through floors and beat the final boss.
- Score is based on floors cleared, elite kills, and boss victory.

### 6.2 Daily Run
- A shared challenge with a fixed seed and fixed starting deck.
- Players compete on a leaderboard for the highest score.
- Encourages replayability and community engagement.

### 6.3 Leaderboard
- Tracks top scores across daily and overall runs.
- Supports anonymous names or signed-in players.
- Provides replay value through competitive goals.

### 6.4 Rewards
- In-run rewards include new cards, relics, gold, potions, and temporary buffs.
- Out-of-run achievements unlock cosmetic card sleeves or avatar frames.

## 7. Sample Run Example

1. Start with a simple deck of strikes, blocks, and one draw card.
2. Win the first battle and choose between a `Quick Study` card, a `Moon Shard` relic, or a `Rest` site.
3. Encounter an event that offers either 4 gold or a cursed card.
4. Face an elite enemy and win, earning a powerful relic.
5. Use the shop to remove a weak card and buy a short-term potion.
6. Reach the boss with a deck focused on synergy between defense and card draw.
7. Defeat the boss and earn a high run score for the leaderboard.

## 8. Why This Game Works
- **Replayable:** Each run is short and different every time.
- **Strategic:** Players constantly choose between deck strength and flexibility.
- **Accessible:** Browser-based with simple controls and clear visuals.
- **Competitive:** Leaderboards and daily challenges incentivize return play.
- **Thematic:** Mystical-minimal presentation makes the game feel polished and unique.

---

## 9. Notes for Implementation
- Use the existing `src/utils/battleEngine.ts` for core turn logic.
- Store card and enemy definitions in data files like `src/data/cards.json` and `src/data/enemies.json`.
- Build UI with reusable components: `Card`, `Enemy`, `BattleScreen`, `RewardScreen`, `Leaderboard`.
- Keep game state centralized through hooks like `useGameState`.
- Use Firebase for leaderboards, auth, and persistence where appropriate.
