import fs from 'fs';

// My 30 new cards
const cards = [
  {
    id: "c_strike",
    name: "Strike",
    description: "Deal 6 damage.",
    cost: 1,
    cardType: "attack",
    rarity: "common",
    effect: { damage: 6 },
    image: "assets/cards/strike.png"
  },
  {
    id: "c_defend",
    name: "Defend",
    description: "Gain 5 block.",
    cost: 1,
    cardType: "defense",
    rarity: "common",
    effect: { block: 5 },
    image: "assets/cards/defend.png"
  },
  {
    id: "c_blood_sacrifice",
    name: "Blood Sacrifice",
    description: "Take 3 damage. Gain 2 energy.",
    cost: 0,
    cardType: "utility",
    rarity: "uncommon",
    effect: { selfDamage: 3, energyGain: 2 },
    image: "assets/cards/blood_sacrifice.png"
  },
  {
    id: "c_vampiric_bite",
    name: "Vampiric Bite",
    description: "Deal 8 damage. Heal for half the unblocked damage dealt.",
    cost: 2,
    cardType: "attack",
    rarity: "uncommon",
    effect: { damage: 8, heal: 4 },
    image: "assets/cards/vampiric_bite.png"
  },
  {
    id: "c_dark_pact",
    name: "Dark Pact",
    description: "Draw 3 cards. Take 2 damage.",
    cost: 1,
    cardType: "draw",
    rarity: "uncommon",
    effect: { draw: 3, selfDamage: 2 },
    image: "assets/cards/dark_pact.png"
  },
  {
    id: "c_soul_reap",
    name: "Soul Reap",
    description: "Deal 12 damage. If fatal, heal 5 HP.",
    cost: 2,
    cardType: "attack",
    rarity: "rare",
    effect: { damage: 12 },
    image: "assets/cards/soul_reap.png"
  },
  {
    id: "c_bone_shield",
    name: "Bone Shield",
    description: "Gain 12 block. Apply 1 Frail to yourself.",
    cost: 1,
    cardType: "defense",
    rarity: "common",
    effect: { block: 12, statusEffects: [{ type: 'frail', stacks: 1 }] },
    applyToSelf: true,
    image: "assets/cards/bone_shield.png"
  },
  {
    id: "c_toxic_cloud",
    name: "Toxic Cloud",
    description: "Apply 3 Poison to all enemies.",
    cost: 2,
    cardType: "utility",
    rarity: "uncommon",
    targetType: "all",
    effect: { statusEffects: [{ type: 'poison', stacks: 3 }] },
    image: "assets/cards/toxic_cloud.png"
  },
  {
    id: "c_frenzy",
    name: "Frenzy",
    description: "Deal 3 damage 4 times.",
    cost: 2,
    cardType: "attack",
    rarity: "uncommon",
    effect: { damage: 3, hits: 4 },
    image: "assets/cards/frenzy.png"
  },
  {
    id: "c_shadow_cloak",
    name: "Shadow Cloak",
    description: "Gain 8 block and 1 Dexterity.",
    cost: 2,
    cardType: "power",
    rarity: "rare",
    effect: { block: 8, statusEffects: [{ type: 'dexterity', stacks: 1 }] },
    applyToSelf: true,
    image: "assets/cards/shadow_cloak.png"
  },
  {
    id: "c_necromancy",
    name: "Necromancy",
    description: "Exhaust a card. Draw 2 cards.",
    cost: 1,
    cardType: "utility",
    rarity: "rare",
    effect: { draw: 2 },
    exhaust: true,
    image: "assets/cards/necromancy.png"
  },
  {
    id: "c_corpse_explosion",
    name: "Corpse Explosion",
    description: "Apply 4 Doom to an enemy.",
    cost: 2,
    cardType: "utility",
    rarity: "rare",
    effect: { statusEffects: [{ type: 'doom', stacks: 4 }] },
    image: "assets/cards/corpse_explosion.png"
  },
  {
    id: "c_wither",
    name: "Wither",
    description: "Apply 2 Weak and 2 Vulnerable to an enemy.",
    cost: 1,
    cardType: "utility",
    rarity: "uncommon",
    effect: { statusEffects: [{ type: 'weak', stacks: 2 }, { type: 'vulnerable', stacks: 2 }] },
    image: "assets/cards/wither.png"
  },
  {
    id: "c_phantom_strike",
    name: "Phantom Strike",
    description: "Deal 9 damage. Ignore block.",
    cost: 1,
    cardType: "attack",
    rarity: "uncommon",
    effect: { damage: 9 },
    image: "assets/cards/phantom_strike.png"
  },
  {
    id: "c_cursed_blade",
    name: "Cursed Blade",
    description: "Gain 3 Strength. Take 1 damage at the end of your turn.",
    cost: 1,
    cardType: "power",
    rarity: "rare",
    effect: { statusEffects: [{ type: 'strength', stacks: 3 }, { type: 'bleed', stacks: 1 }] },
    applyToSelf: true,
    image: "assets/cards/cursed_blade.png"
  },
  {
    id: "c_blood_barrier",
    name: "Blood Barrier",
    description: "Gain Block equal to 20% of your missing HP.",
    cost: 1,
    cardType: "defense",
    rarity: "uncommon",
    effect: { block: 10 },
    image: "assets/cards/blood_barrier.png"
  },
  {
    id: "c_terror",
    name: "Terror",
    description: "Apply 99 Vulnerable to an enemy. Exhaust.",
    cost: 1,
    cardType: "utility",
    rarity: "rare",
    exhaust: true,
    effect: { statusEffects: [{ type: 'vulnerable', stacks: 99 }] },
    image: "assets/cards/terror.png"
  },
  {
    id: "c_nightmare",
    name: "Nightmare",
    description: "Choose a card. Add 3 copies of it to your hand.",
    cost: 3,
    cardType: "utility",
    rarity: "legendary",
    effect: { draw: 3 },
    exhaust: true,
    image: "assets/cards/nightmare.png"
  },
  {
    id: "c_abyssal_gaze",
    name: "Abyssal Gaze",
    description: "Deal 5 damage to all enemies. Apply 1 Weak.",
    cost: 1,
    cardType: "attack",
    rarity: "common",
    targetType: "all",
    effect: { damage: 5, statusEffects: [{ type: 'weak', stacks: 1 }] },
    image: "assets/cards/abyssal_gaze.png"
  },
  {
    id: "c_ritual_dagger",
    name: "Ritual Dagger",
    description: "Deal 15 damage. If fatal, permanently increase this card's damage by 3. Exhaust.",
    cost: 1,
    cardType: "attack",
    rarity: "rare",
    exhaust: true,
    effect: { damage: 15 },
    image: "assets/cards/ritual_dagger.png"
  },
  {
    id: "c_shatter",
    name: "Shatter",
    description: "Remove all block from an enemy. Deal 10 damage.",
    cost: 2,
    cardType: "attack",
    rarity: "uncommon",
    effect: { damage: 10 },
    image: "assets/cards/shatter.png"
  },
  {
    id: "c_consume",
    name: "Consume",
    description: "Lose 1 Max HP. Gain 2 Strength. Exhaust.",
    cost: 0,
    cardType: "power",
    rarity: "rare",
    exhaust: true,
    effect: { statusEffects: [{ type: 'strength', stacks: 2 }] },
    applyToSelf: true,
    image: "assets/cards/consume.png"
  },
  {
    id: "c_reaper_scythe",
    name: "Reaper's Scythe",
    description: "Deal damage equal to 10% of the enemy's Max HP.",
    cost: 2,
    cardType: "attack",
    rarity: "legendary",
    effect: { healthPercentDamage: 10 },
    image: "assets/cards/reaper_scythe.png"
  },
  {
    id: "c_plague",
    name: "Plague",
    description: "Apply 2 Poison to an enemy. Spread its Poison to all other enemies.",
    cost: 2,
    cardType: "utility",
    rarity: "rare",
    effect: { statusEffects: [{ type: 'poison', stacks: 2 }] },
    image: "assets/cards/plague.png"
  },
  {
    id: "c_dark_ritual",
    name: "Dark Ritual",
    description: "Gain 3 Ritual.",
    cost: 1,
    cardType: "power",
    rarity: "rare",
    effect: { statusEffects: [{ type: 'ritual', stacks: 3 }] },
    applyToSelf: true,
    image: "assets/cards/dark_ritual.png"
  },
  {
    id: "c_carrion_swarm",
    name: "Carrion Swarm",
    description: "Deal 2 damage to all enemies for each status effect they have.",
    cost: 2,
    cardType: "attack",
    rarity: "uncommon",
    targetType: "all",
    effect: { damage: 2, hits: 1 }, 
    image: "assets/cards/carrion_swarm.png"
  },
  {
    id: "c_spectral_shield",
    name: "Spectral Shield",
    description: "Gain 5 block. Retain your hand this turn.",
    cost: 1,
    cardType: "defense",
    rarity: "common",
    effect: { block: 5 },
    image: "assets/cards/spectral_shield.png"
  },
  {
    id: "c_death_knell",
    name: "Death Knell",
    description: "If the enemy is below 30% HP, instantly kill them.",
    cost: 3,
    cardType: "attack",
    rarity: "legendary",
    effect: { damage: 999 }, 
    image: "assets/cards/death_knell.png"
  },
  {
    id: "c_blood_boil",
    name: "Blood Boil",
    description: "All enemies take 5 damage and gain 1 Bleed.",
    cost: 1,
    cardType: "attack",
    rarity: "common",
    targetType: "all",
    effect: { damage: 5, statusEffects: [{ type: 'bleed', stacks: 1 }] },
    image: "assets/cards/blood_boil.png"
  },
  {
    id: "c_banshee_wail",
    name: "Banshee's Wail",
    description: "Apply 2 Weak to all enemies. Exhaust.",
    cost: 0,
    cardType: "utility",
    rarity: "uncommon",
    targetType: "all",
    exhaust: true,
    effect: { statusEffects: [{ type: 'weak', stacks: 2 }] },
    image: "assets/cards/banshee_wail.png"
  }
];

const enemies = [
  {
    id: "e_goblin",
    name: "Goblin Scavenger",
    baseHealth: 25,
    scalingFactor: 1.1,
    actions: [
      { id: "a1", name: "Stab", damage: 6 },
      { id: "a2", name: "Block", block: 5 }
    ],
    lore: "A vile creature drawn to the scent of blood."
  },
  {
    id: "e_skeleton",
    name: "Skeletal Warrior",
    baseHealth: 35,
    scalingFactor: 1.1,
    actions: [
      { id: "a1", name: "Slash", damage: 8 },
      { id: "a2", name: "Defend", block: 8 }
    ],
    lore: "Reanimated bones of a fallen soldier."
  },
  {
    id: "e_cultist",
    name: "Dark Cultist",
    baseHealth: 40,
    scalingFactor: 1.15,
    actions: [
      { id: "a1", name: "Dark Strike", damage: 6 },
      { id: "a2", name: "Incantation", statusEffects: [{ type: "ritual", stacks: 2 }] }
    ],
    lore: "Worships the ancient ones."
  },
  {
    id: "e_wraith",
    name: "Tormented Wraith",
    baseHealth: 30,
    scalingFactor: 1.2,
    actions: [
      { id: "a1", name: "Soul Drain", damage: 5, heal: 5 },
      { id: "a2", name: "Haunt", statusEffects: [{ type: "weak", stacks: 2 }] }
    ],
    lore: "A spirit bound by suffering."
  },
  {
    id: "e_zombie",
    name: "Plague Zombie",
    baseHealth: 45,
    scalingFactor: 1.1,
    actions: [
      { id: "a1", name: "Bite", damage: 7 },
      { id: "a2", name: "Vomit", statusEffects: [{ type: "poison", stacks: 2 }] }
    ],
    lore: "A rotting corpse spreading disease."
  },
  {
    id: "e_gargoyle",
    name: "Stone Gargoyle",
    baseHealth: 60,
    scalingFactor: 1.1,
    actions: [
      { id: "a1", name: "Smash", damage: 10 },
      { id: "a2", name: "Stone Skin", block: 15 }
    ],
    lore: "A stone guardian brought to life."
  },
  {
    id: "e_vampire_bat",
    name: "Vampire Bat",
    baseHealth: 20,
    scalingFactor: 1.05,
    actions: [
      { id: "a1", name: "Swoop", damage: 4 },
      { id: "a2", name: "Leech", damage: 3, heal: 3 }
    ],
    lore: "A giant bat thirsting for blood."
  },
  {
    id: "e_demon",
    name: "Lesser Demon",
    baseHealth: 55,
    scalingFactor: 1.2,
    actions: [
      { id: "a1", name: "Hellfire", damage: 12 },
      { id: "a2", name: "Enrage", statusEffects: [{ type: "strength", stacks: 2 }] }
    ],
    lore: "A fiery fiend from the abyss."
  },
  {
    id: "e_banshee",
    name: "Wailing Banshee",
    baseHealth: 40,
    scalingFactor: 1.15,
    actions: [
      { id: "a1", name: "Shriek", damage: 5, statusEffects: [{ type: "frail", stacks: 1 }] },
      { id: "a2", name: "Curse", statusEffects: [{ type: "vulnerable", stacks: 2 }] }
    ],
    lore: "Her scream paralyzes the soul."
  },
  {
    id: "e_spider",
    name: "Giant Cave Spider",
    baseHealth: 35,
    scalingFactor: 1.1,
    actions: [
      { id: "a1", name: "Bite", damage: 8 },
      { id: "a2", name: "Web", statusEffects: [{ type: "weak", stacks: 2 }] }
    ],
    lore: "Spins webs in the darkest corners."
  },
  {
    id: "e_necromancer",
    name: "Necromancer",
    baseHealth: 65,
    scalingFactor: 1.2,
    actions: [
      { id: "a1", name: "Shadow Bolt", damage: 10 },
      { id: "a2", name: "Summon", summon: "e_skeleton" }
    ],
    lore: "A master of the dark arts."
  },
  {
    id: "e_ghoul",
    name: "Ravenous Ghoul",
    baseHealth: 50,
    scalingFactor: 1.15,
    actions: [
      { id: "a1", name: "Claw", damage: 9 },
      { id: "a2", name: "Devour", damage: 6, heal: 6 }
    ],
    lore: "Feasts on the flesh of the living."
  },
  {
    id: "e_shade",
    name: "Creeping Shade",
    baseHealth: 25,
    scalingFactor: 1.1,
    actions: [
      { id: "a1", name: "Shadow Strike", damage: 7 },
      { id: "a2", name: "Fade", block: 10 }
    ],
    lore: "A manifestation of pure darkness."
  },
  {
    id: "e_blood_mage",
    name: "Blood Mage",
    baseHealth: 45,
    scalingFactor: 1.2,
    actions: [
      { id: "a1", name: "Blood Boil", damage: 8, statusEffects: [{ type: "bleed", stacks: 1 }] },
      { id: "a2", name: "Siphon", damage: 5, heal: 5 }
    ],
    lore: "Uses blood as fuel for magic."
  },
  {
    id: "e_flesh_golem",
    name: "Flesh Golem",
    baseHealth: 80,
    scalingFactor: 1.15,
    actions: [
      { id: "a1", name: "Crush", damage: 15 },
      { id: "a2", name: "Mend", heal: 10 }
    ],
    lore: "An abomination stitched together."
  },
  {
    id: "e_shadow_knight",
    name: "Shadow Knight",
    baseHealth: 70,
    scalingFactor: 1.2,
    actions: [
      { id: "a1", name: "Dark Cleave", damage: 12 },
      { id: "a2", name: "Shield Wall", block: 20 }
    ],
    lore: "A fallen knight sworn to darkness."
  },
  {
    id: "e_lich",
    name: "The Lich",
    baseHealth: 150,
    scalingFactor: 1.3,
    isBoss: true,
    actions: [
      { id: "a1", name: "Soul Steal", damage: 10, heal: 10 },
      { id: "a2", name: "Doom", statusEffects: [{ type: "doom", stacks: 1 }] },
      { id: "a3", name: "Summon", summon: "e_wraith" }
    ],
    lore: "An ancient undead sorcerer."
  },
  {
    id: "e_vampire_lord",
    name: "Vampire Lord",
    baseHealth: 180,
    scalingFactor: 1.3,
    isBoss: true,
    actions: [
      { id: "a1", name: "Bite", damage: 15, heal: 15 },
      { id: "a2", name: "Mesmerize", statusEffects: [{ type: "weak", stacks: 3 }, { type: "frail", stacks: 3 }] },
      { id: "a3", name: "Bat Swarm", damage: 5, hits: 3 }
    ],
    lore: "Ruler of the night."
  },
  {
    id: "e_demon_king",
    name: "Demon King",
    baseHealth: 200,
    scalingFactor: 1.35,
    isBoss: true,
    actions: [
      { id: "a1", name: "Inferno", damage: 20 },
      { id: "a2", name: "Hellish Roar", statusEffects: [{ type: "vulnerable", stacks: 2 }] },
      { id: "a3", name: "Demonic Fortitude", block: 30 }
    ],
    lore: "The supreme ruler of the abyss."
  },
  {
    id: "e_elder_god",
    name: "Awakened Elder God",
    baseHealth: 300,
    scalingFactor: 1.4,
    isBoss: true,
    actions: [
      { id: "a1", name: "Mind Rend", damage: 15, statusEffects: [{ type: "weak", stacks: 1 }] },
      { id: "a2", name: "Reality Warp", statusEffects: [{ type: "doom", stacks: 1 }] },
      { id: "a3", name: "Eldritch Blast", damage: 25 }
    ],
    lore: "A cosmic entity beyond comprehension."
  }
];

const existingCards = JSON.parse(fs.readFileSync('./src/data/cards.json', 'utf8')).cards;
const newCards = [...existingCards];

for (const card of cards) {
  if (!newCards.some(c => c.id === card.id)) {
    newCards.push(card);
  }
}

fs.writeFileSync('./src/data/cards.json', JSON.stringify({ cards: newCards }, null, 2));

const existingEnemies = JSON.parse(fs.readFileSync('./src/data/enemies.json', 'utf8')).enemies;
const newEnemies = [...existingEnemies];
for (const enemy of enemies) {
  if (!newEnemies.some(e => e.id === enemy.id)) {
    newEnemies.push(enemy);
  }
}

fs.writeFileSync('./src/data/enemies.json', JSON.stringify({ enemies: newEnemies }, null, 2));

console.log("Appended new cards and enemies safely.");
