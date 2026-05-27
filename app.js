/* 
   ====================================================
   🌌 WORLD OF WARCREST - Core Game Engine (app.js) 🌌
   ====================================================
*/

// --- DATABASE DEFINITIONS ---

const CLASS_DATABASE = {
    Warrior: {
        baseHp: 120,
        baseAtk: 6,
        baseDef: 8,
        baseCrit: 2,
        classIcon: "🛡️",
        statGrowth: { hp: 15, atk: 1, def: 2, crit: 0.5 }
    },
    Mage: {
        baseHp: 65,
        baseAtk: 16,
        baseDef: 2,
        baseCrit: 6,
        classIcon: "🔥",
        statGrowth: { hp: 8, atk: 3, def: 0.5, crit: 1 }
    },
    Rogue: {
        baseHp: 85,
        baseAtk: 10,
        baseDef: 4,
        baseCrit: 10,
        classIcon: "🗡️",
        statGrowth: { hp: 10, atk: 2, def: 1, crit: 1.5 }
    },
    Priest: {
        baseHp: 80,
        baseAtk: 8,
        baseDef: 3,
        baseCrit: 4,
        classIcon: "✨",
        statGrowth: { hp: 9, atk: 1.5, def: 0.8, crit: 0.8 }
    },
    Paladin: {
        baseHp: 105,
        baseAtk: 7,
        baseDef: 6,
        baseCrit: 3,
        classIcon: "🔨",
        statGrowth: { hp: 13, atk: 1.5, def: 1.5, crit: 0.5 }
    }
};

const BASIC_ATTACK_SKILL = { id: "basic_attack", name: "Basic Attack", cost: 0, desc: "Deal 1.0x Atk damage.", icon: "⚔️" };

const SKILL_DATABASE = {
    Warrior: [
        { id: "heroic_strike", name: "Heroic Strike", cost: 4, desc: "Deal 1.5x Atk damage.", icon: "🔨", levelReq: 1 },
        { id: "shield_block", name: "Shield Block", cost: 3, desc: "Increase Def by 60% for 2 turns.", icon: "🛡️", levelReq: 5 },
        { id: "taunt", name: "Taunt", cost: 2, desc: "Force enemy to target the Warrior on next turn.", icon: "🗣️", levelReq: 10 },
        { id: "sunder_armor", name: "Sunder Armor", cost: 4, desc: "Deal 1.1x Atk and reduce enemy Def by 30% for 3 turns.", icon: "🪓", levelReq: 15 },
        { id: "shield_slam", name: "Shield Slam", cost: 5, desc: "Deal 1.8x Def as damage and gain 25% Def for 2 turns.", icon: "💥", levelReq: 20 }
    ],
    Mage: [
        { id: "fireball", name: "Fireball", cost: 4, desc: "Deal 1.8x Atk damage.", icon: "🔥", levelReq: 1 },
        { id: "frostbolt", name: "Frostbolt", cost: 3, desc: "Deal 1.2x Atk and reduce enemy Atk by 25% for 2 turns.", icon: "❄️", levelReq: 5 },
        { id: "amplify_magic", name: "Amplify Magic", cost: 4, desc: "Increase Atk by 45% for 3 turns.", icon: "✨", levelReq: 10 },
        { id: "blink", name: "Blink", cost: 3, desc: "Gain 30% evasion (chance to dodge) for 2 turns.", icon: "🌀", levelReq: 15 },
        { id: "pyroblast", name: "Pyroblast", cost: 7, desc: "Deal 2.8x Atk damage.", icon: "☄️", levelReq: 20 }
    ],
    Rogue: [
        { id: "sinister_strike", name: "Sinister Strike", cost: 3, desc: "Deal 1.4x Atk damage.", icon: "🗡️", levelReq: 1 },
        { id: "expose_armor", name: "Expose Armor", cost: 3, desc: "Reduce enemy Def by 45% for 2 turns.", icon: "🔓", levelReq: 5 },
        { id: "eviscerate", name: "Eviscerate", cost: 5, desc: "Deal 2.0x Atk damage (has an inherent +30% crit chance).", icon: "🩸", levelReq: 10 },
        { id: "feint", name: "Feint", cost: 2, desc: "Reduce own threat weight to 1% for 3 turns.", icon: "🌫️", levelReq: 15 },
        { id: "adrenaline_rush", name: "Adrenaline Rush", cost: 6, desc: "Increase Atk by 30% and Crit by 25% for 3 turns.", icon: "⚡", levelReq: 20 }
    ],
    Priest: [
        { id: "flash_heal", name: "Flash Heal", cost: 3, desc: "Heal lowest HP ally for 1.8x Priest Atk.", icon: "🌟", levelReq: 1 },
        { id: "renew", name: "Renew", cost: 3, desc: "Heal lowest HP ally for 0.6x Atk each turn for 3 turns.", icon: "🌿", levelReq: 5 },
        { id: "power_word_shield", name: "Power Word: Shield", cost: 4, desc: "Absorb up to 2.0x Atk damage on lowest HP ally for 2 turns.", icon: "🫧", levelReq: 10 },
        { id: "prayer_of_healing", name: "Prayer of Healing", cost: 5, desc: "Heal all allies in the group for 1.0x Priest Atk.", icon: "🙌", levelReq: 15 },
        { id: "mind_blast", name: "Mind Blast", cost: 4, desc: "Deal 1.5x Atk damage to enemy.", icon: "🧠", levelReq: 20 }
    ],
    Paladin: [
        { id: "judgement_of_light", name: "Judgement of Light", cost: 3, desc: "Deal 1.1x Atk and heal lowest HP ally for 0.5x Atk.", icon: "☀️", levelReq: 1 },
        { id: "holy_light", name: "Holy Light", cost: 4, desc: "Heal the lowest HP ally for 1.6x Atk.", icon: "⛪", levelReq: 5 },
        { id: "blessing_of_kings", name: "Blessing of Kings", cost: 4, desc: "Boost all allies' Atk and Def by 15% for 3 turns.", icon: "👑", levelReq: 10 },
        { id: "consecration", name: "Consecration", cost: 4, desc: "Deal 0.5x Atk damage to enemy each turn for 3 turns.", icon: "🗺️", levelReq: 15 },
        { id: "lay_on_hands", name: "Lay on Hands", cost: 7, desc: "Fully heal the lowest HP ally (max once per combat).", icon: "🤝", levelReq: 20 }
    ]
};

const ENEMY_ROTATIONS_DATABASE = {
    kobold_vermin: [
        { name: "Candle Strike", action: "attack", mult: 1.2, desc: "Swings its lit candle" },
        { name: "Dig", action: "def_buff", mult: 0.3, duration: 2, desc: "Huddles and digs for protection (+30% Def)" },
        { name: "Scuttle", action: "attack", mult: 0.9, desc: "Quick claw scratch" },
        { name: "Basic Swing", action: "basic" },
        { name: "Run Away", action: "heal", mult: 0.1, desc: "Flees briefly, bandaging (+10% HP)" }
    ],
    forest_spider: [
        { name: "Bite", action: "attack", mult: 1.1, desc: "Sharp venomous bite" },
        { name: "Venom Spit", action: "dot", mult: 0.4, duration: 3, desc: "Shoots poison, dealing damage over time" },
        { name: "Web Spray", action: "atk_debuff", mult: 0.25, duration: 2, desc: "Tangles target in webs (-25% Atk)" },
        { name: "Basic Swing", action: "basic" },
        { name: "Cocoon", action: "def_buff", mult: 0.4, duration: 2, desc: "Wraps itself in webbing (+40% Def)" }
    ],
    ironpaw: [
        { name: "Gnoll Cleave", action: "attack", mult: 1.3, desc: "Cleaves with its massive axe" },
        { name: "Savage Howl", action: "atk_buff", mult: 0.4, duration: 2, desc: "Roars ferociously, increasing its Attack by 40%" },
        { name: "Bonecrack", action: "attack", mult: 1.2, desc: "Smash that breaks bones, dealing high physical damage" },
        { name: "Hamstring", action: "atk_debuff", mult: 0.3, duration: 2, desc: "Slashes legs, reducing the target's Attack by 30%" },
        { name: "Feed", action: "heal", mult: 0.15, desc: "Chomps on food, restoring 15% Max HP" }
    ],
    harvest_golem: [
        { name: "Reap", action: "attack", mult: 1.3, desc: "Slashes with rusty blades" },
        { name: "Metal Clang", action: "def_buff", mult: 0.5, duration: 2, desc: "Reinforces iron plating (+50% Def)" },
        { name: "Sweep", action: "aoe", mult: 0.8, desc: "Sweeps arms, hitting all active group members" },
        { name: "Basic Swing", action: "basic" },
        { name: "Rust", action: "atk_debuff", mult: 0.3, duration: 3, desc: "Sprays rust particles, reducing party Atk by 30%" }
    ],
    outlaw_pillager: [
        { name: "Fireball", action: "attack", mult: 1.8, ignoreDef: true, desc: "Casts Fireball, dealing magic damage that ignores 50% Def" },
        { name: "Scorch", action: "dot", mult: 0.5, duration: 3, desc: "Burns target for fire damage over time" },
        { name: "Pyroblast", action: "attack", mult: 2.5, desc: "Casts a devastating massive fireball" },
        { name: "Basic Swing", action: "basic" },
        { name: "Evocation", action: "atk_buff", mult: 0.5, duration: 2, desc: "Regains magic energy (+50% Atk)" }
    ],
    wastes_raptor: [
        { name: "Raptor Strike", action: "attack", mult: 1.3, desc: "Leaps and slashes with claws" },
        { name: "Savage Bite", action: "dot", mult: 0.6, duration: 2, desc: "Applies a bleeding wound over time" },
        { name: "Leap", action: "attack", mult: 1.5, desc: "Leaps directly at a hero" },
        { name: "Basic Swing", action: "basic" },
        { name: "Adrenaline", action: "atk_buff", mult: 0.4, duration: 3, desc: "Enrages, increasing Attack by 40%" }
    ],
    striped_runner: [
        { name: "Hoof Kick", action: "attack", mult: 1.2, desc: "Powerful back hoof kick" },
        { name: "Dash", action: "evade_buff", mult: 0.3, duration: 2, desc: "Runs swiftly, dodging 30% of incoming physical attacks" },
        { name: "Runner Charge", action: "attack", mult: 1.4, desc: "Rams the target head-on" },
        { name: "Basic Swing", action: "basic" },
        { name: "Graze", action: "heal", mult: 0.1, desc: "Eats savannah grass, recovering 10% Max HP" }
    ],
    fire_elemental: [
        { name: "Fire Shield", action: "def_buff", mult: 0.4, duration: 3, desc: "Surrounds itself with fire (+40% Def)" },
        { name: "Lava Lash", action: "attack", mult: 1.4, desc: "Lashes out with a whip of pure molten lava" },
        { name: "Ignite", action: "dot", mult: 0.6, duration: 3, desc: "Ignites all targets, dealing fire damage over time" },
        { name: "Basic Swing", action: "basic" },
        { name: "Combust", action: "attack", mult: 1.8, desc: "Explodes outward in a burst of flame" }
    ],
    ignis_firelord: [
        { name: "Hand of the Firelord", action: "attack", mult: 1.6, stun: true, desc: "Strikes with the Hand of the Firelord, dealing high damage and stunning the target for 1 turn" },
        { name: "Firelord Smash", action: "atk_debuff", mult: 2.0, duration: 2, desc: "Smashes the target, reducing their Defense by 50% for 2 turns" },
        { name: "Wrath of the Firelord", action: "aoe", mult: 1.2, desc: "Unleashes elemental fire, dealing high damage to ALL party members" },
        { name: "Magma Splash", action: "dot", mult: 0.7, duration: 3, desc: "Coats all heroes in magma, burning them for damage over time" },
        { name: "Molten Regeneration", action: "heal", value: 1000, desc: "Absorbs core energy, restoring 1000 HP" }
    ],
    jungle_tiger: [
        { name: "Pounce", action: "attack", mult: 1.3, desc: "Leaps out from the jungle vines" },
        { name: "Savage Bite", action: "dot", mult: 0.5, duration: 3, desc: "Bites deep, causing bleeding over time" },
        { name: "Claw Strike", action: "attack", mult: 1.1, desc: "Fierce claw slash" },
        { name: "Basic Swing", action: "basic" }
    ],
    pirate_buccaneer: [
        { name: "Cutlass Slash", action: "attack", mult: 1.2, desc: "Slashes with a rusty cutlass" },
        { name: "Flintlock Pistol", action: "attack", mult: 1.5, ignoreDef: true, desc: "Fires a flintlock pistol, bypassing armor" },
        { name: "Drink Grog", action: "heal", mult: 0.15, desc: "Chugs a flask of strong grog (+15% HP)" },
        { name: "Basic Swing", action: "basic" }
    ],
    plague_ghoul: [
        { name: "Flesh Tear", action: "attack", mult: 1.3, desc: "Rips flesh apart with decayed claws" },
        { name: "Rot Spit", action: "dot", mult: 0.6, duration: 2, desc: "Spits poisonous bile over time" },
        { name: "Enfeebling Bite", action: "atk_debuff", mult: 0.3, duration: 2, desc: "Bites target, reducing their Attack by 30%" },
        { name: "Basic Swing", action: "basic" }
    ],
    crypt_horror: [
        { name: "Web Wrap", action: "atk_debuff", mult: 0.25, duration: 2, desc: "Wraps targets in sticky crypt webs (-25% Atk)" },
        { name: "Undead Cleave", action: "aoe", mult: 1.0, desc: "Cleaves through all adventurers" },
        { name: "Basic Swing", action: "basic" },
        { name: "Reanimate", action: "heal", mult: 0.2, desc: "Reconstructs bones, restoring +20% HP" }
    ],
    frost_sabertooth: [
        { name: "Glacial Bite", action: "attack", mult: 1.4, desc: "Chilling frost bite" },
        { name: "Pelt Enrage", action: "atk_buff", mult: 0.4, duration: 3, desc: "Enrages, increasing Attack by 40%" },
        { name: "Swift Pounce", action: "attack", mult: 1.2, desc: "Quick pounce from the snow" },
        { name: "Basic Swing", action: "basic" }
    ],
    crystal_giant: [
        { name: "Avalanche", action: "aoe", mult: 1.1, desc: "Causes a mountain avalanche, hitting all active members" },
        { name: "Crystal Shell", action: "def_buff", mult: 0.5, duration: 2, desc: "Forms an indestructible crystal barrier (+50% Def)" },
        { name: "Shatter Slap", action: "attack", mult: 1.5, desc: "Devastating giant slap" },
        { name: "Basic Swing", action: "basic" }
    ],
    greentooth: [
        { name: "Woodcut Cleave", action: "attack", mult: 1.4, desc: "Cleaves with woodcutter efficiency" },
        { name: "Call Crew", action: "def_buff", mult: 0.3, duration: 2, desc: "Summons miners to guard (+30% Def)" },
        { name: "Flintlock Strike", action: "attack", mult: 1.2, desc: "Fires a sudden flintlock pistol shot" },
        { name: "Basic Swing", action: "basic" }
    ],
    stoneglaive: [
        { name: "Dark Void", action: "dot", mult: 0.5, duration: 3, desc: "Casts a shadow DOT on all heroes" },
        { name: "Ethereal Shield", action: "def_buff", mult: 0.4, duration: 2, desc: "Wards itself with magic (+40% Def)" },
        { name: "Shadow Blast", action: "attack", mult: 1.6, desc: "Fires a bolt of dark energy" },
        { name: "Runic Heal", action: "heal", mult: 0.15, desc: "Restores HP using runes (+15% HP)" }
    ],
    serpentis: [
        { name: "Slither Squeeze", action: "attack", mult: 1.5, stun: true, desc: "Constricts target, stunning for 1 turn" },
        { name: "Acid Spit", action: "dot", mult: 0.4, duration: 3, desc: "Spits burning acid over time" },
        { name: "Serpent Dance", action: "evade_buff", mult: 0.3, duration: 2, desc: "Slithers rapidly, increasing Evasion (+30%)" },
        { name: "Basic Swing", action: "basic" }
    ],
    stonefist: [
        { name: "Jailor Smash", action: "attack", mult: 1.6, desc: "Heavy baton strike" },
        { name: "Iron Wall", action: "def_buff", mult: 0.5, duration: 2, desc: "Braces for impact (+50% Def)" },
        { name: "Riot Howl", action: "atk_buff", mult: 0.3, duration: 2, desc: "Roars to intimidate (+30% Atk)" },
        { name: "Basic Swing", action: "basic" }
    ],
    suncrest: [
        { name: "Holy Wrath", action: "aoe", mult: 1.1, desc: "Strikes everyone with holy fire" },
        { name: "Divine Aegis", action: "def_buff", mult: 0.4, duration: 2, desc: "Summons a glowing golden barrier (+40% Def)" },
        { name: "Smite", action: "attack", mult: 1.5, desc: "Casts a blistering flash of holy energy" },
        { name: "Holy Resurrect", action: "heal", mult: 0.2, desc: "Prays for healing (+20% HP)" }
    ],
    sparkgear: [
        { name: "Steam Slam", action: "attack", mult: 1.6, desc: "Slams with steam-powered fists" },
        { name: "Repair Bot", action: "heal", mult: 0.15, desc: "Deploys a repair drone (+15% HP)" },
        { name: "Gnomish Charge", action: "attack", mult: 1.4, desc: "Rams directly into the target" },
        { name: "Basic Swing", action: "basic" }
    ],
    sandscalp: [
        { name: "Sandstorm", action: "aoe", mult: 0.9, desc: "Kicks up a blinding storm hitting all heroes" },
        { name: "Tribal Fury", action: "atk_buff", mult: 0.4, duration: 3, desc: "Increases Attack (+40%)" },
        { name: "Desert Sunder", action: "attack", mult: 1.5, desc: "Rips through defense" },
        { name: "Basic Swing", action: "basic" }
    ],
    bloodflame: [
        { name: "Magma Breath", action: "aoe", mult: 1.2, desc: "Breathes liquid flame at the entire group" },
        { name: "Blood Curse", action: "dot", mult: 0.6, duration: 3, desc: "Curses target with blood fire DOT" },
        { name: "Scale Harden", action: "def_buff", mult: 0.5, duration: 2, desc: "Hardens ancient dragon scales (+50% Def)" },
        { name: "Basic Swing", action: "basic" }
    ],
    darkforge: [
        { name: "Emperor Slam", action: "attack", mult: 1.8, desc: "Devastating throne-room hammer strike" },
        { name: "Magma Spray", action: "aoe", mult: 1.0, desc: "Sprays liquid rock over all adventurers" },
        { name: "Black Iron Shield", action: "def_buff", mult: 0.6, duration: 2, desc: "Guards behind black iron (+60% Def)" },
        { name: "Basic Swing", action: "basic" }
    ],
    thornwood: [
        { name: "Thorn Lash", action: "attack", mult: 1.5, desc: "Slashes with thorny brambles" },
        { name: "Spore Poison", action: "dot", mult: 0.5, duration: 3, desc: "Poisons targets with toxic forest spores" },
        { name: "Timber Regrowth", action: "heal", mult: 0.15, desc: "Heals using nature's essence (+15% HP)" },
        { name: "Basic Swing", action: "basic" }
    ],
    baron_ashfall: [
        { name: "Runeblade Slash", action: "attack", mult: 1.7, desc: "Unleashes a dark runeblade slash" },
        { name: "Deathcaller Strike", action: "attack", mult: 1.5, stun: true, desc: "Strikes with death power, stunning for 1 turn" },
        { name: "Deathcharger Aura", action: "evade_buff", mult: 0.3, duration: 2, desc: "Rides swiftly, increasing evasion (+30%)" },
        { name: "Death Coil", action: "heal", mult: 0.2, desc: "Heals using unholy shadows (+20% HP)" }
    ],
    darkwing: [
        { name: "Onyx Breath", action: "aoe", mult: 1.3, desc: "Breathes shadow flame, incinerating all targets" },
        { name: "Wing Buffet", action: "attack", mult: 1.8, desc: "Knocks target back with a powerful wing gust" },
        { name: "Draconic Rage", action: "atk_buff", mult: 0.5, duration: 2, desc: "Enrages, increasing Attack by 50%" },
        { name: "Tail Swipe", action: "attack", mult: 1.5, desc: "Swipes tail around" },
        { name: "Basic Swing", action: "basic" }
    ],
    wyrmqueen: [
        { name: "Dragon Brood", action: "aoe", mult: 1.4, desc: "Summons hatchlings to strike all party members" },
        { name: "Scale Barrier", action: "def_buff", mult: 0.5, duration: 2, desc: "Coats scales in obsidian shell (+50% Def)" },
        { name: "Fireball Spit", action: "dot", mult: 0.7, duration: 3, desc: "Spits fire, dealing DOT" },
        { name: "Tail Cleave", action: "attack", mult: 1.8, desc: "Swipes tail for heavy damage" },
        { name: "Deep Breath", action: "attack", mult: 2.2, ignoreDef: true, desc: "Breathes massive deep flame, bypassing defense" }
    ],
    steam_shredder: [
        { name: "Shred", action: "attack", mult: 1.4, desc: "Slashes with mechanical saw blades" },
        { name: "Steam Blast", action: "attack", mult: 1.2, ignoreDef: true, desc: "Releases hot pressurized steam, ignoring 50% Def" },
        { name: "Metal Whir", action: "aoe", mult: 0.8, desc: "Spins rapidly, slicing the whole group" },
        { name: "Defend Mode", action: "def_buff", mult: 0.4, duration: 2, desc: "Shields itself behind iron plates (+40% Def)" },
        { name: "Basic Swing", action: "basic" }
    ],
    grimclaw: [
        { name: "Shadow Bite", action: "attack", mult: 1.3, desc: "Bites with shadowy force" },
        { name: "Frenzied Howl", action: "atk_buff", mult: 0.3, duration: 2, desc: "Howls into the dark, increasing Attack by 30%" },
        { name: "Rake", action: "attack", mult: 1.5, desc: "Slashes deep claws across the target" },
        { name: "Shadow Step", action: "evade_buff", mult: 0.25, duration: 2, desc: "Fades into shadows, increasing Evasion by 25%" },
        { name: "Basic Swing", action: "basic" }
    ],
    shelldon: [
        { name: "Shell Hardening", action: "def_buff", mult: 0.5, duration: 3, desc: "Withdraws slightly to boost Defense by 50%" },
        { name: "Ancient Headbutt", action: "attack", mult: 1.4, desc: "Strikes with its solid ancient head" },
        { name: "Tidal Wave", action: "aoe", mult: 0.8, desc: "Summons a wave of fen water that sweeps the party" },
        { name: "Shell Retreat", action: "heal", mult: 0.15, desc: "Restores health from inside its shell (+15% HP)" },
        { name: "Basic Swing", action: "basic" }
    ],
    brutetooth: [
        { name: "Heavy Club Slam", action: "attack", mult: 1.5, desc: "Slams down a massive wooden club" },
        { name: "Enrage", action: "atk_buff", mult: 0.4, duration: 2, desc: "Grows enraged, boosting Attack by 40%" },
        { name: "Ground Pound", action: "aoe", mult: 0.9, desc: "Stomps the stone floor, shaking the whole group" },
        { name: "Brute Fortitude", action: "def_buff", mult: 0.3, duration: 2, desc: "Braces against pain, increasing Defense by 30%" },
        { name: "Basic Swing", action: "basic" }
    ],
    beastmaster_karl: [
        { name: "Unleash Hounds", action: "aoe", mult: 1.0, desc: "Commands vicious attack hounds to bite the group" },
        { name: "Command: Kill", action: "attack", mult: 1.6, desc: "Directs focused assault against a single target" },
        { name: "Beastial Roar", action: "atk_buff", mult: 0.3, duration: 2, desc: "Roars to inspire feral rage, increasing Attack by 30%" },
        { name: "Mend Pet", action: "heal", mult: 0.1, desc: "Applies healing salves (+10% HP)" },
        { name: "Basic Swing", action: "basic" }
    ],
    iron_pummel: [
        { name: "Crowd Control", action: "attack", mult: 1.4, stun: true, desc: "Stuns the target with a direct mechanical strike" },
        { name: "Piston Slam", action: "attack", mult: 1.7, desc: "Punches forward with steam-powered pistons" },
        { name: "Steam Vents", action: "dot", mult: 0.5, duration: 3, desc: "Sprays superheated steam over time" },
        { name: "Heavy Iron Plate", action: "def_buff", mult: 0.5, duration: 2, desc: "Hardens iron hull plates (+50% Def)" },
        { name: "Basic Swing", action: "basic" }
    ],
    sand_gorgon: [
        { name: "Acidic Bite", action: "dot", mult: 0.6, duration: 3, desc: "Bites with venomous poison over time" },
        { name: "Tail Smash", action: "attack", mult: 1.5, desc: "Smashes its heavy basilisk tail down" },
        { name: "Sandy Burrow", action: "evade_buff", mult: 0.3, duration: 2, desc: "Burrows into the sand, gaining +30% Evasion" },
        { name: "Poisonous Spit", action: "attack", mult: 1.3, desc: "Spits highly corrosive sand venom" },
        { name: "Basic Swing", action: "basic" }
    ],
    shadowprophet_karr: [
        { name: "Shadow Bolt", action: "attack", mult: 1.6, desc: "Launches a concentrated orb of dark magic" },
        { name: "Dark Prophecy", action: "atk_buff", mult: 0.4, duration: 2, desc: "Predicts the party's downfall, boosting Attack by 40%" },
        { name: "Mind Flay", action: "dot", mult: 0.5, duration: 3, desc: "Channels shadow energy to deal damage over time" },
        { name: "Vampiric Heal", action: "heal", mult: 0.15, desc: "Drains life to heal itself (+15% HP)" },
        { name: "Basic Swing", action: "basic" }
    ],
    general_ironfist: [
        { name: "General's Command", action: "atk_buff", mult: 0.3, duration: 3, desc: "Orders an all-out assault, increasing Attack by 30%" },
        { name: "Iron Strike", action: "attack", mult: 1.6, desc: "Devastating broadsword slash" },
        { name: "Shield Wall", action: "def_buff", mult: 0.5, duration: 2, desc: "Huddles behind a heavy shield, increasing Defense by 50%" },
        { name: "Ground Tremor", action: "aoe", mult: 0.9, desc: "Stomps the ground, dealing physical AoE damage" },
        { name: "Basic Swing", action: "basic" }
    ],
    watersprout: [
        { name: "Water Spout", action: "attack", mult: 1.5, desc: "Shoots a high-pressure jet of pure water" },
        { name: "Aqua Shield", action: "def_buff", mult: 0.4, duration: 2, desc: "Surrounds itself with a watery wall (+40% Def)" },
        { name: "Flood", action: "aoe", mult: 1.0, desc: "Floods the chamber, splashing all group members" },
        { name: "Rehydrate", action: "heal", mult: 0.15, desc: "Absorbs local humidity, healing +15% HP" },
        { name: "Basic Swing", action: "basic" }
    ],
    deathmaster_morr: [
        { name: "Necrotic Bolt", action: "attack", mult: 1.5, desc: "Shoots a rotting bolt of plague energy" },
        { name: "Plague Aura", action: "dot", mult: 0.6, duration: 3, desc: "Surrounds itself in toxic pestilence over time" },
        { name: "Unholy Fortification", action: "def_buff", mult: 0.4, duration: 2, desc: "Wards itself with unholy magic (+40% Def)" },
        { name: "Siphon Life", action: "heal", mult: 0.2, desc: "Drains the warmth of the living, healing +20% HP" },
        { name: "Basic Swing", action: "basic" }
    ],
    magmatalon: [
        { name: "Magma Claw", action: "attack", mult: 1.6, desc: "Slashes with claws dipped in molten rock" },
        { name: "Heat Wave", action: "aoe", mult: 1.1, desc: "Releases a blistering wave of hot air hitting all targets" },
        { name: "Fire Scales", action: "def_buff", mult: 0.4, duration: 2, desc: "Ignites its scales to boost Defense by 40%" },
        { name: "Volcanic Roar", action: "atk_buff", mult: 0.3, duration: 2, desc: "Roars aggressively, increasing Attack by 30%" },
        { name: "Basic Swing", action: "basic" }
    ],
    baron_cinder: [
        { name: "Cinder Blast", action: "attack", mult: 1.8, desc: "Casts a concentrated beam of white-hot cinders" },
        { name: "Combustion", action: "dot", mult: 0.7, duration: 3, desc: "Sets the target ablaze, dealing heavy fire DOT" },
        { name: "Heat Barrier", action: "def_buff", mult: 0.5, duration: 2, desc: "Surrounds itself in superheated air (+50% Def)" },
        { name: "Superheat", action: "atk_buff", mult: 0.4, duration: 2, desc: "Ignites internal fire, boosting Attack by 40%" },
        { name: "Basic Swing", action: "basic" }
    ],
    greenscale: [
        { name: "Emerald Breath", action: "aoe", mult: 1.2, desc: "Spews toxic emerald dragon fire across the group" },
        { name: "Hatch Whelps", action: "attack", mult: 1.5, desc: "Commands local whelps to overwhelm the target" },
        { name: "Acid Spray", action: "dot", mult: 0.5, duration: 3, desc: "Sprays corrosive breath over time" },
        { name: "Scales Armor", action: "def_buff", mult: 0.4, duration: 2, desc: "Hardens ancient dragon scales (+40% Def)" },
        { name: "Basic Swing", action: "basic" }
    ]
};

const ITEM_DATABASE = {
    // --- Gathering Materials ---
    copper_ore: { name: "Copper Ore", type: "material", rarity: 1, price: 10, icon: "🪨" },
    broken_candle: { name: "Broken Candle", type: "material", rarity: 0, price: 4, icon: "🕯️" },
    linen_cloth: { name: "Linen Cloth", type: "material", rarity: 1, price: 15, icon: "🧵" },
    spider_venom: { name: "Spider Venom", type: "material", rarity: 1, price: 25, icon: "🧪" },
    ironpaw_claw: { name: "Ironpaw Claw", type: "material", rarity: 2, price: 120, icon: "🐾" },
    woolen_cloth: { name: "Woolen Cloth", type: "material", rarity: 1, price: 35, icon: "🧶" },
    iron_ore: { name: "Iron Ore", type: "material", rarity: 1, price: 40, icon: "🪵" },
    golem_core: { name: "Golem Core", type: "material", rarity: 2, price: 180, icon: "⚡" },
    red_outlaw_mask: { name: "Red Outlaw Mask", type: "material", rarity: 2, price: 250, icon: "🎭" },
    raptor_claw: { name: "Raptor Claw", type: "material", rarity: 1, price: 50, icon: "🦖" },
    medium_leather: { name: "Medium Leather", type: "material", rarity: 1, price: 30, icon: "💼" },
    striped_runner_hoof: { name: "Striped Runner Hoof", type: "material", rarity: 1, price: 60, icon: "🦓" },
    core_leather: { name: "Core Leather", type: "material", rarity: 2, price: 400, icon: "🎗️" },
    essence_of_fire: { name: "Essence of Fire", type: "material", rarity: 2, price: 500, icon: "🔥" },
    fiery_core: { name: "Fiery Core", type: "material", rarity: 3, price: 2000, icon: "☄️" },
    firelord_eye: { name: "Eye of the Firelord", type: "material", rarity: 4, price: 10000, icon: "👁️" },

    // --- Blacksmithing Weapons & Armor ---
    copper_sword: { name: "Copper Sword", type: "weapon", rarity: 1, price: 80, stats: { atk: 4 }, icon: "🗡️" },
    copper_shield: { name: "Copper Shield", type: "shield", rarity: 1, price: 90, stats: { def: 4, hp: 12 }, icon: "🛡️" },
    heavy_copper_boots: { name: "Heavy Copper Boots", type: "boots", rarity: 1, price: 150, stats: { def: 3, hp: 10 }, icon: "🥾" },
    wastes_barbute: { name: "Wastes Barbute", type: "head", rarity: 2, price: 450, stats: { def: 8, hp: 20, crit: 2 }, icon: "🪖" },
    iron_broadsword: { name: "Iron Broadsword", type: "weapon", rarity: 2, price: 280, stats: { atk: 12 }, icon: "⚔️" },
    iron_shield: { name: "Iron Shield", type: "shield", rarity: 2, price: 500, stats: { def: 12, hp: 35 }, icon: "🛡️" },
    golem_crusher: { name: "Golem Crusher", type: "weapon", rarity: 3, price: 900, stats: { atk: 22, crit: 4 }, icon: "🔨" },
    steel_platebody: { name: "Steel Platebody", type: "chest", rarity: 3, price: 1200, stats: { def: 25, hp: 80 }, icon: "👕" },
    dark_iron_boots: { name: "Dark Iron Boots", type: "boots", rarity: 3, price: 1800, stats: { def: 15, hp: 50 }, icon: "🥾" },
    pyroclast_hammer: { name: "Pyroclast Hammer", type: "weapon", rarity: 4, price: 6000, stats: { atk: 65, def: 15, crit: 8 }, icon: "🔨" },
    cinderfury_hand: { name: "Cinderfury, Hand of the Firelord", type: "weapon", rarity: 4, price: 25000, stats: { atk: 150, hp: 200, crit: 15 }, icon: "🌋" },

    // --- Tailoring Cloth Armor ---
    linen_robe: { name: "Linen Robe", type: "chest", rarity: 1, price: 60, stats: { atk: 3, def: 1 }, icon: "🥋" },
    linen_hood: { name: "Linen Hood", type: "head", rarity: 1, price: 50, stats: { atk: 2, hp: 8 }, icon: "👒" },
    woolen_robe: { name: "Woolen Robe", type: "chest", rarity: 2, price: 220, stats: { atk: 9, def: 3 }, icon: "🧥" },
    arcane_hood: { name: "Arcane Hood", type: "head", rarity: 3, price: 850, stats: { atk: 18, def: 5, hp: 35 }, icon: "🦹" },

    // --- Leatherworking Leather Armor ---
    worn_leather_vest: { name: "Worn Leather Vest", type: "chest", rarity: 1, price: 70, stats: { def: 2, atk: 2 }, icon: "🎽" },
    raptor_leather_boots: { name: "Raptor Leather Boots", type: "boots", rarity: 2, price: 350, stats: { def: 5, crit: 5 }, icon: "🥾" },
    tough_leather_jerkin: { name: "Tough Leather Jerkin", type: "chest", rarity: 2, price: 400, stats: { def: 12, atk: 4 }, icon: "🥋" },
    core_leather_belt: { name: "Core Leather Belt", type: "waist", rarity: 3, price: 1500, stats: { def: 18, atk: 10, crit: 8 }, icon: "🎗️" },

    // --- Alchemy Potions ---
    minor_healing_potion: { name: "Minor Healing Potion", type: "potion", rarity: 1, price: 30, desc: "Instantly restores 50 HP.", icon: "🧪" },
    elixir_of_strength: { name: "Elixir of Might", type: "potion", rarity: 2, price: 120, desc: "Adds +5 Attack on next quest.", icon: "🧪" },
    major_healing_potion: { name: "Major Healing Potion", type: "potion", rarity: 3, price: 600, desc: "Instantly restores 250 HP.", icon: "🧪" },

    // --- Adventure Rare & Epic Drops ---
    ironpaws_champion_shield: { name: "Ironpaw's Champion Shield", type: "shield", rarity: 3, price: 800, stats: { def: 10, hp: 30 }, icon: "🛡️" },
    ironpaws_slicer: { name: "Ironpaw's Slicer", type: "weapon", rarity: 3, price: 900, stats: { atk: 18, crit: 5 }, icon: "🗡️" },
    outlaw_staff: { name: "Outlaw Pillager Staff", type: "weapon", rarity: 3, price: 1000, stats: { atk: 25 }, icon: "🧹" },
    harvester_scythe: { name: "Harvester Scythe", type: "weapon", rarity: 3, price: 1100, stats: { atk: 22, crit: 3 }, icon: "🪓" },
    raptor_fury_claw: { name: "Raptor Fury Claw", type: "weapon", rarity: 3, price: 1200, stats: { atk: 24, crit: 6 }, icon: "🗡️" },
    swift_runner_boots: { name: "Swift Runner Boots", type: "boots", rarity: 3, price: 1000, stats: { def: 6, crit: 4 }, icon: "🥾" },
    flame_infused_greaves: { name: "Flame Infused Greaves", type: "boots", rarity: 3, price: 4000, stats: { def: 20, hp: 70 }, icon: "🥾" },
    crown_of_destruction: { name: "Crown of Destruction", type: "head", rarity: 4, price: 15000, stats: { def: 40, hp: 120, crit: 10 }, icon: "👑" },
    essence_of_pure_flame: { name: "Essence of Pure Flame", type: "chest", rarity: 4, price: 20000, stats: { def: 65, hp: 200 }, icon: "🔥" },
    talisman_of_defense: { name: "Talisman of Defense", type: "neck", rarity: 3, price: 1000, stats: { def: 8, hp: 25 }, icon: "📿" },
    fireproof_cloak: { name: "Fireproof Cloak", type: "back", rarity: 3, price: 3000, stats: { def: 15, hp: 50 }, icon: "🦹" },
    flame_infused_ring: { name: "Flame Infused Ring", type: "ring", rarity: 3, price: 3500, stats: { atk: 12, hp: 40 }, icon: "💍" },
    choker_of_fire: { name: "Choker of Fire", type: "neck", rarity: 4, price: 12000, stats: { atk: 35, crit: 6 }, icon: "📿" },
    heart_of_the_firelord: { name: "Heart of the Firelord", type: "trinket", rarity: 4, price: 20000, stats: { atk: 45, crit: 8 }, icon: "🔮" },

    // --- New Character Slot Crafted Gear ---
    heavy_copper_spauldors: { name: "Heavy Copper Spaulders", type: "shoulders", rarity: 1, price: 160, stats: { def: 5, hp: 12 }, icon: "🧣" },
    wastes_shoulders: { name: "Wastes Leather Shoulders", type: "shoulders", rarity: 2, price: 320, stats: { def: 6, atk: 4 }, icon: "🧣" },
    double_stitched_shoulders: { name: "Double Stitched Cloth Shoulders", type: "shoulders", rarity: 2, price: 300, stats: { atk: 6, def: 2 }, icon: "🧣" },
    woolen_gloves: { name: "Woolen Cloth Gloves", type: "hands", rarity: 1, price: 120, stats: { atk: 3, hp: 8 }, icon: "🧤" },
    wastes_gloves: { name: "Wastes Leather Gloves", type: "hands", rarity: 1, price: 140, stats: { def: 3, crit: 2 }, icon: "🧤" },
    iron_gauntlets: { name: "Iron Plate Gauntlets", type: "hands", rarity: 2, price: 350, stats: { def: 8, hp: 15 }, icon: "🧤" },
    linen_belt: { name: "Linen Cloth Belt", type: "waist", rarity: 1, price: 60, stats: { atk: 1, hp: 6 }, icon: "🎗️" },
    copper_waistband: { name: "Copper Plate Waistband", type: "waist", rarity: 1, price: 100, stats: { def: 3, hp: 8 }, icon: "🎗️" },
    linen_pants: { name: "Linen Cloth Pants", type: "legs", rarity: 1, price: 150, stats: { atk: 4, def: 1 }, icon: "👖" },
    runner_leather_leggings: { name: "Runner Leather Leggings", type: "legs", rarity: 2, price: 400, stats: { def: 8, atk: 5 }, icon: "👖" },
    iron_greaves: { name: "Iron Plate Greaves", type: "legs", rarity: 3, price: 900, stats: { def: 18, hp: 45 }, icon: "👖" },
    glowing_cat_eye_necklace: { name: "Glowing Cat Eye Necklace", type: "neck", rarity: 2, price: 500, stats: { atk: 6, crit: 5 }, icon: "📿" },
    cloak_of_the_wastes: { name: "Cloak of the Wastes", type: "back", rarity: 2, price: 280, stats: { def: 4, crit: 3 }, icon: "🦹" },
    worn_cape: { name: "Worn Cloth Cape", type: "back", rarity: 1, price: 80, stats: { def: 1, hp: 10 }, icon: "🦹" },
    copper_band: { name: "Copper Band", type: "ring", rarity: 1, price: 100, stats: { hp: 15 }, icon: "💍" },
    iron_ring_of_crit: { name: "Iron Ring of Crit", type: "ring", rarity: 2, price: 450, stats: { atk: 3, crit: 4 }, icon: "💍" },
    lucky_spider_charm: { name: "Lucky Spider Charm", type: "trinket", rarity: 1, price: 120, stats: { crit: 3 }, icon: "🔮" },
    essence_of_the_golem: { name: "Essence of the Golem", type: "trinket", rarity: 2, price: 650, stats: { def: 10, hp: 30 }, icon: "🔮" },
    
    // --- New Offhand items ---
    spell_tome: { name: "Spell Tome", type: "offhand", rarity: 1, price: 150, stats: { atk: 5, hp: 10 }, icon: "📔" },
    tome_of_intellect: { name: "Tome of Intellect", type: "offhand", rarity: 2, price: 600, stats: { atk: 12, hp: 20, crit: 2 }, icon: "📘" },
    outlaw_orb: { name: "Outlaw Combat Orb", type: "offhand", rarity: 3, price: 1200, stats: { atk: 20, crit: 3 }, icon: "🔮" },
    molten_cinder: { name: "Molten Flame Cinder", type: "offhand", rarity: 4, price: 16000, stats: { atk: 50, hp: 80, crit: 6 }, icon: "🔥" },

    // --- Thorncrest Jungle Drops ---
    jungle_tiger_pelt: { name: "Jungle Tiger Pelt", type: "material", rarity: 1, price: 25, icon: "🐅" },
    pirate_doubloon: { name: "Pirate Doubloon", type: "material", rarity: 2, price: 100, icon: "🪙" },
    panther_stalker_claws: { name: "Panther Stalker Claws", type: "weapon", rarity: 3, price: 1200, stats: { atk: 28, crit: 8 }, icon: "🗡️" },
    buccaneer_tricorn: { name: "Buccaneer Tricorn", type: "head", rarity: 3, price: 1100, stats: { def: 10, crit: 5 }, icon: "🎩" },

    // --- The Rotting Reach Drops ---
    plagued_flesh: { name: "Plagued Flesh", type: "material", rarity: 1, price: 35, icon: "🥩" },
    crypt_rune: { name: "Crypt Rune", type: "material", rarity: 2, price: 150, icon: "🪨" },
    rot_carved_staff: { name: "Rot-Carved Staff", type: "weapon", rarity: 3, price: 2500, stats: { atk: 45, hp: 40 }, icon: "🪄" },
    blighted_spaulders: { name: "Blighted Spaulders", type: "shoulders", rarity: 3, price: 2200, stats: { def: 18, hp: 50 }, icon: "🧣" },

    // --- Glacier Basin Drops ---
    frost_giant_shard: { name: "Frost Giant Shard", type: "material", rarity: 1, price: 50, icon: "❄️" },
    pristine_frost_claw: { name: "Pristine Frost Claw", type: "material", rarity: 2, price: 200, icon: "🐾" },
    glacier_cloak: { name: "Glacier Cloak", type: "back", rarity: 3, price: 4500, stats: { def: 22, hp: 90 }, icon: "🦹" },
    sabertooth_boots: { name: "Sabertooth Boots", type: "boots", rarity: 3, price: 4200, stats: { def: 18, crit: 6 }, icon: "🥾" },

    // --- Dungeon & Raid Drops ---
    greenthroats_cleaver: { name: "Greentooth's Cleaver", type: "weapon", rarity: 3, price: 500, stats: { atk: 12 }, icon: "🪓" },
    grim_oredust: { name: "Grim Oredust", type: "material", rarity: 1, price: 15, icon: "🪵" },
    shadowstone_robe: { name: "Archmage's Robe of Shadows", type: "chest", rarity: 3, price: 600, stats: { def: 6, hp: 25 }, icon: "🧥" },
    feral_rune_mat: { name: "Feral Rune", type: "material", rarity: 2, price: 30, icon: "🪨" },
    fen_serpent_ring: { name: "Fens Serpent Ring", type: "ring", rarity: 3, price: 800, stats: { hp: 30, crit: 2 }, icon: "💍" },
    serpentine_staff: { name: "Serpentine Staff", type: "weapon", rarity: 3, price: 900, stats: { atk: 18, hp: 20 }, icon: "🪄" },
    asylum_warden_shield: { name: "Asylum Warden Shield", type: "secondary", rarity: 3, price: 1100, stats: { def: 20 }, icon: "🛡️" },
    iron_warden_gauntlets: { name: "Iron Warden Gauntlets", type: "hands", rarity: 3, price: 1000, stats: { def: 10, hp: 35 }, icon: "🧤" },
    suncrests_holy_sigil: { name: "Suncrest's Holy Sigil", type: "trinket", rarity: 3, price: 2000, stats: { hp: 50, atk: 10 }, icon: "🔮" },
    arbiters_crimson_robes: { name: "Arbiter's Crimson Robes", type: "chest", rarity: 3, price: 2200, stats: { def: 12, hp: 80 }, icon: "👘" },
    sparkgears_steamaxe: { name: "Sparkgear's Steamaxe", type: "weapon", rarity: 3, price: 2200, stats: { atk: 32 }, icon: "🪓" },
    gnomish_gizmo: { name: "Gnomish Gizmo", type: "material", rarity: 2, price: 80, icon: "⚙️" },
    sandscalps_sunderer: { name: "Sandscalp's Sunderer", type: "weapon", rarity: 3, price: 3200, stats: { atk: 45 }, icon: "⚔️" },
    ancient_troll_relic: { name: "Ancient Troll Relic", type: "material", rarity: 2, price: 120, icon: "🏺" },
    drowned_fane_ring: { name: "Drowned Fane Ring", type: "ring", rarity: 3, price: 3500, stats: { hp: 120, crit: 4 }, icon: "💍" },
    bloodflame_orb: { name: "Bloodflame Orb", type: "offhand", rarity: 3, price: 3800, stats: { atk: 30, hp: 50 }, icon: "🔮" },
    darkforge_crown: { name: "Emperor's Darkforge Crown", type: "head", rarity: 3, price: 5000, stats: { def: 24, hp: 150 }, icon: "👑" },
    black_iron_essence: { name: "Essence of Black Iron", type: "material", rarity: 2, price: 250, icon: "🌑" },
    thornwood_ring: { name: "Thornwood Ring of Crit", type: "ring", rarity: 3, price: 5500, stats: { crit: 10 }, icon: "💍" },
    feral_greaves: { name: "Feral Greaves", type: "legs", rarity: 3, price: 5200, stats: { def: 28, hp: 120 }, icon: "👖" },
    ashfall_runeblade: { name: "Ashfall Runeblade", type: "weapon", rarity: 3, price: 7500, stats: { atk: 65, crit: 8 }, icon: "🗡️" },
    deathcharger_shield: { name: "Baron's Deathcharger Shield", type: "secondary", rarity: 3, price: 7000, stats: { def: 45, hp: 200 }, icon: "🛡️" },
    darkwing_greatsword: { name: "Darkwing's Draconic Greatsword", type: "weapon", rarity: 4, price: 15000, stats: { atk: 110, crit: 12 }, icon: "⚔️" },
    onyx_prince_ring: { name: "Onyx Prince Ring", type: "ring", rarity: 4, price: 12000, stats: { hp: 300, crit: 8 }, icon: "💍" },
    vermina_scale_spaulders: { name: "Vermina's Scale Spaulders", type: "shoulders", rarity: 4, price: 14000, stats: { def: 40, hp: 250 }, icon: "🧣" },
    wyrmqueens_crown: { name: "Wyrmqueen's Crown", type: "head", rarity: 4, price: 16000, stats: { def: 42, hp: 300, crit: 10 }, icon: "👑" }
};

const ZONE_DATABASE = [
    {
        id: 0,
        name: "Elderwood Forest",
        type: "zone",
        lvlRange: "1 - 10",
        enemies: [
            {
                id: "kobold_vermin",
                name: "Kobold Vermin",
                level: 1,
                hp: 20,
                atk: 3,
                def: 1,
                xp: 15,
                copper: 15,
                duration: 5,
                drops: [
                    { itemId: "copper_ore", rate: 0.6 },
                    { itemId: "broken_candle", rate: 0.4 }
                ],
                icon: "🐹"
            },
            {
                id: "forest_spider",
                name: "Forest Spider",
                level: 4,
                hp: 45,
                atk: 5,
                def: 2,
                xp: 30,
                copper: 35,
                duration: 10,
                drops: [
                    { itemId: "linen_cloth", rate: 0.65 },
                    { itemId: "spider_venom", rate: 0.35 }
                ],
                icon: "🕷️"
            },
            {
                id: "ironpaw",
                name: "Ironpaw the Defiant [Elite]",
                level: 10,
                hp: 150,
                atk: 14,
                def: 6,
                xp: 90,
                copper: 150,
                duration: 30,
                drops: [
                    { itemId: "ironpaw_claw", rate: 0.3 },
                    { itemId: "linen_cloth", rate: 0.5 },
                    { itemId: "woolen_cloth", rate: 0.4 },
                    { itemId: "ironpaws_champion_shield", rate: 0.1 },
                    { itemId: "ironpaws_slicer", rate: 0.1 }
                ],
                icon: "👹"
            }
        ]
    },
    {
        id: 1,
        name: "The Grim Mines",
        type: "dungeon",
        lvlRange: "5 - 10",
        enemies: [
            {
                id: "outlaw_scamp",
                name: "Outlaw Scamp",
                level: 6,
                hp: 80,
                atk: 8,
                def: 4,
                xp: 60,
                copper: 80,
                duration: 15,
                drops: [
                    { itemId: "linen_cloth", rate: 0.6 },
                    { itemId: "copper_ore", rate: 0.4 }
                ],
                icon: "🧑‍🎤"
            },
            {
                id: "grim_digger",
                name: "Grim Mine Digger",
                level: 6,
                hp: 90,
                atk: 9,
                def: 5,
                xp: 65,
                copper: 90,
                duration: 15,
                drops: [
                    { itemId: "linen_cloth", rate: 0.5 },
                    { itemId: "copper_ore", rate: 0.5 }
                ],
                icon: "⛏️"
            },
            {
                id: "steam_shredder",
                name: "Steam Shredder [Boss]",
                level: 8,
                hp: 250,
                atk: 18,
                def: 8,
                xp: 200,
                copper: 350,
                duration: 35,
                drops: [
                    { itemId: "grim_oredust", rate: 0.5 },
                    { itemId: "copper_ore", rate: 0.8 }
                ],
                icon: "🤖"
            },
            {
                id: "greentooth",
                name: "Captain Greentooth [Boss]",
                level: 10,
                hp: 350,
                atk: 22,
                def: 10,
                xp: 300,
                copper: 500,
                duration: 45,
                drops: [
                    { itemId: "greenthroats_cleaver", rate: 0.2 },
                    { itemId: "grim_oredust", rate: 0.8 },
                    { itemId: "linen_cloth", rate: 0.5 }
                ],
                icon: "👹"
            }
        ]
    },
    {
        id: 2,
        name: "Shadowstone Keep",
        type: "dungeon",
        lvlRange: "8 - 12",
        enemies: [
            {
                id: "shadowstone_wolf",
                name: "Shadowstone Wolf",
                level: 8,
                hp: 100,
                atk: 12,
                def: 5,
                xp: 80,
                copper: 100,
                duration: 15,
                drops: [
                    { itemId: "medium_leather", rate: 0.6 }
                ],
                icon: "🐺"
            },
            {
                id: "keep_sentry",
                name: "Keep Sentry",
                level: 9,
                hp: 110,
                atk: 13,
                def: 6,
                xp: 85,
                copper: 120,
                duration: 18,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.6 }
                ],
                icon: "💂"
            },
            {
                id: "grimclaw",
                name: "Grimclaw [Boss]",
                level: 10,
                hp: 300,
                atk: 22,
                def: 10,
                xp: 250,
                copper: 400,
                duration: 35,
                drops: [
                    { itemId: "medium_leather", rate: 0.8 }
                ],
                icon: "🐺"
            },
            {
                id: "stoneglaive",
                name: "Archmage Stoneglaive [Boss]",
                level: 12,
                hp: 400,
                atk: 26,
                def: 12,
                xp: 400,
                copper: 700,
                duration: 50,
                drops: [
                    { itemId: "shadowstone_robe", rate: 0.2 },
                    { itemId: "feral_rune_mat", rate: 0.8 },
                    { itemId: "woolen_cloth", rate: 0.5 }
                ],
                icon: "🧙‍♂️"
            }
        ]
    },
    {
        id: 3,
        name: "Sunset Plains",
        type: "zone",
        lvlRange: "10 - 20",
        enemies: [
            {
                id: "harvest_golem",
                name: "Harvest Golem",
                level: 12,
                hp: 180,
                atk: 15,
                def: 8,
                xp: 120,
                copper: 250,
                duration: 15,
                drops: [
                    { itemId: "iron_ore", rate: 0.7 },
                    { itemId: "golem_core", rate: 0.3 },
                    { itemId: "harvester_scythe", rate: 0.05 }
                ],
                icon: "🤖"
            },
            {
                id: "outlaw_pillager",
                name: "Outlaw Pillager",
                level: 16,
                hp: 250,
                atk: 25,
                def: 5,
                xp: 200,
                copper: 500,
                duration: 25,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.7 },
                    { itemId: "red_outlaw_mask", rate: 0.25 },
                    { itemId: "outlaw_staff", rate: 0.05 },
                    { itemId: "talisman_of_defense", rate: 0.05 },
                    { itemId: "outlaw_orb", rate: 0.05 }
                ],
                icon: "🎭"
            }
        ]
    },
    {
        id: 4,
        name: "Wailing Fens",
        type: "dungeon",
        lvlRange: "12 - 18",
        enemies: [
            {
                id: "fen_raptor",
                name: "Fen Raptor",
                level: 13,
                hp: 150,
                atk: 16,
                def: 8,
                xp: 120,
                copper: 180,
                duration: 20,
                drops: [
                    { itemId: "raptor_claw", rate: 0.6 },
                    { itemId: "medium_leather", rate: 0.4 }
                ],
                icon: "🦖"
            },
            {
                id: "fen_ooze",
                name: "Slimy Fen Ooze",
                level: 14,
                hp: 170,
                atk: 18,
                def: 10,
                xp: 140,
                copper: 200,
                duration: 22,
                drops: [
                    { itemId: "medium_leather", rate: 0.5 }
                ],
                icon: "🦠"
            },
            {
                id: "shelldon",
                name: "Shelldon the Ancient [Boss]",
                level: 16,
                hp: 450,
                atk: 24,
                def: 18,
                xp: 350,
                copper: 600,
                duration: 45,
                drops: [
                    { itemId: "fen_serpent_ring", rate: 0.1 },
                    { itemId: "medium_leather", rate: 0.8 }
                ],
                icon: "🐢"
            },
            {
                id: "serpentis",
                name: "Lord Serpentis [Boss]",
                level: 18,
                hp: 550,
                atk: 32,
                def: 15,
                xp: 500,
                copper: 1000,
                duration: 60,
                drops: [
                    { itemId: "fen_serpent_ring", rate: 0.2 },
                    { itemId: "serpentine_staff", rate: 0.2 },
                    { itemId: "woolen_cloth", rate: 0.5 }
                ],
                icon: "🐍"
            }
        ]
    },
    {
        id: 5,
        name: "Stockade Asylum",
        type: "dungeon",
        lvlRange: "15 - 22",
        enemies: [
            {
                id: "riotous_inmate",
                name: "Riotous Inmate",
                level: 16,
                hp: 180,
                atk: 18,
                def: 10,
                xp: 160,
                copper: 220,
                duration: 25,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.6 }
                ],
                icon: "🧑‍🎤"
            },
            {
                id: "asylum_warden",
                name: "Corrupt Asylum Warden",
                level: 17,
                hp: 200,
                atk: 20,
                def: 12,
                xp: 180,
                copper: 250,
                duration: 25,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.5 }
                ],
                icon: "👮"
            },
            {
                id: "brutetooth",
                name: "Brutetooth [Boss]",
                level: 20,
                hp: 600,
                atk: 34,
                def: 18,
                xp: 450,
                copper: 900,
                duration: 55,
                drops: [
                    { itemId: "iron_warden_gauntlets", rate: 0.1 }
                ],
                icon: "👹"
            },
            {
                id: "stonefist",
                name: "Warden Stonefist [Boss]",
                level: 22,
                hp: 700,
                atk: 38,
                def: 20,
                xp: 700,
                copper: 1400,
                duration: 70,
                drops: [
                    { itemId: "asylum_warden_shield", rate: 0.2 },
                    { itemId: "iron_warden_gauntlets", rate: 0.2 },
                    { itemId: "medium_leather", rate: 0.5 }
                ],
                icon: "👮"
            }
        ]
    },
    {
        id: 6,
        name: "The Red Wastes",
        type: "zone",
        lvlRange: "10 - 25",
        enemies: [
            {
                id: "wastes_raptor",
                name: "Wastes Raptor",
                level: 14,
                hp: 200,
                atk: 18,
                def: 6,
                xp: 150,
                copper: 300,
                duration: 20,
                drops: [
                    { itemId: "raptor_claw", rate: 0.6 },
                    { itemId: "medium_leather", rate: 0.45 },
                    { itemId: "raptor_fury_claw", rate: 0.05 }
                ],
                icon: "🦖"
            },
            {
                id: "striped_runner",
                name: "Striped Runner",
                level: 15,
                hp: 220,
                atk: 16,
                def: 7,
                xp: 160,
                copper: 350,
                duration: 20,
                drops: [
                    { itemId: "striped_runner_hoof", rate: 0.6 },
                    { itemId: "medium_leather", rate: 0.45 },
                    { itemId: "swift_runner_boots", rate: 0.05 }
                ],
                icon: "🦓"
            }
        ]
    },
    {
        id: 7,
        name: "Scarlet Cathedral",
        type: "dungeon",
        lvlRange: "20 - 30",
        enemies: [
            {
                id: "crimson_crusader",
                name: "Crimson Crusader",
                level: 24,
                hp: 350,
                atk: 30,
                def: 15,
                xp: 300,
                copper: 400,
                duration: 30,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.5 }
                ],
                icon: "🛡️"
            },
            {
                id: "crimson_chaplain",
                name: "Crimson Chaplain",
                level: 25,
                hp: 380,
                atk: 32,
                def: 16,
                xp: 320,
                copper: 450,
                duration: 32,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.6 }
                ],
                icon: "⛪"
            },
            {
                id: "beastmaster_karl",
                name: "Beastmaster Karl [Boss]",
                level: 28,
                hp: 900,
                atk: 48,
                def: 24,
                xp: 800,
                copper: 1500,
                duration: 65,
                drops: [
                    { itemId: "arbiters_crimson_robes", rate: 0.1 }
                ],
                icon: "🏹"
            },
            {
                id: "suncrest",
                name: "High Arbiter Suncrest [Boss]",
                level: 30,
                hp: 1200,
                atk: 56,
                def: 28,
                xp: 1200,
                copper: 2200,
                duration: 90,
                drops: [
                    { itemId: "suncrests_holy_sigil", rate: 0.2 },
                    { itemId: "arbiters_crimson_robes", rate: 0.2 }
                ],
                icon: "✝️"
            }
        ]
    },
    {
        id: 8,
        name: "Gnomish Depths",
        type: "dungeon",
        lvlRange: "22 - 30",
        enemies: [
            {
                id: "irradiated_mech",
                name: "Irradiated Mech",
                level: 24,
                hp: 360,
                atk: 28,
                def: 18,
                xp: 320,
                copper: 450,
                duration: 30,
                drops: [
                    { itemId: "iron_ore", rate: 0.5 },
                    { itemId: "golem_core", rate: 0.3 }
                ],
                icon: "🤖"
            },
            {
                id: "gnomish_mechanic",
                name: "Gnomish Mechanic",
                level: 25,
                hp: 390,
                atk: 30,
                def: 20,
                xp: 350,
                copper: 500,
                duration: 32,
                drops: [
                    { itemId: "iron_ore", rate: 0.6 }
                ],
                icon: "⚙️"
            },
            {
                id: "iron_pummel",
                name: "Iron Pummel 9000 [Boss]",
                level: 28,
                hp: 1000,
                atk: 54,
                def: 28,
                xp: 900,
                copper: 1600,
                duration: 70,
                drops: [
                    { itemId: "gnomish_gizmo", rate: 0.6 }
                ],
                icon: "🤖"
            },
            {
                id: "sparkgear",
                name: "Tinkerer Sparkgear [Boss]",
                level: 30,
                hp: 1300,
                atk: 60,
                def: 32,
                xp: 1300,
                copper: 2400,
                duration: 95,
                drops: [
                    { itemId: "sparkgears_steamaxe", rate: 0.2 },
                    { itemId: "gnomish_gizmo", rate: 0.8 }
                ],
                icon: "⚙️"
            }
        ]
    },
    {
        id: 9,
        name: "Thorncrest Jungle",
        type: "zone",
        lvlRange: "25 - 35",
        enemies: [
            {
                id: "jungle_tiger",
                name: "Jungle Tiger",
                level: 28,
                hp: 450,
                atk: 36,
                def: 14,
                xp: 350,
                copper: 750,
                duration: 35,
                drops: [
                    { itemId: "jungle_tiger_pelt", rate: 0.65 },
                    { itemId: "medium_leather", rate: 0.5 },
                    { itemId: "panther_stalker_claws", rate: 0.08 }
                ],
                icon: "🐅"
            },
            {
                id: "pirate_buccaneer",
                name: "Pirate Buccaneer",
                level: 32,
                hp: 550,
                atk: 42,
                def: 18,
                xp: 450,
                copper: 950,
                duration: 45,
                drops: [
                    { itemId: "pirate_doubloon", rate: 0.45 },
                    { itemId: "linen_cloth", rate: 0.6 },
                    { itemId: "buccaneer_tricorn", rate: 0.08 }
                ],
                icon: "🏴‍☠️"
            }
        ]
    },
    {
        id: 10,
        name: "Troll-Sand Temple",
        type: "dungeon",
        lvlRange: "30 - 38",
        enemies: [
            {
                id: "sand_basilisk",
                name: "Sand Basilisk",
                level: 32,
                hp: 550,
                atk: 40,
                def: 22,
                xp: 500,
                copper: 750,
                duration: 40,
                drops: [
                    { itemId: "medium_leather", rate: 0.6 }
                ],
                icon: "🦎"
            },
            {
                id: "temple_zealot",
                name: "Sandscalp Zealot",
                level: 34,
                hp: 600,
                atk: 44,
                def: 24,
                xp: 550,
                copper: 800,
                duration: 42,
                drops: [
                    { itemId: "medium_leather", rate: 0.5 }
                ],
                icon: "👹"
            },
            {
                id: "sand_gorgon",
                name: "Gorgon the Sandcrawler [Boss]",
                level: 36,
                hp: 1400,
                atk: 68,
                def: 34,
                xp: 1200,
                copper: 2500,
                duration: 80,
                drops: [
                    { itemId: "ancient_troll_relic", rate: 0.6 }
                ],
                icon: "🦎"
            },
            {
                id: "sandscalp",
                name: "Chief Sandscalp [Boss]",
                level: 38,
                hp: 1800,
                atk: 78,
                def: 38,
                xp: 1800,
                copper: 3800,
                duration: 110,
                drops: [
                    { itemId: "sandscalps_sunderer", rate: 0.2 },
                    { itemId: "ancient_troll_relic", rate: 0.8 }
                ],
                icon: "🧝"
            }
        ]
    },
    {
        id: 11,
        name: "The Drowned Fane",
        type: "dungeon",
        lvlRange: "35 - 42",
        enemies: [
            {
                id: "temple_wyrm",
                name: "Temple Wyrm",
                level: 36,
                hp: 680,
                atk: 48,
                def: 26,
                xp: 650,
                copper: 950,
                duration: 45,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.6 }
                ],
                icon: "🐉"
            },
            {
                id: "fane_dragonkin",
                name: "Fane Dragonkin",
                level: 38,
                hp: 750,
                atk: 52,
                def: 28,
                xp: 700,
                copper: 1100,
                duration: 48,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.5 }
                ],
                icon: "🐉"
            },
            {
                id: "shadowprophet_karr",
                name: "Shadowprophet Karr [Boss]",
                level: 40,
                hp: 1800,
                atk: 84,
                def: 40,
                xp: 1600,
                copper: 3000,
                duration: 90,
                drops: [
                    { itemId: "bloodflame_orb", rate: 0.6 }
                ],
                icon: "🧙‍♂️"
            },
            {
                id: "bloodflame",
                name: "Avatar of the Bloodflame [Boss]",
                level: 42,
                hp: 2200,
                atk: 92,
                def: 45,
                xp: 2200,
                copper: 4500,
                duration: 120,
                drops: [
                    { itemId: "drowned_fane_ring", rate: 0.2 },
                    { itemId: "bloodflame_orb", rate: 0.2 }
                ],
                icon: "🐉"
            }
        ]
    },
    {
        id: 12,
        name: "The Rotting Reach",
        type: "zone",
        lvlRange: "35 - 45",
        enemies: [
            {
                id: "plague_ghoul",
                name: "Plague Ghoul",
                level: 38,
                hp: 750,
                atk: 52,
                def: 20,
                xp: 650,
                copper: 1200,
                duration: 50,
                drops: [
                    { itemId: "plagued_flesh", rate: 0.7 },
                    { itemId: "woolen_cloth", rate: 0.5 },
                    { itemId: "blighted_spaulders", rate: 0.08 }
                ],
                icon: "🧟"
            },
            {
                id: "crypt_horror",
                name: "Crypt Horror",
                level: 42,
                hp: 900,
                atk: 58,
                def: 22,
                xp: 800,
                copper: 1400,
                duration: 55,
                drops: [
                    { itemId: "crypt_rune", rate: 0.4 },
                    { itemId: "iron_ore", rate: 0.5 },
                    { itemId: "rot_carved_staff", rate: 0.08 }
                ],
                icon: "🕷️"
            }
        ]
    },
    {
        id: 13,
        name: "Glacier Basin",
        type: "zone",
        lvlRange: "45 - 55",
        enemies: [
            {
                id: "frost_sabertooth",
                name: "Frost Sabertooth",
                level: 48,
                hp: 1100,
                atk: 68,
                def: 24,
                xp: 1100,
                copper: 1800,
                duration: 60,
                drops: [
                    { itemId: "pristine_frost_claw", rate: 0.45 },
                    { itemId: "medium_leather", rate: 0.6 },
                    { itemId: "sabertooth_boots", rate: 0.08 }
                ],
                icon: "🐆"
            },
            {
                id: "crystal_giant",
                name: "Crystal Giant",
                level: 52,
                hp: 1400,
                atk: 74,
                def: 30,
                xp: 1300,
                copper: 2100,
                duration: 70,
                drops: [
                    { itemId: "frost_giant_shard", rate: 0.75 },
                    { itemId: "golem_core", rate: 0.4 },
                    { itemId: "glacier_cloak", rate: 0.08 }
                ],
                icon: "💎"
            }
        ]
    },
    {
        id: 14,
        name: "Darkstone Depths",
        type: "dungeon",
        lvlRange: "45 - 54",
        enemies: [
            {
                id: "darkforge_guard",
                name: "Darkforge Guard",
                level: 48,
                hp: 1200,
                atk: 75,
                def: 38,
                xp: 1100,
                copper: 1600,
                duration: 60,
                drops: [
                    { itemId: "core_leather", rate: 0.6 }
                ],
                icon: "🛡️"
            },
            {
                id: "darkforge_golem",
                name: "Darkforge Golem",
                level: 50,
                hp: 1350,
                atk: 80,
                def: 42,
                xp: 1200,
                copper: 1800,
                duration: 62,
                drops: [
                    { itemId: "core_leather", rate: 0.5 }
                ],
                icon: "🗿"
            },
            {
                id: "general_ironfist",
                name: "General Ironfist [Boss]",
                level: 52,
                hp: 2800,
                atk: 110,
                def: 50,
                xp: 2200,
                copper: 4500,
                duration: 110,
                drops: [
                    { itemId: "black_iron_essence", rate: 0.6 }
                ],
                icon: "⚔️"
            },
            {
                id: "darkforge",
                name: "Emperor Darkforge [Boss]",
                level: 54,
                hp: 3500,
                atk: 120,
                def: 55,
                xp: 3000,
                copper: 6000,
                duration: 150,
                drops: [
                    { itemId: "darkforge_crown", rate: 0.2 },
                    { itemId: "black_iron_essence", rate: 0.8 }
                ],
                icon: "👑"
            }
        ]
    },
    {
        id: 15,
        name: "Feral Ruin",
        type: "dungeon",
        lvlRange: "50 - 56",
        enemies: [
            {
                id: "feral_lasher",
                name: "Feral Lasher",
                level: 52,
                hp: 1500,
                atk: 82,
                def: 42,
                xp: 1300,
                copper: 2000,
                duration: 65,
                drops: [
                    { itemId: "medium_leather", rate: 0.6 }
                ],
                icon: "🌿"
            },
            {
                id: "ruin_elemental",
                name: "Ruin Elemental",
                level: 53,
                hp: 1600,
                atk: 86,
                def: 44,
                xp: 1400,
                copper: 2200,
                duration: 65,
                drops: [
                    { itemId: "medium_leather", rate: 0.5 }
                ],
                icon: "🌀"
            },
            {
                id: "watersprout",
                name: "Watersprout [Boss]",
                level: 55,
                hp: 3200,
                atk: 125,
                def: 55,
                xp: 2600,
                copper: 5000,
                duration: 120,
                drops: [
                    { itemId: "feral_greaves", rate: 0.5 }
                ],
                icon: "💧"
            },
            {
                id: "thornwood",
                name: "Lord Thornwood [Boss]",
                level: 56,
                hp: 3800,
                atk: 135,
                def: 60,
                xp: 3500,
                copper: 7000,
                duration: 160,
                drops: [
                    { itemId: "thornwood_ring", rate: 0.2 },
                    { itemId: "feral_greaves", rate: 0.2 }
                ],
                icon: "🌳"
            }
        ]
    },
    {
        id: 16,
        name: "The Ashfall Ruins",
        type: "dungeon",
        lvlRange: "54 - 60",
        enemies: [
            {
                id: "ashfall_gargoyle",
                name: "Ashfall Gargoyle",
                level: 56,
                hp: 1800,
                atk: 90,
                def: 48,
                xp: 1600,
                copper: 2500,
                duration: 70,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.6 }
                ],
                icon: "🦇"
            },
            {
                id: "ashfall_ghoul",
                name: "Ashfall Ghoul",
                level: 57,
                hp: 1900,
                atk: 95,
                def: 50,
                xp: 1700,
                copper: 2700,
                duration: 72,
                drops: [
                    { itemId: "woolen_cloth", rate: 0.5 }
                ],
                icon: "🧟"
            },
            {
                id: "deathmaster_morr",
                name: "Deathmaster Morr [Boss]",
                level: 59,
                hp: 4000,
                atk: 150,
                def: 65,
                xp: 3500,
                copper: 6500,
                duration: 140,
                drops: [
                    { itemId: "deathcharger_shield", rate: 0.5 }
                ],
                icon: "🧙‍♂️"
            },
            {
                id: "baron_ashfall",
                name: "Baron Ashfall [Boss]",
                level: 60,
                hp: 4500,
                atk: 160,
                def: 70,
                xp: 4500,
                copper: 9000,
                duration: 180,
                drops: [
                    { itemId: "ashfall_runeblade", rate: 0.2 },
                    { itemId: "deathcharger_shield", rate: 0.2 }
                ],
                icon: "🐎"
            }
        ]
    },
    {
        id: 17,
        name: "Obsidian Caldera [Raid]",
        type: "raid",
        lvlRange: "55 - 60",
        enemies: [
            {
                id: "fire_elemental",
                name: "Fire Elemental",
                level: 58,
                hp: 1300,
                atk: 75,
                def: 25,
                xp: 1500,
                copper: 2500,
                duration: 60,
                drops: [
                    { itemId: "core_leather", rate: 0.6 },
                    { itemId: "essence_of_fire", rate: 0.4 },
                    { itemId: "flame_infused_greaves", rate: 0.05 },
                    { itemId: "fireproof_cloak", rate: 0.05 },
                    { itemId: "flame_infused_ring", rate: 0.05 }
                ],
                icon: "🔥"
            },
            {
                id: "lava_giant",
                name: "Lava Giant",
                level: 58,
                hp: 2200,
                atk: 100,
                def: 40,
                xp: 2000,
                copper: 3000,
                duration: 80,
                drops: [
                    { itemId: "fiery_core", rate: 0.3 }
                ],
                icon: "🪨"
            },
            {
                id: "magmatalon",
                name: "Magmatalon [Boss]",
                level: 60,
                hp: 12000,
                atk: 180,
                def: 70,
                xp: 5000,
                copper: 10000,
                duration: 180,
                drops: [
                    { itemId: "fiery_core", rate: 0.6 }
                ],
                icon: "🦅"
            },
            {
                id: "baron_cinder",
                name: "Baron Cinder [Boss]",
                level: 60,
                hp: 14000,
                atk: 200,
                def: 75,
                xp: 6000,
                copper: 12000,
                duration: 200,
                drops: [
                    { itemId: "molten_cinder", rate: 0.6 }
                ],
                icon: "🔥"
            },
            {
                id: "ignis_firelord",
                name: "Ignis the Firelord [Boss]",
                level: 60,
                hp: 18000,
                atk: 220,
                def: 80,
                xp: 8000,
                copper: 20000,
                duration: 240,
                drops: [
                    { itemId: "fiery_core", rate: 0.8 },
                    { itemId: "firelord_eye", rate: 0.1 },
                    { itemId: "crown_of_destruction", rate: 0.1 },
                    { itemId: "essence_of_pure_flame", rate: 0.1 },
                    { itemId: "choker_of_fire", rate: 0.1 },
                    { itemId: "heart_of_the_firelord", rate: 0.1 },
                    { itemId: "molten_cinder", rate: 0.1 }
                ],
                icon: "🌋"
            }
        ]
    },
    {
        id: 18,
        name: "Darkwing Summit [Raid]",
        type: "raid",
        lvlRange: "58 - 60",
        enemies: [
            {
                id: "summit_dragonkin",
                name: "Summit Dragonkin",
                level: 59,
                hp: 2500,
                atk: 110,
                def: 45,
                xp: 2200,
                copper: 3200,
                duration: 60,
                drops: [
                    { itemId: "core_leather", rate: 0.5 }
                ],
                icon: "🐉"
            },
            {
                id: "fire_drake",
                name: "Fire Drake",
                level: 59,
                hp: 2700,
                atk: 120,
                def: 48,
                xp: 2400,
                copper: 3500,
                duration: 60,
                drops: [
                    { itemId: "core_leather", rate: 0.5 }
                ],
                icon: "🐉"
            },
            {
                id: "greenscale",
                name: "Greenscale the Breeder [Boss]",
                level: 60,
                hp: 15000,
                atk: 210,
                def: 75,
                xp: 6500,
                copper: 13000,
                duration: 190,
                drops: [
                    { itemId: "darkforge_crown", rate: 0.3 }
                ],
                icon: "🐉"
            },
            {
                id: "darkwing",
                name: "Lord Darkwing [Boss]",
                level: 60,
                hp: 22000,
                atk: 260,
                def: 90,
                xp: 10000,
                copper: 25000,
                duration: 240,
                drops: [
                    { itemId: "darkforge_crown", rate: 0.5 }
                ],
                icon: "🐉"
            }
        ]
    },
    {
        id: 19,
        name: "Wyrmqueen's Den [Raid]",
        type: "raid",
        lvlRange: "58 - 60",
        enemies: [
            {
                id: "brood_whelp",
                name: "Brood Whelp",
                level: 59,
                hp: 1200,
                atk: 80,
                def: 30,
                xp: 1000,
                copper: 1500,
                duration: 50,
                drops: [
                    { itemId: "medium_leather", rate: 0.5 }
                ],
                icon: "🐉"
            },
            {
                id: "lair_warden",
                name: "Lair Warden [Elite]",
                level: 60,
                hp: 4000,
                atk: 160,
                def: 60,
                xp: 3500,
                copper: 6000,
                duration: 90,
                drops: [
                    { itemId: "medium_leather", rate: 0.5 }
                ],
                icon: "🐉"
            },
            {
                id: "wyrmqueen",
                name: "Wyrmqueen Onyxia [Boss]",
                level: 60,
                hp: 25000,
                atk: 280,
                def: 100,
                xp: 12000,
                copper: 30000,
                duration: 300,
                drops: [
                    { itemId: "wyrmqueens_crown", rate: 0.5 }
                ],
                icon: "🐉"
            }
        ]
    }
];

const RECIPE_DATABASE = {
    blacksmith: [
        { id: "copper_sword", reqLvl: 1, exp: 15, cost: 30, mats: { copper_ore: 3 } },
        { id: "copper_shield", reqLvl: 2, exp: 25, cost: 40, mats: { copper_ore: 4 } },
        { id: "copper_band", reqLvl: 2, exp: 20, cost: 40, mats: { copper_ore: 3 } },
        { id: "copper_waistband", reqLvl: 2, exp: 25, cost: 50, mats: { copper_ore: 3 } },
        { id: "heavy_copper_boots", reqLvl: 3, exp: 35, cost: 80, mats: { copper_ore: 5 } },
        { id: "heavy_copper_spauldors", reqLvl: 3, exp: 35, cost: 90, mats: { copper_ore: 4 } },
        { id: "iron_broadsword", reqLvl: 4, exp: 50, cost: 150, mats: { iron_ore: 4 } },
        { id: "wastes_barbute", reqLvl: 5, exp: 60, cost: 220, mats: { iron_ore: 3, raptor_claw: 1 } },
        { id: "iron_shield", reqLvl: 5, exp: 65, cost: 250, mats: { iron_ore: 5, golem_core: 1 } },
        { id: "iron_gauntlets", reqLvl: 5, exp: 50, cost: 180, mats: { iron_ore: 4 } },
        { id: "iron_ring_of_crit", reqLvl: 5, exp: 60, cost: 220, mats: { iron_ore: 3, golem_core: 1 } },
        { id: "golem_crusher", reqLvl: 6, exp: 90, cost: 450, mats: { iron_ore: 6, golem_core: 2 } },
        { id: "iron_greaves", reqLvl: 6, exp: 80, cost: 350, mats: { iron_ore: 5, golem_core: 1 } },
        { id: "steel_platebody", reqLvl: 7, exp: 120, cost: 600, mats: { iron_ore: 8, golem_core: 1 } },
        { id: "dark_iron_boots", reqLvl: 8, exp: 180, cost: 900, mats: { core_leather: 2, essence_of_fire: 1 } },
        { id: "pyroclast_hammer", reqLvl: 10, exp: 300, cost: 3000, mats: { fiery_core: 2, essence_of_fire: 3 } },
        { id: "cinderfury_hand", reqLvl: 10, exp: 500, cost: 10000, mats: { pyroclast_hammer: 1, firelord_eye: 1 } }
    ],
    tailor: [
        { id: "linen_robe", reqLvl: 1, exp: 15, cost: 25, mats: { linen_cloth: 3 } },
        { id: "linen_hood", reqLvl: 2, exp: 20, cost: 20, mats: { linen_cloth: 2 } },
        { id: "worn_cape", reqLvl: 2, exp: 15, cost: 35, mats: { linen_cloth: 3 } },
        { id: "linen_belt", reqLvl: 2, exp: 20, cost: 40, mats: { linen_cloth: 2 } },
        { id: "woolen_gloves", reqLvl: 3, exp: 25, cost: 60, mats: { linen_cloth: 4 } },
        { id: "linen_pants", reqLvl: 3, exp: 30, cost: 70, mats: { linen_cloth: 4 } },
        { id: "woolen_robe", reqLvl: 4, exp: 50, cost: 120, mats: { woolen_cloth: 4 } },
        { id: "double_stitched_shoulders", reqLvl: 5, exp: 55, cost: 180, mats: { woolen_cloth: 3 } },
        { id: "arcane_hood", reqLvl: 7, exp: 120, cost: 450, mats: { woolen_cloth: 6, red_outlaw_mask: 1 } },
        { id: "spell_tome", reqLvl: 3, exp: 30, cost: 80, mats: { linen_cloth: 4, spider_venom: 1 } },
        { id: "tome_of_intellect", reqLvl: 6, exp: 80, cost: 350, mats: { woolen_cloth: 4, red_outlaw_mask: 1 } }
    ],
    leatherworker: [
        { id: "worn_leather_vest", reqLvl: 1, exp: 15, cost: 30, mats: { medium_leather: 3 } },
        { id: "raptor_leather_boots", reqLvl: 3, exp: 40, cost: 180, mats: { medium_leather: 4, raptor_claw: 2 } },
        { id: "wastes_gloves", reqLvl: 3, exp: 30, cost: 80, mats: { medium_leather: 3 } },
        { id: "cloak_of_the_wastes", reqLvl: 4, exp: 40, cost: 120, mats: { medium_leather: 3, striped_runner_hoof: 1 } },
        { id: "tough_leather_jerkin", reqLvl: 5, exp: 60, cost: 200, mats: { medium_leather: 6 } },
        { id: "wastes_shoulders", reqLvl: 5, exp: 50, cost: 160, mats: { medium_leather: 4, raptor_claw: 1 } },
        { id: "runner_leather_leggings", reqLvl: 5, exp: 60, cost: 200, mats: { medium_leather: 5, striped_runner_hoof: 2 } },
        { id: "glowing_cat_eye_necklace", reqLvl: 6, exp: 80, cost: 250, mats: { medium_leather: 3, spider_venom: 2 } },
        { id: "core_leather_belt", reqLvl: 8, exp: 150, cost: 800, mats: { core_leather: 3, essence_of_fire: 1 } }
    ],
    alchemist: [
        { id: "minor_healing_potion", reqLvl: 1, exp: 10, cost: 10, mats: { spider_venom: 1 } },
        { id: "lucky_spider_charm", reqLvl: 2, exp: 20, cost: 50, mats: { spider_venom: 2 } },
        { id: "elixir_of_strength", reqLvl: 3, exp: 30, cost: 50, mats: { striped_runner_hoof: 1, spider_venom: 1 } },
        { id: "essence_of_the_golem", reqLvl: 5, exp: 60, cost: 250, mats: { golem_core: 2 } },
        { id: "major_healing_potion", reqLvl: 6, exp: 80, cost: 250, mats: { spider_venom: 3, golem_core: 1 } }
    ]
};

const WASTES_CHAT_MEMES = [
    { user: "Drakthul", text: "where is Maldrik's lost love?? seriously can't find her" },
    { user: "Thex", text: "Did someone say [Stormfury, Blessed Dagger of the Galebraider]?" },
    { user: "Stonetooth", text: "lf1m heals Sighing Caverns have sum/runes" },
    { user: "BuckMorris", text: "Buck Morris once threw a grenade and killed 50 people, then the grenade exploded." },
    { user: "Shadowrunner", text: "anal [Eviscerate] lol" },
    { user: "Leroi", text: "AT LEAST I HAVE FLAPJACKS!" },
    { user: "ElderwoodMayor", text: "WTS [Copper Sword] PST me for premium discount price" },
    { user: "MooCow", text: "Ignis the Firelord is just a big spicy fire elemental pass it on" },
    { user: "Frostwolf", text: "LFG DC pst class and level" },
    { user: "GreenSkin", text: "Your mom is like Pyrothia, takes 40 guys to take her down." },
    { user: "Gorgonna", text: "why is coalition so bad at AR???" },
    { user: "Nighthunter", text: "Maldrik's lost love is actually Ironpaw in a dress." },
    { user: "WastesChatLegend", text: "Buck Morris does not sleep. He waits." },
    { user: "LoktarOgar", text: "FOR THE PACT! Death to coalition scum!" },
    { user: "PalaBoi", text: "shield hearth is a perfectly valid combat tactic ok" }
];

const CUSTOMER_NAMES = [
    "Throm", "Jayna", "Luther", "Zol'jan", "Bairne", "Mogrin", "Sylvanis", "Tyrion", "Bronn", "Garithor", "Hermit Blessingwary"
];

// --- SYSTEMATIC ENEMY BALANCE SCALE ---
function scaleEnemyDatabase() {
    ZONE_DATABASE.forEach(zone => {
        const type = zone.type || "zone";
        let hpMultiplier = 1.5;
        let atkMultiplier = 1.25;

        if (type === "dungeon") {
            hpMultiplier = 2.2;
            atkMultiplier = 1.45;
        } else if (type === "raid") {
            hpMultiplier = 3.5;
            atkMultiplier = 1.85;
        }

        zone.enemies.forEach(enemy => {
            if (enemy.isBalanced) return;

            enemy.hp = Math.round(enemy.hp * hpMultiplier);
            enemy.atk = Math.round(enemy.atk * atkMultiplier);
            enemy.def = Math.round(enemy.def * (type === "zone" ? 1.2 : 1.4));
            enemy.isBalanced = true;
        });
    });
}
scaleEnemyDatabase();

const UNIQUE_BOSS_ITEMS = {
    // --- The Grim Mines (steam_shredder, greentooth) ---
    shredder_steam_core: { name: "Steam Shredder Core", type: "trinket", rarity: 3, price: 300, stats: { hp: 15, atk: 4 }, icon: "⚙️" },
    shredder_plating: { name: "Polished Shredder Plating", type: "chest", rarity: 2, price: 250, stats: { def: 6, hp: 10 }, icon: "🦺" },
    steam_whistle_ring: { name: "High-Pressure Steam Ring", type: "ring", rarity: 2, price: 200, stats: { atk: 3, crit: 2 }, icon: "💍" },
    greentooths_pirate_hat: { name: "Greentooth's Tattered Tricorn", type: "head", rarity: 2, price: 280, stats: { def: 4, atk: 4 }, icon: "🏴‍☠️" },
    greentooths_hook: { name: "Greentooth's Offhand Hook", type: "offhand", rarity: 2, price: 260, stats: { atk: 5, crit: 1 }, icon: "🪝" },
    greentooths_bandana: { name: "Crimson Silk Bandana", type: "neck", rarity: 3, price: 350, stats: { hp: 12, crit: 3 }, icon: "🧣" },

    // --- Shadowstone Keep (grimclaw, stoneglaive) ---
    grimclaw_fang_collar: { name: "Grimclaw Fang Collar", type: "neck", rarity: 2, price: 320, stats: { atk: 5, crit: 2 }, icon: "📿" },
    shadow_padded_gloves: { name: "Shadow-Padded Bracers", type: "hands", rarity: 2, price: 280, stats: { def: 4, hp: 15 }, icon: "🧤" },
    grimclaw_shadowhide_cloak: { name: "Grimclaw Shadowhide Cloak", type: "back", rarity: 3, price: 400, stats: { def: 5, hp: 20 }, icon: "🦹" },
    stoneglaive_staff: { name: "Stoneglaive Spell-Focus Staff", type: "weapon", rarity: 3, price: 450, stats: { atk: 12, hp: 10 }, icon: "🪄" },
    archmages_focus_ring: { name: "Archmage's Focus Ring", type: "ring", rarity: 3, price: 380, stats: { atk: 8, crit: 2 }, icon: "💍" },
    stoneglaive_spaulders: { name: "Stoneglaive Stone-Carved Spaulders", type: "shoulders", rarity: 2, price: 300, stats: { def: 6, hp: 15 }, icon: "🧣" },

    // --- Wailing Fens (shelldon, serpentis) ---
    shelldons_greatshell: { name: "Shelldon's Hardened Greatshell", type: "shield", rarity: 3, price: 480, stats: { def: 10, hp: 30 }, icon: "🛡️" },
    mossy_turtle_legs: { name: "Moss-Covered Shell Leggings", type: "legs", rarity: 2, price: 360, stats: { def: 8, hp: 25 }, icon: "👖" },
    ancient_algae_bracers: { name: "Ancient Algae Wristwraps", type: "hands", rarity: 2, price: 320, stats: { def: 4, hp: 20 }, icon: "🧤" },
    serpentis_boots: { name: "Scales of Lord Serpentis", type: "boots", rarity: 3, price: 420, stats: { def: 7, hp: 15, crit: 2 }, icon: "🥾" },
    poison_bite_ring: { name: "Poison-Bite Ring", type: "ring", rarity: 2, price: 350, stats: { atk: 6, crit: 2 }, icon: "💍" },

    // --- Stockade Asylum (brutetooth, stonefist) ---
    brutetooth_iron_belt: { name: "Brutetooth's Iron-Buckled Belt", type: "waist", rarity: 2, price: 450, stats: { def: 8, hp: 20 }, icon: "🎗️" },
    brutetooths_broken_shackle: { name: "Brutetooth's Broken Shackle", type: "trinket", rarity: 3, price: 600, stats: { atk: 12, hp: 30 }, icon: "⛓️" },
    heavy_prison_chestplate: { name: "Heavy Prison Chestplate", type: "chest", rarity: 3, price: 750, stats: { def: 16, hp: 50 }, icon: "👕" },
    stonefists_gavel: { name: "Warden Stonefist's Gavel", type: "weapon", rarity: 3, price: 780, stats: { atk: 20, def: 5 }, icon: "🔨" },
    wardens_keys_talisman: { name: "Warden's Key Ring", type: "trinket", rarity: 3, price: 650, stats: { def: 10, hp: 35 }, icon: "🗝️" },

    // --- Scarlet Cathedral (beastmaster_karl, suncrest) ---
    karls_beast_whistle: { name: "Karl's Beast-Training Whistle", type: "trinket", rarity: 3, price: 800, stats: { atk: 16, crit: 3 }, icon: "📯" },
    beastmaster_leather_boots: { name: "Beastmaster Leather Boots", type: "boots", rarity: 2, price: 650, stats: { def: 8, atk: 8 }, icon: "🥾" },
    houndmasters_belt: { name: "Houndmaster's Spiked Collar-Belt", type: "waist", rarity: 3, price: 720, stats: { def: 10, atk: 10 }, icon: "🎗️" },
    suncrests_holy_cowl: { name: "High Arbiter's Holy Cowl", type: "head", rarity: 3, price: 950, stats: { atk: 18, def: 6, hp: 30 }, icon: "🦹" },
    crimson_cathedral_cloak: { name: "Crimson Cathedral Cloak", type: "back", rarity: 3, price: 880, stats: { def: 8, hp: 40, crit: 2 }, icon: "🦹" },

    // --- Gnomish Depths (iron_pummel, sparkgear) ---
    pummel_power_core: { name: "Iron Pummel Power Core", type: "trinket", rarity: 3, price: 1100, stats: { hp: 50, atk: 15 }, icon: "🔋" },
    pummel_plated_helm: { name: "Pummel-Plated Iron Helm", type: "head", rarity: 3, price: 1200, stats: { def: 15, hp: 60 }, icon: "🪖" },
    hydraulic_fist_gloves: { name: "Hydraulic Heavy Gauntlets", type: "hands", rarity: 3, price: 1050, stats: { def: 10, atk: 12 }, icon: "🧤" },
    sparkgears_goggles: { name: "Tinkerer's Engineering Goggles", type: "head", rarity: 4, price: 1600, stats: { atk: 22, crit: 5, hp: 30 }, icon: "🥽" },
    sparkgears_overalls: { name: "Sparkgear Heavy-Duty Apron", type: "chest", rarity: 3, price: 1400, stats: { def: 18, hp: 70 }, icon: "🥋" },
    tinkerers_wrench: { name: "Tinkerer's Heavy Wrench", type: "weapon", rarity: 3, price: 1300, stats: { atk: 26, crit: 4 }, icon: "🔧" },

    // --- Troll-Sand Temple (sand_gorgon, sandscalp) ---
    gorgons_chitin_chest: { name: "Gorgon's Hardened Carapace", type: "chest", rarity: 3, price: 1500, stats: { def: 22, hp: 80 }, icon: "🧥" },
    gorgon_eye_necklace: { name: "Gorgon's Petrifying Eye Pendant", type: "neck", rarity: 3, price: 1300, stats: { atk: 18, hp: 40 }, icon: "📿" },
    sand_burrower_boots: { name: "Sand-Burrower Chitin Boots", type: "boots", rarity: 3, price: 1200, stats: { def: 12, hp: 50 }, icon: "🥾" },
    sandscalps_war_mask: { name: "Chief Sandscalp's War Mask", type: "head", rarity: 4, price: 1900, stats: { def: 20, hp: 90, crit: 4 }, icon: "🎭" },
    sandscalps_talisman: { name: "Troll Mojo Talisman", type: "trinket", rarity: 3, price: 1600, stats: { atk: 25, crit: 3 }, icon: "🏺" },
    sandscalps_waistband: { name: "Sandscalp Ritualist Belt", type: "waist", rarity: 3, price: 1450, stats: { def: 10, hp: 60, crit: 3 }, icon: "🎗️" },

    // --- The Drowned Fane (shadowprophet_karr, bloodflame) ---
    prophets_ritual_cowl: { name: "Shadowprophet's Ritual Cowl", type: "head", rarity: 3, price: 1800, stats: { atk: 24, def: 8, hp: 50 }, icon: "🦹" },
    shadowprophets_handwraps: { name: "Shadowprophet's Handwraps", type: "hands", rarity: 3, price: 1600, stats: { atk: 18, hp: 60 }, icon: "🧤" },
    prophets_void_sigil: { name: "Prophet's Void-Infused Sigil", type: "trinket", rarity: 4, price: 2200, stats: { atk: 30, crit: 4 }, icon: "🔮" },
    bloodflame_essence_chest: { name: "Heart of Bloodflame Robes", type: "chest", rarity: 4, price: 2500, stats: { def: 25, hp: 120, atk: 15 }, icon: "🥋" },
    bloodflame_claws: { name: "Bloodflame Brandishing Dagger", type: "weapon", rarity: 3, price: 1900, stats: { atk: 35, crit: 5 }, icon: "🗡️" },
    bloodflame_spaulders: { name: "Bloodflame-Forged Spaulders", type: "shoulders", rarity: 3, price: 1800, stats: { def: 14, hp: 70 }, icon: "🧣" },

    // --- Darkstone Depths (general_ironfist, darkforge) ---
    general_ironfists_chest: { name: "General Ironfist's Heavy Breastplate", type: "chest", rarity: 3, price: 2400, stats: { def: 32, hp: 140 }, icon: "👕" },
    ironfist_gauntlets: { name: "Ironfist Steel-Shod Gauntlets", type: "hands", rarity: 3, price: 2000, stats: { def: 18, hp: 80 }, icon: "🧤" },
    general_war_horn: { name: "General's Ironforge War-Horn", type: "trinket", rarity: 4, price: 2800, stats: { atk: 35, def: 10 }, icon: "📯" },
    darkforge_chestplate: { name: "Emperor Darkforge's Imperial Chestplate", type: "chest", rarity: 4, price: 3500, stats: { def: 40, hp: 180 }, icon: "👕" },
    darkforge_scepter: { name: "Emperor's Lava-Tipped Scepter", type: "weapon", rarity: 4, price: 3200, stats: { atk: 55, hp: 100 }, icon: "🪄" },
    imperial_decree_ring: { name: "Imperial Decree Seal Ring", type: "ring", rarity: 3, price: 2400, stats: { atk: 24, hp: 70, crit: 3 }, icon: "💍" },

    // --- Feral Ruin (watersprout, thornwood) ---
    watersprout_pendant: { name: "Watersprout Flowing Pendant", type: "neck", rarity: 3, price: 2600, stats: { atk: 28, hp: 80 }, icon: "📿" },
    wild_water_cloak: { name: "Wild Flowing Torrent Cloak", type: "back", rarity: 3, price: 2400, stats: { def: 15, hp: 100 }, icon: "🦹" },
    condensed_water_globe: { name: "Condensed Water Globe", type: "trinket", rarity: 4, price: 3200, stats: { hp: 150, def: 10 }, icon: "🔮" },
    thornwood_crown: { name: "Crown of the Briarwood", type: "head", rarity: 4, price: 3600, stats: { def: 25, hp: 150, crit: 4 }, icon: "👑" },
    thornwood_spear: { name: "Thornwood Briar-Slicer", type: "weapon", rarity: 4, price: 3400, stats: { atk: 62, crit: 5 }, icon: "🗡️" },

    // --- The Ashfall Ruins (deathmaster_morr, baron_ashfall) ---
    deathmaster_cowl: { name: "Deathmaster's Necromantic Cowl", type: "head", rarity: 3, price: 3200, stats: { atk: 38, def: 12, hp: 100 }, icon: "🦹" },
    morrs_bone_ring: { name: "Deathmaster's Ring of Bone", type: "ring", rarity: 3, price: 3000, stats: { atk: 28, crit: 4 }, icon: "💍" },
    necromantic_shroud: { name: "Deathmaster's Necromantic Shroud", type: "back", rarity: 4, price: 4200, stats: { def: 20, hp: 150, atk: 12 }, icon: "🦹" },
    ashfall_crown: { name: "Baron Ashfall's Fiery Crown", type: "head", rarity: 4, price: 4500, stats: { def: 30, hp: 180, crit: 5 }, icon: "👑" },
    ashfall_sabatons: { name: "Ashfall Fire-Tempered Sabatons", type: "boots", rarity: 4, price: 3800, stats: { def: 24, hp: 120 }, icon: "🥾" },

    // === RAIDS ===
    // --- Obsidian Caldera [Raid] (magmatalon, baron_cinder, ignis_firelord) ---
    magmatalon_talon: { name: "Magmatalon's Lava Claw", type: "weapon", rarity: 4, price: 8000, stats: { atk: 110, crit: 10 }, icon: "🗡️" },
    magmatalon_girdle: { name: "Magma-Scaled Girdle", type: "waist", rarity: 4, price: 6500, stats: { def: 28, hp: 150, atk: 25 }, icon: "🎗️" },
    fiery_talon_shoulders: { name: "Magmatalon Fire-Singed Shoulders", type: "shoulders", rarity: 4, price: 7000, stats: { def: 26, hp: 160, atk: 20 }, icon: "🧣" },
    magmatalon_eye_talisman: { name: "Talisman of the Magma Eye", type: "trinket", rarity: 4, price: 7500, stats: { atk: 45, hp: 100 }, icon: "🔮" },
    lava_flow_boots: { name: "Lava-Flow Leather Boots", type: "boots", rarity: 4, price: 6200, stats: { def: 22, hp: 120, crit: 6 }, icon: "🥾" },
    molten_magma_ring: { name: "Magma Loop Ring", type: "ring", rarity: 4, price: 5800, stats: { atk: 35, hp: 100, crit: 5 }, icon: "💍" },

    baron_cinder_shield: { name: "Baron Cinder's Molten Aegis", type: "shield", rarity: 4, price: 8500, stats: { def: 48, hp: 300 }, icon: "🛡️" },
    cinder_platebody: { name: "Cinder-Forged Platebody", type: "chest", rarity: 4, price: 9000, stats: { def: 55, hp: 280 }, icon: "👕" },
    baron_fire_ring: { name: "Baron Cinder's Loop of Embers", type: "ring", rarity: 4, price: 6000, stats: { atk: 40, hp: 120, crit: 6 }, icon: "💍" },
    cinder_greatsword: { name: "Cinder-Forged Greatsword", type: "weapon", rarity: 4, price: 9500, stats: { atk: 125, hp: 150 }, icon: "⚔️" },
    embers_flowing_cape: { name: "Flowing Cloak of Embers", type: "back", rarity: 4, price: 6500, stats: { def: 25, hp: 180, atk: 15 }, icon: "🦹" },
    cinder_grip_gloves: { name: "Cinder-Grip Gauntlets", type: "hands", rarity: 4, price: 6200, stats: { def: 24, hp: 130, atk: 20 }, icon: "🧤" },

    ignis_molten_chest: { name: "Ignis's Molten Chestguard", type: "chest", rarity: 4, price: 12000, stats: { def: 60, hp: 320, crit: 5 }, icon: "👕" },
    firelord_lava_spitter: { name: "Lava Spitter Blunderbuss", type: "weapon", rarity: 4, price: 14000, stats: { atk: 140, crit: 12 }, icon: "🔫" },
    ignis_fire_leggings: { name: "Firelord's Core Leggings", type: "legs", rarity: 4, price: 11000, stats: { def: 38, hp: 220, atk: 30 }, icon: "👖" },
    hand_of_ignis: { name: "Cinderfury's Blessed Brand", type: "weapon", rarity: 5, price: 30000, stats: { atk: 180, hp: 250, crit: 20 }, icon: "🌋" },

    // --- Darkwing Summit [Raid] (greenscale, darkwing) ---
    greenscale_emerald_fang: { name: "Emerald Tooth Dagger", type: "weapon", rarity: 4, price: 8200, stats: { atk: 115, crit: 10 }, icon: "🗡️" },
    greenscale_dragonscale_breastplate: { name: "Greenscale Dragonscale Breastplate", type: "chest", rarity: 4, price: 9500, stats: { def: 48, hp: 240, atk: 25 }, icon: "👕" },
    greenscale_boots: { name: "Greenscale Swamp-Walkers", type: "boots", rarity: 4, price: 6400, stats: { def: 26, hp: 140, crit: 6 }, icon: "🥾" },
    emerald_dream_ring: { name: "Ring of the Emerald Dream", type: "ring", rarity: 4, price: 6800, stats: { atk: 38, hp: 120, def: 10 }, icon: "💍" },
    greenscale_acid_spaulders: { name: "Greenscale Acid-Proof Spaulders", type: "shoulders", rarity: 4, price: 7200, stats: { def: 28, hp: 150 }, icon: "🧣" },
    acidic_talisman: { name: "Acid-Drenched Drake Eye", type: "trinket", rarity: 4, price: 7600, stats: { atk: 48, crit: 6 }, icon: "🔮" },

    darkwing_greatstaff: { name: "Lord Darkwing's Ebony Scepter", type: "weapon", rarity: 4, price: 10500, stats: { atk: 130, hp: 180 }, icon: "🪄" },
    darkwing_shadow_cape: { name: "Lord Darkwing's Shroud of Shadow", type: "back", rarity: 4, price: 7000, stats: { def: 28, hp: 200, crit: 5 }, icon: "🦹" },
    darkwing_darkscale_leggings: { name: "Darkwing Darkscale Leggings", type: "legs", rarity: 4, price: 9800, stats: { def: 42, hp: 220, atk: 28 }, icon: "👖" },
    shadow_claw_ring: { name: "Shadow Claw Loop Ring", type: "ring", rarity: 4, price: 6900, stats: { atk: 42, crit: 8 }, icon: "💍" },
    darkwing_claws: { name: "Darkwing Black-Drake Talons", type: "weapon", rarity: 4, price: 8800, stats: { atk: 120, crit: 11 }, icon: "⚔️" },
    darkwing_shadow_gloves: { name: "Lord Darkwing's Shadow-Grip Gauntlets", type: "hands", rarity: 4, price: 6800, stats: { def: 25, hp: 140, atk: 22 }, icon: "🧤" },

    // --- Wyrmqueen's Den [Raid] (wyrmqueen) ---
    wyrmqueen_draconic_shield: { name: "Aegis of the Wyrmqueen", type: "shield", rarity: 4, price: 15000, stats: { def: 60, hp: 400 }, icon: "🛡️" },
    wyrmqueen_breath_pendant: { name: "Wyrmqueen's Breath Pendant", type: "neck", rarity: 4, price: 12000, stats: { atk: 50, crit: 10 }, icon: "📿" },
    wyrmqueen_shadowflame_cape: { name: "Shadowflame Scale Cloak", type: "back", rarity: 4, price: 11000, stats: { def: 35, hp: 250, atk: 20 }, icon: "🦹" },
    wyrmqueen_ring: { name: "Band of the Wyrmqueen", type: "ring", rarity: 4, price: 10000, stats: { atk: 48, hp: 150, crit: 8 }, icon: "💍" },
    wyrmqueen_flame_brand: { name: "Wyrmqueen's Flame-Brand Greatsword", type: "weapon", rarity: 4, price: 18000, stats: { atk: 155, hp: 200, crit: 12 }, icon: "⚔️" },
    wyrmqueens_blessed_sigil: { name: "Onyx Eye of the Wyrmqueen", type: "trinket", rarity: 5, price: 35000, stats: { atk: 75, def: 25, crit: 15 }, icon: "🔮" },
    wyrmqueen_girdle: { name: "Wyrmscale Heavy Girdle", type: "waist", rarity: 4, price: 9500, stats: { def: 35, hp: 200, atk: 30 }, icon: "🎗️" }
};

const BOSS_DROP_MAPPINGS = {
    steam_shredder: ["shredder_steam_core", "shredder_plating", "steam_whistle_ring"],
    greentooth: ["greentooths_pirate_hat", "greentooths_hook", "greentooths_bandana"],
    grimclaw: ["grimclaw_fang_collar", "shadow_padded_gloves", "grimclaw_shadowhide_cloak"],
    stoneglaive: ["stoneglaive_staff", "archmages_focus_ring", "stoneglaive_spaulders"],
    shelldon: ["shelldons_greatshell", "mossy_turtle_legs", "ancient_algae_bracers"],
    serpentis: ["serpentis_boots", "poison_bite_ring"],
    brutetooth: ["brutetooth_iron_belt", "brutetooths_broken_shackle", "heavy_prison_chestplate"],
    stonefist: ["stonefists_gavel", "wardens_keys_talisman"],
    beastmaster_karl: ["karls_beast_whistle", "beastmaster_leather_boots", "houndmasters_belt"],
    suncrest: ["suncrests_holy_cowl", "crimson_cathedral_cloak"],
    iron_pummel: ["pummel_power_core", "pummel_plated_helm", "hydraulic_fist_gloves"],
    sparkgear: ["sparkgears_goggles", "sparkgears_overalls", "tinkerers_wrench"],
    sand_gorgon: ["gorgons_chitin_chest", "gorgon_eye_necklace", "sand_burrower_boots"],
    sandscalp: ["sandscalps_war_mask", "sandscalps_talisman", "sandscalps_waistband"],
    shadowprophet_karr: ["prophets_ritual_cowl", "shadowprophets_handwraps", "prophets_void_sigil"],
    bloodflame: ["bloodflame_essence_chest", "bloodflame_claws", "bloodflame_spaulders"],
    general_ironfist: ["general_ironfists_chest", "ironfist_gauntlets", "general_war_horn"],
    darkforge: ["darkforge_chestplate", "darkforge_scepter", "imperial_decree_ring"],
    watersprout: ["watersprout_pendant", "wild_water_cloak", "condensed_water_globe"],
    thornwood: ["thornwood_crown", "thornwood_spear"],
    deathmaster_morr: ["deathmaster_cowl", "morrs_bone_ring", "necromantic_shroud"],
    baron_ashfall: ["ashfall_crown", "ashfall_sabatons"],

    // Raids
    magmatalon: ["magmatalon_talon", "magmatalon_girdle", "fiery_talon_shoulders", "magmatalon_eye_talisman", "lava_flow_boots", "molten_magma_ring"],
    baron_cinder: ["baron_cinder_shield", "cinder_platebody", "baron_fire_ring", "cinder_greatsword", "embers_flowing_cape", "cinder_grip_gloves"],
    ignis_firelord: ["ignis_molten_chest", "firelord_lava_spitter", "ignis_fire_leggings", "hand_of_ignis"],
    greenscale: ["greenscale_emerald_fang", "greenscale_dragonscale_breastplate", "greenscale_boots", "emerald_dream_ring", "greenscale_acid_spaulders", "acidic_talisman"],
    darkwing: ["darkwing_greatstaff", "darkwing_shadow_cape", "darkwing_darkscale_leggings", "shadow_claw_ring", "darkwing_claws", "darkwing_shadow_gloves"],
    wyrmqueen: ["wyrmqueen_draconic_shield", "wyrmqueen_breath_pendant", "wyrmqueen_shadowflame_cape", "wyrmqueen_ring", "wyrmqueen_flame_brand", "wyrmqueens_blessed_sigil", "wyrmqueen_girdle"]
};

function injectUniqueBossDrops() {
    // 1. Inject all items into ITEM_DATABASE
    for (const [itemId, itemData] of Object.entries(UNIQUE_BOSS_ITEMS)) {
        ITEM_DATABASE[itemId] = itemData;
    }

    // 2. Map items to their respective boss drop arrays in ZONE_DATABASE
    for (const [bossId, dropItems] of Object.entries(BOSS_DROP_MAPPINGS)) {
        let foundBoss = null;
        let isRaid = false;

        for (const zone of ZONE_DATABASE) {
            const match = zone.enemies.find(enemy => enemy.id === bossId);
            if (match) {
                foundBoss = match;
                isRaid = (zone.type === "raid");
                break;
            }
        }

        if (foundBoss) {
            const dropRate = isRaid ? 0.10 : 0.15;
            dropItems.forEach(itemId => {
                if (!foundBoss.drops) {
                    foundBoss.drops = [];
                }
                foundBoss.drops.push({ itemId, rate: dropRate });
            });
        }
    }
}
injectUniqueBossDrops();


// --- INITIAL STATE ---

let gameState = {
    gold: 500, // Stored in Copper. Starts with 5 Silver (500 Copper)
    inventory: {}, // Dictionary of itemId -> quantity
    heroes: [],
    crafters: {
        blacksmith: { lvl: 1, xp: 0, max_xp: 100 },
        tailor: { lvl: 1, xp: 0, max_xp: 100 },
        leatherworker: { lvl: 1, xp: 0, max_xp: 100 },
        alchemist: { lvl: 1, xp: 0, max_xp: 100 }
    },
    activeQuests: [],
    customers: [],
    lastDispatch: null,
    settings: {
        maxHeroes: 40,
        maxBagSlots: 30
    },
    defeatedEnemies: [],
    enemyStats: {}
};

// UI Tab Navigation
let currentTab = "heroes";
let currentProfession = "blacksmith";
let currentZoneIndex = 0;

// Dynamic selection placeholders for modals
let selectedEquipSlot = null; // { heroId, slot }
let selectedDispatchQuest = null; // { zoneId, enemyId }
let selectedInventorySlot = null; // itemId

// --- GAME LIFECYCLE ---

function initGame() {
    loadGame();
    
    // If no heroes are owned, give a starting Warrior for free
    if (gameState.heroes.length === 0) {
        gameState.heroes.push(createHero("Hrothgar", "Warrior"));
    }
    
    // Standard initialization renders
    renderCurrency();
    renderHeaderStats();
    switchTab(currentTab);
    renderZoneSelector();
    renderEnemyList();
    switchProfession(currentProfession);
    renderInventory();
    renderCustomers();
    renderRepeatButton(); // Seed repeat button on startup
    
    // Core game loop intervals
    setInterval(gameTick, 1000);
    setInterval(customerGeneratorTick, 25000);
    setInterval(wastesChatTick, 14000);
    setInterval(saveGame, 10000);

    // Seed initial customers if none exist
    if (gameState.customers.length === 0) {
        generateCustomerOffer();
        generateCustomerOffer();
    }
}

// Master tick (runs once per second)
function gameTick() {
    updateQuests();
    renderActiveQuestsSidebar();
    renderRepeatButton();
}

// Save & Load
function saveGame() {
    localStorage.setItem("wow_warcrest_save", JSON.stringify(gameState));
}

const ITEM_ID_MIGRATIONS = {
    // Hogger items
    "hogger_claw": "ironpaw_claw",
    "hoggers_champion_shield": "ironpaws_champion_shield",
    "hoggers_slicer": "ironpaws_slicer",
    // Defias items
    "red_defias_mask": "red_outlaw_mask",
    "pillager_staff": "outlaw_staff",
    "defias_orb": "outlaw_orb",
    // Barrens items
    "barrens_barbute": "wastes_barbute",
    "barrens_shoulders": "wastes_shoulders",
    "barrens_gloves": "wastes_gloves",
    "cloak_of_the_barrens": "cloak_of_the_wastes",
    // Zevra items
    "zevra_hoof": "striped_runner_hoof",
    "swift_zevra_boots": "swift_runner_boots",
    "zevra_leather_leggings": "runner_leather_leggings",
    // Molten Core / Ragnaros items
    "sulfuras_hand": "cinderfury_hand",
    "sulfuras_eye": "firelord_eye",
    "sulfuron_hammer": "pyroclast_hammer",
    "heart_of_ragnaros": "heart_of_the_firelord",
};

function loadGame() {
    const saved = localStorage.getItem("wow_warcrest_save");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Deep merge states to safeguard modifications
            Object.assign(gameState, parsed);
            
            // Migrate old item keys in inventory
            if (parsed.inventory) {
                const migratedInv = {};
                for (let oldId in parsed.inventory) {
                    const newId = ITEM_ID_MIGRATIONS[oldId] || oldId;
                    migratedInv[newId] = (migratedInv[newId] || 0) + parsed.inventory[oldId];
                }
                gameState.inventory = migratedInv;
            }

            // Ensure child states are safe and migrate old hero equipment
            if (parsed.heroes) {
                gameState.heroes = parsed.heroes;
                gameState.heroes.forEach(h => {
                    if (!h.skills || !Array.isArray(h.skills)) {
                        h.skills = [null, null, null, null, null];
                    }
                    if (!h.equipment) {
                        h.equipment = {};
                    }
                    const slots = ["head", "neck", "shoulders", "back", "chest", "hands", "waist", "legs", "boots", "ring", "trinket", "weapon", "secondary"];
                    slots.forEach(slot => {
                        if (h.equipment[slot] === undefined) {
                            h.equipment[slot] = null;
                        } else if (h.equipment[slot] && ITEM_ID_MIGRATIONS[h.equipment[slot]]) {
                            h.equipment[slot] = ITEM_ID_MIGRATIONS[h.equipment[slot]];
                        }
                    });
                });
            }
            if (parsed.crafters) gameState.crafters = parsed.crafters;
            if (parsed.activeQuests) gameState.activeQuests = parsed.activeQuests;
            
            // Migrate customers' requested items and names
            if (parsed.customers) {
                gameState.customers = parsed.customers;
                gameState.customers.forEach(c => {
                    if (ITEM_ID_MIGRATIONS[c.requestedItemId]) {
                        c.requestedItemId = ITEM_ID_MIGRATIONS[c.requestedItemId];
                    }
                    const nameMap = {
                        "Thrall": "Throm",
                        "Jaina": "Jayna",
                        "Uther": "Luther",
                        "Vol'jin": "Zol'jan",
                        "Cairne": "Bairne",
                        "Mograine": "Mogrin",
                        "Sylvanas": "Sylvanis",
                        "Tirion": "Tyrion",
                        "Brann": "Bronn",
                        "Garithos": "Garithor",
                        "Hemet Nessingwary": "Hermit Blessingwary"
                    };
                    if (nameMap[c.name]) {
                        c.name = nameMap[c.name];
                    }
                });
            }
            if (parsed.lastDispatch) gameState.lastDispatch = parsed.lastDispatch;
            gameState.defeatedEnemies = parsed.defeatedEnemies || [];
            gameState.enemyStats = parsed.enemyStats || {};
        } catch (e) {
            console.error("Save load corrupt. Initializing clean state.", e);
        }
    }
}

function resetGame() {
    if (confirm("Are you sure you want to delete your progress and start your WoW guild fresh?")) {
        localStorage.removeItem("wow_warcrest_save");
        location.reload();
    }
}

// --- STATE GETTERS & MODIFIERS ---

function createHero(name, heroClass) {
    const db = CLASS_DATABASE[heroClass];
    return {
        id: "hero_" + Date.now() + Math.random().toString(36).substr(2, 4),
        name: name,
        class: heroClass,
        level: 1,
        xp: 0,
        max_xp: 100,
        hp: db.baseHp,
        max_hp: db.baseHp,
        atk: db.baseAtk,
        def: db.baseDef,
        crit: db.baseCrit,
        equipment: {
            head: null,
            neck: null,
            shoulders: null,
            back: null,
            chest: null,
            hands: null,
            waist: null,
            legs: null,
            boots: null,
            ring: null,
            trinket: null,
            weapon: null,
            secondary: null
        },
        status: "Idle", // Idle, Questing, Dead
        activeQuestId: null,
        skills: [null, null, null, null, null]
    };
}

// Calculate a hero's current maximum Action Points (AP)
function getHeroMaxAp(hero) {
    let ap = 5 + Math.floor(hero.level / 5); // +1 AP every 5 levels (e.g. Lvl 5=6, Lvl 10=7... Lvl 60=17)
    for (let slot in hero.equipment) {
        const itemId = hero.equipment[slot];
        if (itemId && ITEM_DATABASE[itemId]) {
            const item = ITEM_DATABASE[itemId];
            if (item.stats && item.stats.ap) {
                ap += item.stats.ap;
            }
        }
    }
    return ap;
}

// Re-calculate full stats including equipment
function getHeroFullStats(hero) {
    const db = CLASS_DATABASE[hero.class];
    // Base stats using growth formula
    const levelModifier = hero.level - 1;
    let hp = db.baseHp + (db.statGrowth.hp * levelModifier);
    let atk = db.baseAtk + (db.statGrowth.atk * levelModifier);
    let def = db.baseDef + (db.statGrowth.def * levelModifier);
    let crit = db.baseCrit + (db.statGrowth.crit * levelModifier);

    // Apply items
    for (let slot in hero.equipment) {
        const itemId = hero.equipment[slot];
        if (itemId && ITEM_DATABASE[itemId]) {
            const item = ITEM_DATABASE[itemId];
            if (item.stats) {
                if (item.stats.hp) hp += item.stats.hp;
                if (item.stats.atk) atk += item.stats.atk;
                if (item.stats.def) def += item.stats.def;
                if (item.stats.crit) crit += item.stats.crit;
            }
        }
    }

    return {
        hp: Math.round(hp),
        atk: Math.round(atk),
        def: Math.round(def),
        crit: Math.round(crit)
    };
}

function getInventoryFilledSlots() {
    let slots = 0;
    for (let id in gameState.inventory) {
        if (gameState.inventory[id] > 0) slots++;
    }
    return slots;
}

function addGold(copperAmount) {
    gameState.gold += copperAmount;
    if (gameState.gold < 0) gameState.gold = 0;
    renderCurrency();
}

function addInventory(itemId, quantity) {
    const filled = getInventoryFilledSlots();
    if (filled >= gameState.settings.maxBagSlots && (!gameState.inventory[itemId] || gameState.inventory[itemId] === 0)) {
        pushBarrensChat("System", `Bags are full! You lost [${ITEM_DATABASE[itemId].name}]. Sell or clear space.`);
        return false;
    }
    
    if (!gameState.inventory[itemId]) {
        gameState.inventory[itemId] = 0;
    }
    gameState.inventory[itemId] += quantity;
    if (gameState.inventory[itemId] <= 0) {
        delete gameState.inventory[itemId];
    }
    renderInventory();
    renderHeaderStats();
    return true;
}

// --- QUEST & COMBAT LOGIC ---

function startQuest(heroIds, enemyId, zoneId) {
    if (!Array.isArray(heroIds)) {
        heroIds = [heroIds];
    }
    
    const zone = ZONE_DATABASE.find(z => z.id === zoneId);
    if (!zone) return;
    const enemy = zone.enemies.find(e => e.id === enemyId);
    if (!enemy || heroIds.length === 0) return;

    // Verify enemy is unlocked if dungeon or raid
    const isDungeonOrRaid = zone.type === "dungeon" || zone.type === "raid";
    if (isDungeonOrRaid) {
        const enemyIndex = zone.enemies.findIndex(e => e.id === enemyId);
        if (enemyIndex > 0) {
            const prevEnemy = zone.enemies[enemyIndex - 1];
            const isPrevDefeated = gameState.defeatedEnemies && gameState.defeatedEnemies.includes(prevEnemy.id);
            if (!isPrevDefeated) {
                console.error(`Attempted to dispatch locked enemy ${enemyId}. Previous enemy ${prevEnemy.id} is not defeated.`);
                return;
            }
        }
    }

    // Validate group size constraints
    const type = zone.type || "zone";
    let min = 1, max = 5;
    if (type === "dungeon") { min = 3; max = 5; }
    else if (type === "raid") { min = 10; max = 20; }

    if (heroIds.length < min || heroIds.length > max) {
        console.error(`Group size invalid. Selected: ${heroIds.length}, Required: ${min}-${max}`);
        return;
    }

    const questId = "quest_" + Date.now() + Math.random().toString(36).substr(2, 4);

    // Pre-simulate combat to determine variable duration and store deterministic replay package
    const tempQuestObj = {
        id: questId,
        heroIds: heroIds,
        enemyId: enemyId,
        zoneId: zoneId
    };
    const replay = resolveCombat(tempQuestObj);
    const turnsCount = (replay && typeof replay.turns === "number") ? replay.turns : 5;

    // Formula: 2 seconds per turn + 5 seconds base padding (bounded in [5, 300] seconds)
    const variableDuration = Math.max(5, Math.min(300, 5 + (turnsCount * 2)));

    heroIds.forEach(id => {
        const hero = gameState.heroes.find(h => h.id === id);
        if (hero) {
            hero.status = "Questing";
            hero.activeQuestId = questId;
        }
    });

    gameState.activeQuests.push({
        id: questId,
        heroIds: heroIds,
        enemyId: enemyId,
        zoneId: zoneId,
        durationTotal: variableDuration,
        durationRemaining: variableDuration,
        replay: replay // Save pre-simulated replay
    });

    // Save the configuration for group repeat
    gameState.lastDispatch = {
        heroIds: heroIds,
        enemyId: enemyId,
        zoneId: zoneId
    };

    renderHeroes();
    renderActiveQuestsSidebar();
    renderRepeatButton(); // Refresh button display state
    closeModal("modal-select-hero-dispatch");
}

function updateQuests() {
    let changed = false;
    for (let i = gameState.activeQuests.length - 1; i >= 0; i--) {
        const q = gameState.activeQuests[i];
        if (q.isCompleted) continue; // Keep completed quests in activeQuests until clicked!

        q.durationRemaining -= 1;
        
        if (q.durationRemaining <= 0) {
            q.isCompleted = true;
            q.durationRemaining = 0;
            changed = true;
            const zone = ZONE_DATABASE.find(z => z.id === q.zoneId);
            pushBarrensChat("Guild Coordinator", `Group has finished adventure in ${zone.name}! Open chest in sidebar.`);
        }
    }
    if (changed) {
        saveGame();
        renderActiveQuestsSidebar();
    }
}

// Turn-based simulated battles with advanced Merchant-RPG turn mechanics
// Returns a detailed Replay Package for visual playback
function resolveCombat(quest) {
    const heroIds = quest.heroIds || (quest.heroId ? [quest.heroId] : []);
    if (heroIds.length === 0) return null;

    const zone = ZONE_DATABASE.find(z => z.id === quest.zoneId);
    const enemy = zone.enemies.find(e => e.id === quest.enemyId);
    if (!enemy) return null;

    // Load participating heroes and initialize combat state trackers
    let activeHeroes = [];
    heroIds.forEach(id => {
        const h = gameState.heroes.find(hero => hero.id === id);
        if (h) {
            const stats = getHeroFullStats(h);
            activeHeroes.push({
                obj: h,
                stats: stats,
                currentHp: stats.hp,
                isDead: h.status === "Dead",
                buffs: {
                    atk: 0,            // flat modifier (e.g. Amplify Magic: +45% which is 0.45)
                    crit: 0,           // extra crit rate (flat)
                    def_mult: 1.0,     // defense multiplier (flat)
                    evasion: 0,        // chance to dodge (0.0 - 1.0)
                    renew: 0,          // heal over time value
                    renew_duration: 0,
                    shield: 0,         // absorb shield HP
                    shield_duration: 0,
                    kings: false,      // kings buff (+15% all stats)
                    kings_duration: 0,
                    taunt: 0           // forced target
                },
                dot: 0,                // damage over time value
                dot_duration: 0,
                feint: 0,              // feint threat modifier duration
                layOnHandsUsed: false,
                stunned: false
            });
        }
    });

    if (activeHeroes.length === 0) return null;

    let enemyHp = enemy.hp;
    const enemyMaxHp = enemy.hp;
    
    let enemyBuffs = {
        atk: 1.0,
        atk_duration: 0,
        def: 1.0,
        def_duration: 0,
        evade: 0.0,
        evade_duration: 0
    };
    
    let enemyDebuffs = {
        sunder: 0,          // 30% armor reduction
        expose: 0,          // 45% armor reduction
        atk_debuff: 0,      // 25% atk reduction
        consecration: 0,    // dot
        consecration_duration: 0
    };
    
    let enemyStunned = false;

    let replayEvents = [];
    let turn = 1;
    const maxTurns = 200; // Merchant RPG battle turn limit

    const groupNames = activeHeroes.map(h => `${h.obj.name} (${h.obj.class})`).join(", ");
    
    // Initial starting log
    replayEvents.push({
        type: 'log',
        text: `⚔️ Group [${groupNames}] confronts ${enemy.name} in ${zone.name}!`,
        enemyHp: enemyHp,
        heroHps: getHeroHpsMap(activeHeroes),
        heroShields: getHeroShieldsMap(activeHeroes)
    });

    // Helper function to log turn events
    function logEvent(text, dmgTarget = null, healTarget = null) {
        replayEvents.push({
            type: 'log',
            text: text,
            enemyHp: Math.max(0, enemyHp),
            heroHps: getHeroHpsMap(activeHeroes),
            heroShields: getHeroShieldsMap(activeHeroes),
            activeDmgTarget: dmgTarget,
            activeHealTarget: healTarget
        });
    }

    while (enemyHp > 0 && activeHeroes.some(h => h.currentHp > 0) && turn <= maxTurns) {
        
        // --- 1. HEROES PHASE: Each living hero performs their assigned skill slot action ---
        activeHeroes.forEach(h => {
            if (h.currentHp <= 0) return; // Fallen heroes cannot act

            if (h.stunned) {
                h.stunned = false;
                logEvent(`Turn ${turn}: ${h.obj.name} is stunned and skips their turn!`, h.obj.id);
                return;
            }

            // Find slot skill
            const skillIndex = (turn - 1) % 5;
            const skillId = h.obj.skills[skillIndex];
            const classDb = SKILL_DATABASE[h.obj.class] || [];
            let skill = BASIC_ATTACK_SKILL;
            if (skillId) {
                skill = classDb.find(s => s.id === skillId) || BASIC_ATTACK_SKILL;
            }

            // Calculate active buff multipliers
            const kingsMult = h.buffs.kings ? 1.15 : 1.0;
            const finalAtk = h.stats.atk * (1 + h.buffs.atk) * kingsMult;
            const finalDef = h.stats.def * h.buffs.def_mult * kingsMult;

            // Execute Skill logic
            if (skill.id === "basic_attack" || skill.id === "heroic_strike" || skill.id === "sunder_armor" || skill.id === "shield_slam" ||
                skill.id === "fireball" || skill.id === "frostbolt" || skill.id === "pyroblast" ||
                skill.id === "sinister_strike" || skill.id === "expose_armor" || skill.id === "eviscerate" ||
                skill.id === "mind_blast" || skill.id === "judgement_of_light" || skill.id === "consecration") {
                
                // Damage Dealing Skill
                let mult = 1.0;
                let addCritChance = 0;
                
                if (skill.id === "heroic_strike") mult = 1.5;
                else if (skill.id === "sunder_armor") mult = 1.1;
                else if (skill.id === "shield_slam") {
                    // Deal damage based on finalDef
                    const rawDefDmg = finalDef * 1.8;
                    // Shield slam uses armor as fuel
                    let damage = rawDefDmg - (enemy.def * enemyBuffs.def);
                    if (enemyDebuffs.expose > 0) damage = rawDefDmg - (enemy.def * enemyBuffs.def * 0.55);
                    else if (enemyDebuffs.sunder > 0) damage = rawDefDmg - (enemy.def * enemyBuffs.def * 0.70);
                    if (damage < 1) damage = 1;
                    
                    let isCrit = Math.random() * 100 < (h.stats.crit + h.buffs.crit);
                    if (isCrit) damage = Math.round(damage * 1.8);
                    else damage = Math.round(damage);

                    enemyHp -= damage;
                    logEvent(`Turn ${turn}: ${h.obj.name} slams with their shield, dealing ${damage} damage to ${enemy.name}!`, "enemy");
                    
                    // Gain defense block
                    h.buffs.def_mult = Math.max(h.buffs.def_mult, 1.25);
                    h.buffs.def_duration = Math.max(h.buffs.def_duration, 2);
                    return;
                }
                else if (skill.id === "fireball") mult = 1.8;
                else if (skill.id === "frostbolt") mult = 1.2;
                else if (skill.id === "pyroblast") mult = 2.8;
                else if (skill.id === "sinister_strike") mult = 1.4;
                else if (skill.id === "expose_armor") mult = 1.0;
                else if (skill.id === "eviscerate") {
                    mult = 2.0;
                    addCritChance = 30; // Rogue crit scaling!
                }
                else if (skill.id === "mind_blast") mult = 1.5;
                else if (skill.id === "judgement_of_light") mult = 1.1;
                else if (skill.id === "consecration") mult = 0.0; // Consecration is dot only

                // Calculate Net Damage
                let enemyCurrentDef = enemy.def * enemyBuffs.def;
                if (enemyDebuffs.expose > 0) enemyCurrentDef *= 0.55;
                else if (enemyDebuffs.sunder > 0) enemyCurrentDef *= 0.70;

                let isCrit = Math.random() * 100 < (h.stats.crit + h.buffs.crit + addCritChance);
                
                // Roll enemy evade
                if (mult > 0 && Math.random() < enemyBuffs.evade) {
                    logEvent(`Turn ${turn}: ${h.obj.name} casts ${skill.name}, but ${enemy.name} DODGES!`);
                } else {
                    let dmg = finalAtk * mult - enemyCurrentDef;
                    if (dmg < 1) dmg = 1;
                    if (isCrit) dmg = Math.round(dmg * 1.8);
                    else dmg = Math.round(dmg);

                    if (mult > 0) {
                        enemyHp -= dmg;
                        if (isCrit) {
                            logEvent(`Turn ${turn}: ${h.obj.name} lands a CRITICAL ${skill.name}! Deals ${dmg} damage to ${enemy.name}.`, "enemy");
                        } else {
                            logEvent(`Turn ${turn}: ${h.obj.name} casts ${skill.name}, dealing ${dmg} damage.`, "enemy");
                        }
                    }

                    // Secondary skill effects
                    if (skill.id === "sunder_armor") {
                        enemyDebuffs.sunder = 3;
                        logEvent(`Turn ${turn}: ${enemy.name} is afflicted with Sunder Armor! (-30% Defense for 3 turns).`);
                    } else if (skill.id === "expose_armor") {
                        enemyDebuffs.expose = 2;
                        logEvent(`Turn ${turn}: ${enemy.name} is afflicted with Expose Armor! (-45% Defense for 2 turns).`);
                    } else if (skill.id === "frostbolt") {
                        enemyDebuffs.atk_debuff = 2;
                        logEvent(`Turn ${turn}: ${enemy.name} is chilled by Frostbolt! (-25% Attack for 2 turns).`);
                    } else if (skill.id === "judgement_of_light") {
                        const lowAlly = getLowestHpAlly(activeHeroes);
                        if (lowAlly) {
                            const heal = Math.round(finalAtk * 0.5);
                            lowAlly.currentHp = Math.min(lowAlly.stats.hp, lowAlly.currentHp + heal);
                            logEvent(`Turn ${turn}: Judgement of Light restores +${heal} HP to ${lowAlly.obj.name}.`, null, lowAlly.obj.id);
                        }
                    } else if (skill.id === "consecration") {
                        enemyDebuffs.consecration = Math.round(finalAtk * 0.5);
                        enemyDebuffs.consecration_duration = 3;
                        logEvent(`Turn ${turn}: ${h.obj.name} consecrates the ground, dealing holy fire DOT to ${enemy.name} for 3 turns.`);
                    }
                }
            } 
            else if (skill.id === "shield_block") {
                h.buffs.def_mult = Math.max(h.buffs.def_mult, 1.6);
                h.buffs.def_duration = Math.max(h.buffs.def_duration, 2);
                logEvent(`Turn ${turn}: ${h.obj.name} triggers Shield Block! (+60% Defense for 2 turns).`, null, h.obj.id);
            }
            else if (skill.id === "taunt") {
                h.buffs.taunt = 1;
                logEvent(`Turn ${turn}: ${h.obj.name} taunts ${enemy.name}, drawing all threat weight!`, null, h.obj.id);
            }
            else if (skill.id === "amplify_magic") {
                h.buffs.atk = 0.45;
                h.buffs.atk_duration = 3;
                logEvent(`Turn ${turn}: ${h.obj.name} casts Amplify Magic! (+45% Spell Damage for 3 turns).`, null, h.obj.id);
            }
            else if (skill.id === "blink") {
                h.buffs.evasion = 0.3;
                h.buffs.evasion_duration = 2;
                logEvent(`Turn ${turn}: ${h.obj.name} blinks away! (+30% Evasion for 2 turns).`, null, h.obj.id);
            }
            else if (skill.id === "feint") {
                h.feint = 3;
                logEvent(`Turn ${turn}: ${h.obj.name} uses Feint to drop all aggression.`);
            }
            else if (skill.id === "adrenaline_rush") {
                h.buffs.atk = 0.3;
                h.buffs.crit = 25;
                h.buffs.atk_duration = 3;
                logEvent(`Turn ${turn}: ${h.obj.name} triggers Adrenaline Rush! (+30% Attack, +25% Crit chance for 3 turns).`, null, h.obj.id);
            }
            else if (skill.id === "flash_heal") {
                const lowAlly = getLowestHpAlly(activeHeroes);
                if (lowAlly) {
                    const heal = Math.round(finalAtk * 1.8);
                    lowAlly.currentHp = Math.min(lowAlly.stats.hp, lowAlly.currentHp + heal);
                    logEvent(`Turn ${turn}: ${h.obj.name} casts Flash Heal on ${lowAlly.obj.name}, restoring +${heal} HP.`, null, lowAlly.obj.id);
                }
            }
            else if (skill.id === "renew") {
                const lowAlly = getLowestHpAlly(activeHeroes);
                if (lowAlly) {
                    lowAlly.buffs.renew = Math.round(finalAtk * 0.6);
                    lowAlly.buffs.renew_duration = 3;
                    logEvent(`Turn ${turn}: ${h.obj.name} applies Renew on ${lowAlly.obj.name} (healing +${lowAlly.buffs.renew} HP/turn for 3 turns).`, null, lowAlly.obj.id);
                }
            }
            else if (skill.id === "power_word_shield") {
                const lowAlly = getLowestHpAlly(activeHeroes);
                if (lowAlly) {
                    lowAlly.buffs.shield = Math.round(finalAtk * 2.0);
                    lowAlly.buffs.shield_duration = 2;
                    logEvent(`Turn ${turn}: ${h.obj.name} wraps ${lowAlly.obj.name} in Power Word: Shield! Absorbs up to ${lowAlly.buffs.shield} damage for 2 turns.`, null, lowAlly.obj.id);
                }
            }
            else if (skill.id === "prayer_of_healing") {
                const heal = Math.round(finalAtk * 1.0);
                activeHeroes.forEach(ally => {
                    if (ally.currentHp > 0) {
                        ally.currentHp = Math.min(ally.stats.hp, ally.currentHp + heal);
                    }
                });
                logEvent(`Turn ${turn}: ${h.obj.name} casts Prayer of Healing! Restores +${heal} HP to all party members.`, null, "all");
            }
            else if (skill.id === "holy_light") {
                const lowAlly = getLowestHpAlly(activeHeroes);
                if (lowAlly) {
                    const heal = Math.round(finalAtk * 1.6);
                    lowAlly.currentHp = Math.min(lowAlly.stats.hp, lowAlly.currentHp + heal);
                    logEvent(`Turn ${turn}: ${h.obj.name} channels Holy Light on ${lowAlly.obj.name} for +${heal} HP.`, null, lowAlly.obj.id);
                }
            }
            else if (skill.id === "blessing_of_kings") {
                activeHeroes.forEach(ally => {
                    if (ally.currentHp > 0) {
                        ally.buffs.kings = true;
                        ally.buffs.kings_duration = 3;
                    }
                });
                logEvent(`Turn ${turn}: ${h.obj.name} casts Blessing of Kings on the group! (+15% stats for 3 turns).`, null, "all");
            }
            else if (skill.id === "lay_on_hands") {
                const lowAlly = getLowestHpAlly(activeHeroes);
                if (lowAlly && !h.layOnHandsUsed) {
                    h.layOnHandsUsed = true;
                    lowAlly.currentHp = lowAlly.stats.hp; // Full heal!
                    logEvent(`Turn ${turn}: Paladin ${h.obj.name} lay hands on ${lowAlly.obj.name}! Instantly restored to FULL HP!`, null, lowAlly.obj.id);
                } else if (lowAlly) {
                    // Fallback to basic heal if lay on hands already used
                    const heal = Math.round(finalAtk * 1.0);
                    lowAlly.currentHp = Math.min(lowAlly.stats.hp, lowAlly.currentHp + heal);
                    logEvent(`Turn ${turn}: Paladin ${h.obj.name} heals ${lowAlly.obj.name} for +${heal} HP.`, null, lowAlly.obj.id);
                }
            }
        });

        if (enemyHp <= 0) break; // Enemy is slain!

        // --- 2. ENEMY PHASE: Enemy executes its custom turn skill rotation ---
        if (enemyStunned) {
            enemyStunned = false;
            logEvent(`Turn ${turn}: ${enemy.name} is STUNNED and cannot act!`);
        } else {
            const enemyRotation = ENEMY_ROTATIONS_DATABASE[enemy.id] || [];
            const enemyActionIndex = (turn - 1) % 5;
            const action = enemyRotation[enemyActionIndex] || { name: "Basic Swing", action: "basic" };

            // Find current target based on threat weight or active taunt
            let targetHero = null;
            const livingHeroes = activeHeroes.filter(h => h.currentHp > 0);
            
            if (livingHeroes.length > 0) {
                const tauntingHero = livingHeroes.find(h => h.buffs.taunt > 0);
                if (tauntingHero) {
                    targetHero = tauntingHero;
                } else {
                    const threatWeights = livingHeroes.map(h => {
                        let weight = 10;
                        if (h.obj.class === "Warrior") weight = 80;
                        else if (h.obj.class === "Paladin") weight = 50;
                        else if (h.obj.class === "Rogue") {
                            weight = h.feint > 0 ? 1 : 15;
                        }
                        return { hero: h, weight: weight };
                    });

                    const totalWeight = threatWeights.reduce((sum, entry) => sum + entry.weight, 0);
                    let rand = Math.random() * totalWeight;
                    
                    for (let entry of threatWeights) {
                        rand -= entry.weight;
                        if (rand <= 0) {
                            targetHero = entry.hero;
                            break;
                        }
                    }
                    if (!targetHero) targetHero = livingHeroes[0];
                }
            }

            // Calculate final enemy Attack value
            let finalEnemyAtk = enemy.atk * enemyBuffs.atk;
            if (enemyDebuffs.atk_debuff > 0) finalEnemyAtk *= 0.75; // reduced by Frostbolt

            if (targetHero) {
                if (action.action === "basic" || action.action === "attack") {
                    let mult = action.mult || 1.0;
                    
                    // Evasion roll
                    if (Math.random() < targetHero.buffs.evasion) {
                        logEvent(`Turn ${turn}: ${enemy.name} casts ${action.name} at ${targetHero.obj.name}, but they EVADE the attack!`);
                    } else {
                        let currentDef = targetHero.stats.def * targetHero.buffs.def_mult * (targetHero.buffs.kings ? 1.15 : 1.0);
                        if (action.ignoreDef) currentDef *= 0.5;

                        let dmg = finalEnemyAtk * mult - currentDef;
                        if (dmg < 1) dmg = 1;
                        dmg = Math.round(dmg);

                        // Absorb shield check
                        if (targetHero.buffs.shield > 0) {
                            if (targetHero.buffs.shield >= dmg) {
                                targetHero.buffs.shield -= dmg;
                                logEvent(`Turn ${turn}: ${enemy.name} uses ${action.name}. Power Word: Shield absorbs all ${dmg} damage (${targetHero.buffs.shield} remaining).`, targetHero.obj.id);
                                dmg = 0;
                            } else {
                                dmg -= targetHero.buffs.shield;
                                logEvent(`Turn ${turn}: ${enemy.name} uses ${action.name}. Power Word: Shield absorbs ${targetHero.buffs.shield} damage, breaking the barrier.`, targetHero.obj.id);
                                targetHero.buffs.shield = 0;
                            }
                        }

                        if (dmg > 0) {
                            targetHero.currentHp -= dmg;
                            logEvent(`Turn ${turn}: ${enemy.name} triggers ${action.name} on ${targetHero.obj.name}, dealing ${dmg} damage.`, targetHero.obj.id);
                            if (targetHero.currentHp <= 0) {
                                logEvent(`💀 ${targetHero.obj.name} is knocked out!`, targetHero.obj.id);
                                clearHeroBuffs(targetHero);
                            }
                        }

                        if (action.stun && targetHero.currentHp > 0) {
                            targetHero.stunned = true;
                            logEvent(`Turn ${turn}: ${targetHero.obj.name} is stunned for 1 turn!`, targetHero.obj.id);
                        }
                    }
                } 
                else if (action.action === "atk_buff") {
                    enemyBuffs.atk = 1.0 + action.mult;
                    enemyBuffs.atk_duration = action.duration;
                    logEvent(`Turn ${turn}: ${enemy.name} casts ${action.name}! ${action.desc}`);
                } 
                else if (action.action === "def_buff") {
                    enemyBuffs.def = 1.0 + action.mult;
                    enemyBuffs.def_duration = action.duration;
                    logEvent(`Turn ${turn}: ${enemy.name} casts ${action.name}! ${action.desc}`);
                } 
                else if (action.action === "evade_buff") {
                    enemyBuffs.evade = action.mult;
                    enemyBuffs.evade_duration = action.duration;
                    logEvent(`Turn ${turn}: ${enemy.name} casts ${action.name}! ${action.desc}`);
                } 
                else if (action.action === "aoe") {
                    logEvent(`Turn ${turn}: ${enemy.name} unleashes ${action.name} (AoE)!`, "all");
                    livingHeroes.forEach(th => {
                        let currentDef = th.stats.def * th.buffs.def_mult * (th.buffs.kings ? 1.15 : 1.0);
                        let dmg = finalEnemyAtk * action.mult - currentDef;
                        if (dmg < 1) dmg = 1;
                        dmg = Math.round(dmg);

                        if (th.buffs.shield > 0) {
                            if (th.buffs.shield >= dmg) {
                                th.buffs.shield -= dmg;
                                logEvent(`- Shield absorbs all ${dmg} damage on ${th.obj.name} (${th.buffs.shield} remaining).`, th.obj.id);
                                dmg = 0;
                            } else {
                                dmg -= th.buffs.shield;
                                logEvent(`- Shield absorbs ${th.buffs.shield} damage on ${th.obj.name}, breaking.`, th.obj.id);
                                th.buffs.shield = 0;
                            }
                        }

                        if (dmg > 0) {
                            th.currentHp -= dmg;
                            logEvent(`- Hits ${th.obj.name} for ${dmg} damage.`, th.obj.id);
                            if (th.currentHp <= 0) {
                                logEvent(`💀 ${th.obj.name} is knocked out!`, th.obj.id);
                                clearHeroBuffs(th);
                            }
                        }
                    });
                } 
                else if (action.action === "dot") {
                    logEvent(`Turn ${turn}: ${enemy.name} sprays ${action.name}!`, "all");
                    livingHeroes.forEach(th => {
                        th.dot = Math.round(finalEnemyAtk * action.mult);
                        th.dot_duration = action.duration;
                        logEvent(`- ${th.obj.name} is burning with DOT (takes ${th.dot} damage/turn for ${action.duration} turns).`);
                    });
                } 
                else if (action.action === "heal") {
                    let healAmt = action.value || Math.round(enemyMaxHp * action.mult);
                    enemyHp = Math.min(enemyMaxHp, enemyHp + healAmt);
                    logEvent(`Turn ${turn}: ${enemy.name} uses ${action.name}, regenerating +${healAmt} HP (${enemyHp}/${enemyMaxHp} HP).`, "enemy");
                }
            }
        }

        // --- 3. POST-TURN PERIODIC TICKS (HOTs / DOTs) ---
        activeHeroes.forEach(h => {
            if (h.currentHp <= 0) return;

            // Healing Over Time (HOT) Renew
            if (h.buffs.renew_duration > 0) {
                h.currentHp = Math.min(h.stats.hp, h.currentHp + h.buffs.renew);
                logEvent(`Turn ${turn} (Tick): Renew heals ${h.obj.name} for +${h.buffs.renew} HP (${h.currentHp}/${h.stats.hp} HP).`, null, h.obj.id);
                h.buffs.renew_duration--;
                if (h.buffs.renew_duration === 0) h.buffs.renew = 0;
            }

            // Damage Over Time (DOT) Bleeds/Fires
            if (h.dot_duration > 0) {
                h.currentHp -= h.dot;
                logEvent(`Turn ${turn} (Tick): ${h.obj.name} takes ${h.dot} periodic fire damage (${Math.max(0, h.currentHp)}/${h.stats.hp} HP).`, h.obj.id);
                h.dot_duration--;
                if (h.currentHp <= 0) {
                    logEvent(`💀 ${h.obj.name} is knocked out!`, h.obj.id);
                    clearHeroBuffs(h);
                }
            }
        });

        // Enemy Holy Consecration tick
        if (enemyHp > 0 && enemyDebuffs.consecration_duration > 0) {
            enemyHp -= enemyDebuffs.consecration;
            logEvent(`Turn ${turn} (Tick): Consecration deals ${enemyDebuffs.consecration} periodic holy damage to ${enemy.name} (${Math.max(0, enemyHp)}/${enemyMaxHp} HP).`, "enemy");
            enemyDebuffs.consecration_duration--;
            if (enemyDebuffs.consecration_duration === 0) enemyDebuffs.consecration = 0;
        }

        // --- 4. BUFF / DEBUFF DURATION DECREMENTS ---
        activeHeroes.forEach(h => {
            if (h.currentHp <= 0) return;
            if (h.buffs.atk_duration > 0) {
                h.buffs.atk_duration--;
                if (h.buffs.atk_duration === 0) h.buffs.atk = 0;
            }
            if (h.buffs.def_duration > 0) {
                h.buffs.def_duration--;
                if (h.buffs.def_duration === 0) h.buffs.def_mult = 1.0;
            }
            if (h.buffs.evasion_duration > 0) {
                h.buffs.evasion_duration--;
                if (h.buffs.evasion_duration === 0) h.buffs.evasion = 0;
            }
            if (h.buffs.shield_duration > 0) {
                h.buffs.shield_duration--;
                if (h.buffs.shield_duration === 0) h.buffs.shield = 0;
            }
            if (h.buffs.kings_duration > 0) {
                h.buffs.kings_duration--;
                if (h.buffs.kings_duration === 0) h.buffs.kings = false;
            }
            if (h.buffs.taunt > 0) h.buffs.taunt--;
            if (h.feint > 0) h.feint--;
        });

        if (enemyBuffs.atk_duration > 0) {
            enemyBuffs.atk_duration--;
            if (enemyBuffs.atk_duration === 0) enemyBuffs.atk = 1.0;
        }
        if (enemyBuffs.def_duration > 0) {
            enemyBuffs.def_duration--;
            if (enemyBuffs.def_duration === 0) enemyBuffs.def = 1.0;
        }
        if (enemyBuffs.evade_duration > 0) {
            enemyBuffs.evade_duration--;
            if (enemyBuffs.evade_duration === 0) enemyBuffs.evade = 0;
        }
        if (enemyDebuffs.sunder > 0) enemyDebuffs.sunder--;
        if (enemyDebuffs.expose > 0) enemyDebuffs.expose--;
        if (enemyDebuffs.atk_debuff > 0) enemyDebuffs.atk_debuff--;

        turn++;
    }

    const won = enemyHp <= 0;

    // Build the permanent state upgrades but hold them in finalHeroStatesMap (applied on close)
    let finalHeroStatesMap = {};
    activeHeroes.forEach(h => {
        finalHeroStatesMap[h.obj.id] = {
            hp: h.currentHp,
            status: h.currentHp > 0 ? "Idle" : "Dead",
            xp: h.obj.xp,
            level: h.obj.level,
            max_xp: h.obj.max_xp
        };
    });

    if (won) {
        logEvent(`[✓] Victory! Group defeated ${enemy.name}.`);
        
        activeHeroes.forEach(h => {
            let heroState = finalHeroStatesMap[h.obj.id];
            
            // Award full XP
            let newXp = h.obj.xp + enemy.xp;
            let newLevel = h.obj.level;
            let newMaxXp = h.obj.max_xp;
            
            logEvent(`${h.obj.name} earned +${enemy.xp} XP.`);

            while (newXp >= newMaxXp) {
                newLevel += 1;
                newXp -= newMaxXp;
                newMaxXp = newLevel * 100;
                logEvent(`🌟 LEVEL UP! ${h.obj.name} reached level ${newLevel}!`, null, h.obj.id);
            }
            
            heroState.xp = newXp;
            heroState.level = newLevel;
            heroState.max_xp = newMaxXp;
            heroState.hp = h.currentHp;
            heroState.status = h.currentHp > 0 ? "Idle" : "Dead";
        });
        
    } else {
        logEvent(`[✗] Defeat! The group wiped against ${enemy.name}.`);
        
        activeHeroes.forEach(h => {
            let heroState = finalHeroStatesMap[h.obj.id];
            heroState.hp = 0;
            heroState.status = "Dead";
        });
    }

    // Roll Loot drops locally
    let lootedDrops = [];
    if (won) {
        enemy.drops.forEach(drop => {
            if (Math.random() < drop.rate) {
                const existing = lootedDrops.find(d => d.itemId === drop.itemId);
                if (existing) {
                    existing.quantity++;
                } else {
                    lootedDrops.push({ itemId: drop.itemId, quantity: 1 });
                }
            }
        });
    }

    // Gather Metadata for Replay rendering
    let activeHeroesMetadata = activeHeroes.map(h => ({
        id: h.obj.id,
        name: h.obj.name,
        class: h.obj.class,
        level: h.obj.level,
        hp: h.stats.hp
    }));

    return {
        questId: quest.id,
        enemyId: enemy.id,
        activeHeroes: activeHeroesMetadata,
        enemyName: enemy.name,
        enemyIcon: enemy.icon,
        enemyLevel: enemy.level,
        enemyMaxHp: enemyMaxHp,
        events: replayEvents,
        won: won,
        xpEarned: enemy.xp,
        copperEarned: enemy.copper,
        lootDropped: lootedDrops,
        finalHeroStates: finalHeroStatesMap,
        turns: turn - 1
    };
}

function getLowestHpAlly(activeHeroes) {
    const living = activeHeroes.filter(a => a.currentHp > 0);
    if (living.length === 0) return null;
    return living.reduce((prev, curr) => {
        const prevPct = prev.currentHp / prev.stats.hp;
        const currPct = curr.currentHp / curr.stats.hp;
        return currPct < prevPct ? curr : prev;
    });
}

function clearHeroBuffs(h) {
    h.buffs = {
        atk: 0, crit: 0, def_mult: 1.0, evasion: 0, renew: 0, renew_duration: 0,
        shield: 0, shield_duration: 0, kings: false, kings_duration: 0, taunt: 0
    };
    h.dot = 0;
    h.dot_duration = 0;
    h.feint = 0;
    h.stunned = false;
}

function getHeroHpsMap(activeHeroes) {
    let map = {};
    activeHeroes.forEach(h => {
        map[h.obj.id] = Math.max(0, h.currentHp);
    });
    return map;
}

function getHeroShieldsMap(activeHeroes) {
    let map = {};
    activeHeroes.forEach(h => {
        map[h.obj.id] = h.buffs.shield || 0;
    });
    return map;
}

function reviveHero(heroId) {
    const hero = gameState.heroes.find(h => h.id === heroId);
    if (!hero || hero.status !== "Dead") return;

    const reviveCost = hero.level * 50; // 50 copper per level
    if (gameState.gold < reviveCost) {
        alert("You do not have enough Gold coins to revive this hero!");
        return;
    }

    addGold(-reviveCost);
    hero.status = "Idle";
    hero.hp = Math.round(getHeroFullStats(hero).hp); // Restore full HP
    
    renderHeroes();
    renderRepeatButton();
    pushBarrensChat("Guild Master", `${hero.name} has been resurrected and is ready for adventure.`);
}

// --- CRAFTING LOGIC ---

function craftItem(recipeId, profession) {
    const recipe = RECIPE_DATABASE[profession].find(r => r.id === recipeId);
    const item = ITEM_DATABASE[recipeId];

    if (!recipe || !item) return;

    // Check level req
    const crafter = gameState.crafters[profession];
    if (crafter.lvl < recipe.reqLvl) {
        alert("Your crafter level is too low to craft this recipe.");
        return;
    }

    // Check gold
    if (gameState.gold < recipe.cost) {
        alert("You do not have enough money to buy the crafting components.");
        return;
    }

    // Check mats
    for (let matId in recipe.mats) {
        const required = recipe.mats[matId];
        const owned = gameState.inventory[matId] || 0;
        if (owned < required) {
            alert(`Missing materials! You need ${required}x [${ITEM_DATABASE[matId].name}] but only own ${owned}x.`);
            return;
        }
    }

    // Deduct cost & mats
    addGold(-recipe.cost);
    for (let matId in recipe.mats) {
        addInventory(matId, -recipe.mats[matId]);
    }

    // Award item to bag
    const success = addInventory(recipeId, 1);
    if (!success) {
        // Refund if bags are full
        addGold(recipe.cost);
        for (let matId in recipe.mats) {
            addInventory(matId, recipe.mats[matId]);
        }
        return;
    }

    // Award profession XP
    crafter.xp += recipe.exp;
    if (crafter.xp >= crafter.max_xp) {
        crafter.lvl += 1;
        crafter.xp -= crafter.max_xp;
        crafter.max_xp = crafter.lvl * 120;
        pushBarrensChat("Profession Logs", `Congratulations! Your ${profession.toUpperCase()} has reached Level ${crafter.lvl}!`);
    }

    // Play successful click response
    renderCraftingRecipes();
    renderInventory();
}

// --- MARKET / NPC SALES LOGIC ---

function generateCustomerOffer() {
    if (gameState.customers.length >= 3) return;

    // Pick a random NPC customer
    const npc = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    
    // Choose item requested matching level range
    const craftableItems = [];
    for (let itemId in ITEM_DATABASE) {
        const item = ITEM_DATABASE[itemId];
        if (item.type !== "material") {
            craftableItems.push(itemId);
        }
    }

    const targetItem = craftableItems[Math.floor(Math.random() * craftableItems.length)];
    const item = ITEM_DATABASE[targetItem];

    // Premium payout coefficient (1.3x to 1.8x base vendor price)
    const multiplier = 1.3 + (Math.random() * 0.5);
    const offerPrice = Math.round(item.price * multiplier);

    gameState.customers.push({
        id: "npc_" + Date.now() + Math.random().toString(36).substr(2, 4),
        name: npc,
        requestedItemId: targetItem,
        price: offerPrice,
        avatar: npc[0]
    });

    renderCustomers();
}

function customerGeneratorTick() {
    generateCustomerOffer();
}

function fulfillOffer(offerId) {
    const offerIndex = gameState.customers.findIndex(c => c.id === offerId);
    if (offerIndex === -1) return;

    const offer = gameState.customers[offerIndex];
    const owned = gameState.inventory[offer.requestedItemId] || 0;

    if (owned < 1) {
        alert(`You do not have any [${ITEM_DATABASE[offer.requestedItemId].name}] in your inventory bags to sell.`);
        return;
    }

    // Sell item
    addInventory(offer.requestedItemId, -1);
    addGold(offer.price);
    
    // Remove offer
    gameState.customers.splice(offerIndex, 1);
    renderCustomers();
    
    pushBarrensChat("Shop", `Sold [${ITEM_DATABASE[offer.requestedItemId].name}] to ${offer.name} for ${parseCoins(offer.price)}.`);
}

function declineOffer(offerId) {
    const offerIndex = gameState.customers.findIndex(c => c.id === offerId);
    if (offerIndex === -1) return;

    gameState.customers.splice(offerIndex, 1);
    renderCustomers();
}

// Direct bag vendor sale (100% face value)
function sellItemDirect() {
    if (!selectedInventorySlot) return;

    const owned = gameState.inventory[selectedInventorySlot] || 0;
    if (owned < 1) return;

    const item = ITEM_DATABASE[selectedInventorySlot];
    addInventory(selectedInventorySlot, -1);
    addGold(item.price);

    closeModal("modal-item-details");
    renderInventory();
    pushBarrensChat("Shop", `Sold [${item.name}] directly to vendor for ${parseCoins(item.price)}.`);
}

// --- RENDER & WINDOW BINDINGS ---

function parseCoins(copperTotal) {
    const g = Math.floor(copperTotal / 10000);
    const s = Math.floor((copperTotal % 10000) / 100);
    const c = copperTotal % 100;
    
    let res = "";
    if (g > 0) res += `${g}g `;
    if (s > 0) res += `${s}s `;
    if (c > 0 || res === "") res += `${c}c`;
    return res.trim();
}

function renderCurrency() {
    const g = Math.floor(gameState.gold / 10000);
    const s = Math.floor((gameState.gold % 10000) / 100);
    const c = gameState.gold % 100;

    document.getElementById("gold-val").innerText = g;
    document.getElementById("silver-val").innerText = s;
    document.getElementById("copper-val").innerText = c;
}

function renderHeaderStats() {
    document.getElementById("header-heroes-count").innerText = `${gameState.heroes.length}/${gameState.settings.maxHeroes}`;
    document.getElementById("header-bag-count").innerText = `${getInventoryFilledSlots()}/${gameState.settings.maxBagSlots}`;
    
    // Left sidebar badges
    const idleCount = gameState.heroes.filter(h => h.status === "Idle").length;
    document.getElementById("badge-heroes-idle").innerText = idleCount;
    document.getElementById("badge-heroes-idle").style.display = idleCount > 0 ? "inline-block" : "none";

    const customerCount = gameState.customers.length;
    document.getElementById("badge-customers").innerText = customerCount;
    document.getElementById("badge-customers").style.display = customerCount > 0 ? "inline-block" : "none";
}

function switchTab(tabId) {
    currentTab = tabId;
    
    // Switch active state of nav buttons
    const navButtons = document.querySelectorAll(".left-sidebar .nav-button");
    navButtons.forEach(btn => btn.classList.remove("active"));
    
    // Find matching button to activate
    const indexMapping = { heroes: 0, quests: 1, crafting: 2, inventory: 3, market: 4 };
    if (navButtons[indexMapping[tabId]]) {
        navButtons[indexMapping[tabId]].classList.add("active");
    }

    // Toggle panels visibility
    const panels = document.querySelectorAll("main .tab-content");
    panels.forEach(p => p.classList.remove("active"));
    
    const activePanel = document.getElementById(`tab-${tabId}`);
    if (activePanel) {
        activePanel.classList.add("active");
    }

    // Perform specific tab renders
    if (tabId === "heroes") renderHeroes();
    if (tabId === "quests") renderEnemyList();
    if (tabId === "crafting") renderCraftingRecipes();
    if (tabId === "inventory") renderInventory();
    if (tabId === "market") renderCustomers();

    renderHeaderStats();
}

// Dynamic rendering loops

function renderHeroes() {
    const container = document.getElementById("heroes-grid-container");
    container.innerHTML = "";

    gameState.heroes.forEach(hero => {
        const stats = getHeroFullStats(hero);
        const card = document.createElement("div");
        card.className = "hero-card";

        const xpPct = (hero.xp / hero.max_xp) * 100;
        
        let actionsHtml = "";
        if (hero.status === "Dead") {
            const cost = hero.level * 50;
            actionsHtml = `
                <button class="wow-button" style="background:#dc2626; border-color:#ef4444; flex:2; margin-right:4px;" onclick="reviveHero('${hero.id}')">Resurrect (${parseCoins(cost)})</button>
                <button class="wow-button secondary" style="flex:1; margin-left:4px;" onclick="openSkillsModal('${hero.id}')">📜 Skills</button>
            `;
        } else if (hero.status === "Questing") {
            actionsHtml = `<button class="wow-button secondary" disabled style="width:100%;">Adventuring...</button>`;
        } else {
            actionsHtml = `
                <button class="wow-button secondary" onclick="openEquipModal('${hero.id}')" style="flex:1; margin-right:4px;">Equip Gear</button>
                <button class="wow-button secondary" onclick="openSkillsModal('${hero.id}')" style="flex:1; margin-left:4px;">📜 Skills</button>
            `;
        }

        const heroModelHtml = `
            <div class="hero-card-model class-${hero.class.toLowerCase()}" onclick="openEquipModal('${hero.id}')" title="Inspect Character Paper Doll">
                <!-- Deep linear gradient vignette overlay -->
                <div class="hero-card-model-overlay"></div>
                <!-- Inspect action overlay text -->
                <div class="hero-card-model-text">
                    <span>Inspect Character</span>
                    <span style="color: var(--wow-text-gold);">🔍 Click to open</span>
                </div>
            </div>
        `;

        card.innerHTML = `
            <div class="hero-header">
                <div class="hero-name-class">
                    <h3>${hero.name}</h3>
                    <span class="hero-class-tag class-${hero.class.toLowerCase()}">${CLASS_DATABASE[hero.class].classIcon} ${hero.class}</span>
                </div>
                <div class="hero-level">${hero.level}</div>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar xp" style="width: ${xpPct}%"></div>
                <span class="progress-text">XP: ${hero.xp} / ${hero.max_xp}</span>
            </div>

            <div class="hero-stats-panel">
                <div class="stat-row"><span>HP:</span> <span><strong>${stats.hp}</strong></span></div>
                <div class="stat-row"><span>Atk:</span> <span><strong>${stats.atk}</strong></span></div>
                <div class="stat-row"><span>Def:</span> <span><strong>${stats.def}</strong></span></div>
                <div class="stat-row"><span>Crit:</span> <span><strong>${stats.crit}%</strong></span></div>
            </div>

            ${heroModelHtml}

            <div class="hero-skills-row" style="display:flex; justify-content:center; align-items:center; gap:4px; background:rgba(0,0,0,0.3); padding:6px; border-radius:4px; margin: 8px 0; border: 1px dashed rgba(255,215,0,0.15);" title="Active Turn Rotation">
                ${renderHeroSkillsRowPreview(hero)}
            </div>

            <div class="hero-status-bar" style="display:flex; align-items:center; gap:4px; width:100%;">
                <span style="font-size:0.75rem; white-space:nowrap; flex:1;">Status: <strong class="status-${hero.status.toLowerCase()}">${hero.status}</strong></span>
                ${actionsHtml}
            </div>
        `;
        container.appendChild(card);
    });

    // Hire Hero Card (limit to 5)
    if (gameState.heroes.length < gameState.settings.maxHeroes) {
        const hireCost = gameState.heroes.length * 100; // 1 Silver, 2 Silver, 3 Silver...
        const hireCard = document.createElement("div");
        hireCard.className = "hero-card hire-hero-card";
        hireCard.onclick = () => openHireModal(hireCost);
        hireCard.innerHTML = `
            <div class="plus-icon">+</div>
            <h3>Recruit Hero</h3>
            <p style="font-size: 0.8rem; color: var(--wow-text-muted);">Expand your guild roster</p>
            <span style="color: var(--wow-text-gold); font-size: 0.9rem; font-weight: 700;">Cost: ${parseCoins(hireCost)}</span>
        `;
        container.appendChild(hireCard);
    }
}

function renderHeroSkillsRowPreview(hero) {
    const db = SKILL_DATABASE[hero.class] || [];
    let html = "";
    for (let i = 0; i < 5; i++) {
        const skillId = hero.skills[i];
        let skill = BASIC_ATTACK_SKILL;
        if (skillId) {
            skill = db.find(s => s.id === skillId) || BASIC_ATTACK_SKILL;
        }
        html += `<span style="font-size:1.1rem; cursor:pointer;" title="Turn ${i + 1}: ${skill.name}">${skill.icon}</span>`;
        if (i < 4) {
            html += `<span style="color:rgba(255,255,255,0.25); font-size:0.5rem; align-self:center;">▶</span>`;
        }
    }
    return html;
}

function getSlotIconPlaceholder(slot) {
    if (slot === "head") return "🪖";
    if (slot === "neck") return "📿";
    if (slot === "shoulders") return "🧣";
    if (slot === "back") return "🦹";
    if (slot === "chest") return "👕";
    if (slot === "hands") return "🧤";
    if (slot === "waist") return "🎗️";
    if (slot === "legs") return "👖";
    if (slot === "boots") return "🥾";
    if (slot === "ring") return "💍";
    if (slot === "trinket") return "🔮";
    if (slot === "weapon") return "⚔️";
    if (slot === "secondary") return "🛡️";
    return "📦";
}

// Zone and Enemy Rendering
// Zone and Enemy Rendering
function renderZoneSelector() {
    const container = document.getElementById("zone-list-container");
    container.innerHTML = "";
    
    const categories = {
        zone: { title: "🗺️ Adventure Zones", items: [] },
        dungeon: { title: "🏰 Dungeons (3-5 Players)", items: [] },
        raid: { title: "⚔️ Raids (10-20 Players)", items: [] }
    };

    ZONE_DATABASE.forEach((zone, idx) => {
        const type = zone.type || "zone";
        if (categories[type]) {
            categories[type].items.push({ zone, idx });
        }
    });

    Object.keys(categories).forEach(catKey => {
        const cat = categories[catKey];
        if (cat.items.length === 0) return;

        // Render sub-header
        const header = document.createElement("div");
        header.className = "zone-category-header";
        header.innerText = cat.title;
        container.appendChild(header);

        // Render buttons
        cat.items.forEach(({ zone, idx }) => {
            const btn = document.createElement("button");
            btn.className = `zone-button ${idx === currentZoneIndex ? 'active' : ''}`;
            btn.onclick = () => selectZone(idx);
            btn.innerHTML = `${zone.name}<br><span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">Lv. ${zone.lvlRange}</span>`;
            container.appendChild(btn);
        });
    });
}

function selectZone(idx) {
    currentZoneIndex = idx;
    renderZoneSelector();
    renderEnemyList();

    // Update zone banner artwork dynamically!
    const bannerImg = document.getElementById("zone-banner-img");
    const bannerTitle = document.getElementById("zone-banner-title");
    const bannerDesc = document.getElementById("zone-banner-desc");

    if (bannerImg && bannerTitle && bannerDesc) {
        const zone = ZONE_DATABASE[idx];
        bannerTitle.innerText = zone.name;

        // Map zones by name to appropriate assets and filters to look extremely premium!
        let src = "assets/elderwood_forest.png";
        let filter = "none";
        let desc = `Levels ${zone.lvlRange} | Unexplored frontier in the World of Warcrest.`;

        const name = zone.name;
        if (name === "Elderwood Forest") {
            src = "assets/elderwood_forest.png";
            filter = "none";
            desc = `Levels ${zone.lvlRange} | Quiet woodlands governed by Eldoria marshals.`;
        } else if (name === "The Grim Mines") {
            src = "assets/elderwood_forest.png";
            filter = "brightness(0.3) sepia(0.2) contrast(1.2)";
            desc = `Levels ${zone.lvlRange} | Deep, dusty mine shafts holding outlaw conspirators.`;
        } else if (name === "Shadowstone Keep") {
            src = "assets/rotting_reach.png";
            filter = "brightness(0.3) hue-rotate(240deg) saturate(0.8)";
            desc = `Levels ${zone.lvlRange} | Haunted fortress overrun by dark magic and shadows.`;
        } else if (name === "Sunset Plains") {
            src = "assets/elderwood_forest.png";
            filter = "sepia(0.6) hue-rotate(335deg) saturate(1.3) contrast(1.1)";
            desc = `Levels ${zone.lvlRange} | Dust-blown plains plagued by outlaw pillagers.`;
        } else if (name === "Wailing Fens") {
            src = "assets/thorncrest_jungle.png";
            filter = "brightness(0.4) hue-rotate(60deg) saturate(1.2)";
            desc = `Levels ${zone.lvlRange} | Ancient cavern system filled with raptors and slumbering druids.`;
        } else if (name === "Stockade Asylum") {
            src = "assets/classes.png";
            filter = "brightness(0.3) grayscale(0.5)";
            desc = `Levels ${zone.lvlRange} | Heavily fortified prison experiencing a massive breakout.`;
        } else if (name === "The Red Wastes") {
            src = "assets/classes.png";
            filter = "sepia(0.5) hue-rotate(35deg) saturate(1.2)";
            desc = `Levels ${zone.lvlRange} | Red wastes home to centaurs, raptors, and eternal general chat.`;
        } else if (name === "Scarlet Cathedral") {
            src = "assets/classes.png";
            filter = "sepia(0.3) saturate(1.8) hue-rotate(330deg) contrast(1.1)";
            desc = `Levels ${zone.lvlRange} | Bastion of fanatical crusaders dedicated to cleansing the Blight.`;
        } else if (name === "Gnomish Depths") {
            src = "assets/classes.png";
            filter = "brightness(0.5) hue-rotate(180deg) saturate(1.5)";
            desc = `Levels ${zone.lvlRange} | High-tech underground metropolis polluted by toxic waste.`;
        } else if (name === "Thorncrest Jungle") {
            src = "assets/thorncrest_jungle.png";
            filter = "none";
            desc = `Levels ${zone.lvlRange} | Dense, humid rain forest crawling with wild cats and corsairs.`;
        } else if (name === "Troll-Sand Temple") {
            src = "assets/thorncrest_jungle.png";
            filter = "sepia(0.8) hue-rotate(5deg) saturate(1.2) brightness(0.6)";
            desc = `Levels ${zone.lvlRange} | Sun-drenched ruins home to desert trolls and ancient sand magic.`;
        } else if (name === "The Drowned Fane") {
            src = "assets/rotting_reach.png";
            filter = "hue-rotate(150deg) brightness(0.4) saturate(1.2)";
            desc = `Levels ${zone.lvlRange} | Sunken temple dedicated to the skeletal emerald dragon.`;
        } else if (name === "The Rotting Reach") {
            src = "assets/rotting_reach.png";
            filter = "none";
            desc = `Levels ${zone.lvlRange} | Ruined lands decaying under an ancient and toxic blight.`;
        } else if (name === "Glacier Basin") {
            src = "assets/glacier_basin.png";
            filter = "none";
            desc = `Levels ${zone.lvlRange} | Frozen alpine landscape home to sabertooths and crystal elements.`;
        } else if (name === "Darkstone Depths") {
            src = "assets/obsidian_caldera.png";
            filter = "brightness(0.3) contrast(1.3)";
            desc = `Levels ${zone.lvlRange} | Smoldering black stone city deep beneath the volcano.`;
        } else if (name === "Feral Ruin") {
            src = "assets/thorncrest_jungle.png";
            filter = "brightness(0.3) hue-rotate(120deg)";
            desc = `Levels ${zone.lvlRange} | Overgrown ruins concealing ancient highborne ghosts.`;
        } else if (name === "The Ashfall Ruins") {
            src = "assets/rotting_reach.png";
            filter = "sepia(0.5) hue-rotate(340deg) brightness(0.4) contrast(1.2)";
            desc = `Levels ${zone.lvlRange} | Ash-covered ruin of a grand city, haunted by the undead.`;
        } else if (name === "Obsidian Caldera [Raid]") {
            src = "assets/obsidian_caldera.png";
            filter = "none";
            desc = `Levels ${zone.lvlRange} [Raid] | Core of Obsidian Mountain, ruled by Ignis the Firelord.`;
        } else if (name === "Darkwing Summit [Raid]") {
            src = "assets/obsidian_caldera.png";
            filter = "hue-rotate(220deg) brightness(0.6) saturate(0.8)";
            desc = `Levels ${zone.lvlRange} [Raid] | Laboratory at the peak of the mountain, ruled by the black dragon master.`;
        } else if (name === "Wyrmqueen's Den [Raid]") {
            src = "assets/obsidian_caldera.png";
            filter = "hue-rotate(340deg) brightness(0.5) contrast(1.2)";
            desc = `Levels ${zone.lvlRange} [Raid] | The volcanic lair of the broodmother dragon.`;
        }

        bannerImg.src = src;
        bannerImg.style.filter = filter;
        bannerDesc.innerText = desc;
    }
}

function renderEnemyList() {
    const zone = ZONE_DATABASE[currentZoneIndex];
    document.getElementById("current-zone-name").innerText = zone.name;
    document.getElementById("current-zone-level").innerText = `Levels ${zone.lvlRange}`;

    const container = document.getElementById("enemy-list-container");
    container.innerHTML = "";

    zone.enemies.forEach(enemy => {
        const card = document.createElement("div");
        card.className = "enemy-card";

        // Check if dungeon or raid enemy is unlocked
        const isDungeonOrRaid = zone.type === "dungeon" || zone.type === "raid";
        let isUnlocked = true;
        let prevEnemy = null;
        if (isDungeonOrRaid) {
            const index = zone.enemies.indexOf(enemy);
            if (index > 0) {
                prevEnemy = zone.enemies[index - 1];
                isUnlocked = gameState.defeatedEnemies && gameState.defeatedEnemies.includes(prevEnemy.id);
            }
        }

        if (!isUnlocked) {
            card.className = "enemy-card locked";
            card.style.opacity = "0.45";
            card.style.filter = "grayscale(80%)";
            card.style.border = "1px dashed rgba(255, 0, 0, 0.3)";
            card.style.position = "relative";
        }

        let dropsHtml = "";
        enemy.drops.forEach(drop => {
            const item = ITEM_DATABASE[drop.itemId];
            const pct = Math.round(drop.rate * 100);
            const rarityColors = {
                0: "#9d9d9d", // Gray (Poor)
                1: "#ffffff", // White (Common)
                2: "#1eff00", // Green (Uncommon)
                3: "#0070dd", // Blue (Rare)
                4: "#a335ee", // Purple (Epic)
                5: "#ff8000"  // Orange (Legendary)
            };
            const color = rarityColors[item.rarity] || "#ffffff";
            dropsHtml += `<span style="color: ${color};">${item.icon} [${item.name}] (${pct}%)</span>`;
        });

        const buttonHtml = isUnlocked ? `
            <button class="wow-button" style="margin-top: auto;" onclick="openDispatchModal(${currentZoneIndex}, '${enemy.id}')">
                Send Hero
            </button>
        ` : `
            <button class="wow-button secondary" style="margin-top: auto; cursor: not-allowed; opacity: 0.6; pointer-events: none;" disabled>
                🔒 Locked (Requires: ${prevEnemy ? prevEnemy.name : "Previous"})
            </button>
        `;
        const stats = (gameState.enemyStats && gameState.enemyStats[enemy.id]) || { kills: 0, deaths: 0 };

        card.innerHTML = `
            <div class="enemy-card-header">
                <h3>${enemy.icon} ${enemy.name}</h3>
                <span class="enemy-level-tag">Lv. ${enemy.level}</span>
            </div>
            
            <div class="enemy-details">
                <div>Health: <strong>${enemy.hp} HP</strong></div>
                <div>Damage: <strong>${enemy.atk} Atk</strong></div>
                <div>Rewards: <strong>+${enemy.xp} XP</strong>, <strong>${parseCoins(enemy.copper)}</strong></div>
                <div>Duration: <strong>${enemy.duration}s</strong></div>
            </div>

            <div class="enemy-tracking">
                <span style="color:var(--wow-text-gold); font-weight:bold;">Record:</span>
                <span style="color:#1eff00; margin-left:4px;">🏆 ${stats.kills} Wins</span>
                <span style="color:#ff3333; margin-left:4px;">💀 ${stats.deaths} Losses</span>
            </div>

            <div class="enemy-drops" style="font-size: 0.75rem;">
                <strong style="color:var(--wow-text-gold);">Possible Drops:</strong>
                <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                    ${dropsHtml}
                </div>
            </div>

            ${buttonHtml}
        `;
        container.appendChild(card);
    });
}

// Crafting Recipes Rendering
function switchProfession(prof) {
    currentProfession = prof;
    
    // Toggle active state of profession select buttons
    const professions = ["blacksmith", "tailor", "leatherworker", "alchemist"];
    professions.forEach(p => {
        document.getElementById(`prof-btn-${p}`).classList.remove("active");
    });
    document.getElementById(`prof-btn-${prof}`).classList.add("active");

    const profName = { blacksmith: "Blacksmithing", tailor: "Tailoring", leatherworker: "Leatherworking", alchemist: "Alchemy" };
    document.getElementById("current-profession-name").innerText = `${profName[prof]} Recipes`;

    renderCraftingRecipes();
    renderCrafterProgress();
}

function renderCrafterProgress() {
    const crafter = gameState.crafters[currentProfession];
    document.getElementById(`prof-lvl-${currentProfession}`).innerText = crafter.lvl;
    
    const pct = (crafter.xp / crafter.max_xp) * 100;
    document.getElementById(`prof-xp-${currentProfession}`).style.width = `${pct}%`;
    document.getElementById(`prof-xp-txt-${currentProfession}`).innerText = `${crafter.xp} / ${crafter.max_xp} XP`;
}

function renderCraftingRecipes() {
    const container = document.getElementById("recipe-list-container");
    container.innerHTML = "";

    const recipes = RECIPE_DATABASE[currentProfession];
    
    recipes.forEach(recipe => {
        const item = ITEM_DATABASE[recipe.id];
        const card = document.createElement("div");
        card.className = "recipe-card";

        let matsHtml = "";
        let canCraft = true;
        
        for (let matId in recipe.mats) {
            const required = recipe.mats[matId];
            const owned = gameState.inventory[matId] || 0;
            const met = owned >= required;
            if (!met) canCraft = false;

            matsHtml += `
                <div class="mat-row ${met ? 'met' : 'unmet'}">
                    <span>${ITEM_DATABASE[matId].icon} [${ITEM_DATABASE[matId].name}]</span>
                    <span>${owned} / ${required}</span>
                </div>
            `;
        }

        if (gameState.gold < recipe.cost) canCraft = false;
        
        const crafter = gameState.crafters[currentProfession];
        const levelMet = crafter.lvl >= recipe.reqLvl;

        let actionBtn = "";
        if (!levelMet) {
            actionBtn = `<button class="wow-button" disabled>Requires Lvl ${recipe.reqLvl}</button>`;
        } else {
            actionBtn = `<button class="wow-button" ${canCraft ? "" : "disabled"} onclick="craftItem('${recipe.id}', '${currentProfession}')">
                Craft (${parseCoins(recipe.cost)})
            </button>`;
        }

        let statsHtml = "";
        if (item.stats) {
            let list = [];
            for (let statName in item.stats) {
                list.push(`+${item.stats[statName]} ${statName.toUpperCase()}`);
            }
            statsHtml = `<span style="font-size:0.75rem; color:var(--rarity-uncommon); font-weight:700;">(${list.join(", ")})</span>`;
        }

        card.innerHTML = `
            <div class="recipe-card-header">
                <span style="font-size: 1.6rem;">${item.icon}</span>
                <div>
                    <h3 class="text-rarity-${item.rarity}">[${item.name}]</h3>
                    ${statsHtml}
                </div>
                <span class="recipe-level-req">Lv. ${recipe.reqLvl}</span>
            </div>

            <div class="recipe-mats">
                <strong style="color:var(--wow-text-gold);">Required Materials:</strong>
                ${matsHtml}
            </div>

            ${actionBtn}
        `;
        container.appendChild(card);
    });

    renderCrafterProgress();
}

// Inventory Screen
function renderInventory() {
    const container = document.getElementById("inventory-grid-container");
    container.innerHTML = "";

    let slotsRendered = 0;

    for (let itemId in gameState.inventory) {
        const qty = gameState.inventory[itemId];
        if (qty <= 0) continue;

        const item = ITEM_DATABASE[itemId];
        const slot = document.createElement("div");
        slot.className = "inv-slot";
        slot.onclick = () => openItemDetailsModal(itemId);
        
        slot.innerHTML = `
            <span class="slot-item-icon">${item.icon}</span>
            <div class="item-quantity">${qty}</div>
            <div class="item-glow rarity-glow-${item.rarity}"></div>
        `;
        container.appendChild(slot);
        slotsRendered++;
    }

    // Fill remaining empty slots up to bags size (max 30)
    for (let i = slotsRendered; i < gameState.settings.maxBagSlots; i++) {
        const slot = document.createElement("div");
        slot.className = "inv-slot";
        container.appendChild(slot);
    }

    document.getElementById("bag-space-txt").innerText = `${slotsRendered} / ${gameState.settings.maxBagSlots} bags slots filled`;
}

// Market Sales Rendering
function renderCustomers() {
    const container = document.getElementById("customer-list-container");
    container.innerHTML = "";

    if (gameState.customers.length === 0) {
        container.innerHTML = `<p style="font-size: 0.85rem; color: var(--wow-text-muted); text-align: center; padding: 20px;">
            No customers currently waiting. Check back soon!
        </p>`;
        return;
    }

    gameState.customers.forEach(npc => {
        const item = ITEM_DATABASE[npc.requestedItemId];
        const card = document.createElement("div");
        card.className = "customer-card";

        const owned = gameState.inventory[npc.requestedItemId] || 0;
        const canFulfill = owned >= 1;

        card.innerHTML = `
            <div class="customer-header">
                <div class="customer-avatar">${npc.avatar}</div>
                <div>
                    <h3>${npc.name}</h3>
                    <span style="font-size:0.75rem; color:var(--wow-text-muted);">Traveling Buyer</span>
                </div>
            </div>

            <div class="customer-offer">
                <span>Wants: <strong class="text-rarity-${item.rarity}">${item.icon} [${item.name}]</strong></span>
                <span>Offer: <strong style="color:var(--wow-text-gold); font-family:monospace;">${parseCoins(npc.price)}</strong></span>
            </div>

            <div class="customer-actions">
                <button class="wow-button secondary" onclick="declineOffer('${npc.id}')">Decline</button>
                <button class="wow-button" ${canFulfill ? "" : "disabled"} onclick="fulfillOffer('${npc.id}')">
                    Fulfill Deal (${owned} owned)
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Active Adventures Sidebar Countdown timers
function renderActiveQuestsSidebar() {
    const container = document.getElementById("active-adventures-container");
    const label = document.getElementById("no-active-quests-txt");

    // Remove old active cards
    const oldCards = container.querySelectorAll(".active-adventure-card");
    oldCards.forEach(c => c.remove());

    if (gameState.activeQuests.length === 0) {
        label.style.display = "block";
        return;
    }

    label.style.display = "none";

    gameState.activeQuests.forEach(quest => {
        const heroIds = quest.heroIds || (quest.heroId ? [quest.heroId] : []);
        const zone = ZONE_DATABASE.find(z => z.id === quest.zoneId);
        const enemy = zone.enemies.find(e => e.id === quest.enemyId);

        if (heroIds.length === 0 || !enemy) return;

        // Collect names and classes
        let heroListHtml = [];
        heroIds.forEach(id => {
            const h = gameState.heroes.find(hero => hero.id === id);
            if (h) {
                heroListHtml.push(`${CLASS_DATABASE[h.class].classIcon} ${h.name}`);
            }
        });

        const card = document.createElement("div");

        if (quest.isCompleted) {
            card.className = "active-adventure-card completed-pulse";
            card.innerHTML = `
                <div class="adv-header">
                    <span class="adv-hero" style="font-size:0.75rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;" title="${heroListHtml.join(', ')}">
                        ${heroListHtml.join(', ')}
                    </span>
                    <span class="adv-timer" style="color:var(--wow-text-gold); font-weight:bold;">DONE</span>
                </div>
                <div class="adv-target" style="color:var(--wow-text-gold); font-weight:bold; font-size:0.85rem;">🎁 Quest Completed!</div>
                <div style="font-size:0.75rem; color:var(--wow-text-muted); margin-bottom:6px;">Location: ${zone.name}</div>
                <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 5px; width: 100%;">
                    <div style="display: flex; gap: 5px; width: 100%;">
                        <button class="wow-button" onclick="startBattleReplay('${quest.id}')" style="flex: 1.1; font-size:0.72rem; padding:5px 4px; border-radius:4px; font-weight:bold; box-shadow:0 0 5px rgba(243,156,18,0.4);">View Replay</button>
                        <button class="wow-button secondary" onclick="quickCollectQuestRewards('${quest.id}')" style="flex: 1; font-size:0.72rem; padding:5px 4px; border-radius:4px; font-weight:bold;">Quick Loot</button>
                    </div>
                    <button class="wow-button" onclick="quickLootAndRerun('${quest.id}')" style="font-size:0.72rem; padding:5px 4px; border-radius:4px; font-weight:bold; background: linear-gradient(135deg, #d35400, #e67e22); border: 1px solid #e67e22; text-shadow: 1px 1px 1px black; box-shadow: 0 0 5px rgba(211, 84, 0, 0.4);">Loot & Rerun 🔄</button>
                </div>
            `;
        } else {
            card.className = "active-adventure-card";
            const pct = ((quest.durationTotal - quest.durationRemaining) / quest.durationTotal) * 100;
            card.innerHTML = `
                <div class="adv-header">
                    <span class="adv-hero" style="font-size:0.75rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;" title="${heroListHtml.join(', ')}">
                        ${heroListHtml.join(', ')}
                    </span>
                    <span class="adv-timer">${quest.durationRemaining}s</span>
                </div>
                <div class="adv-target">Fighting ${enemy.icon} ${enemy.name}</div>
                <div style="font-size:0.7rem; color:var(--wow-text-muted); margin-bottom:2px;">Location: ${zone.name}</div>
                <div class="progress-container">
                    <div class="progress-bar quest" style="width: ${pct}%"></div>
                </div>
            `;
        }
        container.appendChild(card);
    });
}

// --- MODAL DIALOGS TRIGGERS ---

function openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
    if (modalId === "modal-hero-equipment") {
        selectedEquipHeroId = null;
    }
}

function openHireModal(cost) {
    document.getElementById("hire-cost-txt").innerText = parseCoins(cost);
    document.getElementById("hire-hero-name").value = "";
    openModal("modal-hire-hero");
}

function confirmHireHero() {
    const nameInput = document.getElementById("hire-hero-name").value.trim();
    const heroClass = document.getElementById("hire-hero-class").value;
    const cost = (gameState.heroes.length) * 100;

    if (!nameInput) {
        alert("Please enter a name for your guild adventurer!");
        return;
    }

    if (gameState.gold < cost) {
        alert("You do not have enough money to hire this hero!");
        return;
    }

    addGold(-cost);
    gameState.heroes.push(createHero(nameInput, heroClass));
    
    renderHeroes();
    renderHeaderStats();
    closeModal("modal-hire-hero");
    
    pushBarrensChat("Guild Master", `${nameInput} (${heroClass}) has joined the guild!`);
}

function openDispatchModal(zoneId, enemyId) {
    selectedDispatchQuest = { zoneId, enemyId };
    const container = document.getElementById("dispatch-hero-options");
    container.innerHTML = "";

    const zone = ZONE_DATABASE.find(z => z.id === zoneId);
    if (!zone) return;

    const zoneType = zone.type || "zone";
    let minHeroes = 1, maxHeroes = 5;
    if (zoneType === "dungeon") { minHeroes = 3; maxHeroes = 5; }
    else if (zoneType === "raid") { minHeroes = 10; maxHeroes = 20; }

    const idleHeroes = gameState.heroes.filter(h => h.status === "Idle");

    if (idleHeroes.length === 0) {
        container.innerHTML = `<p style="font-size: 0.85rem; color: var(--wow-text-muted); text-align: center; padding: 20px;">
            All your heroes are currently busy adventuring or require resurrection. Visit the Guild Roster tab.
        </p>`;
        openModal("modal-select-hero-dispatch");
        return;
    }

    // Set header modal title
    document.querySelector("#modal-select-hero-dispatch h3").innerText = "Assemble Group Dispatch";

    // Add Constraints Banner
    const banner = document.createElement("div");
    banner.className = "dispatch-constraints-banner";
    if (zoneType === "dungeon") {
        banner.style.background = "rgba(173, 53, 186, 0.15)";
        banner.style.border = "1px solid rgba(173, 53, 186, 0.4)";
        banner.style.color = "#df94eb";
        banner.innerHTML = "🏰 <strong>Dungeon Constraints:</strong> 3 to 5 heroes required.";
    } else if (zoneType === "raid") {
        banner.style.background = "rgba(224, 86, 36, 0.15)";
        banner.style.border = "1px solid rgba(224, 86, 36, 0.4)";
        banner.style.color = "#ff9975";
        banner.innerHTML = "⚔️ <strong>Raid Constraints:</strong> 10 to 20 heroes required.";
    } else {
        banner.style.background = "rgba(41, 143, 41, 0.15)";
        banner.style.border = "1px solid rgba(41, 143, 41, 0.4)";
        banner.style.color = "#7cde7c";
        banner.innerHTML = "🗺️ <strong>Adventure Constraints:</strong> 1 to 5 heroes required.";
    }
    container.appendChild(banner);

    // Track selected hero IDs locally in a list
    let selectedHeroIds = [];

    // Container for heroes list
    const listWrapper = document.createElement("div");
    listWrapper.style.maxHeight = "300px";
    listWrapper.style.overflowY = "auto";
    listWrapper.style.paddingRight = "4px";
    container.appendChild(listWrapper);

    const updateConfirmButton = () => {
        const btn = document.getElementById("confirm-dispatch-btn");
        if (btn) {
            const count = selectedHeroIds.length;
            if (count >= minHeroes && count <= maxHeroes) {
                btn.disabled = false;
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
                btn.innerText = `Dispatch Group (${count}/${minHeroes}-${maxHeroes} Selected)`;
            } else {
                btn.disabled = true;
                btn.style.opacity = "0.6";
                btn.style.cursor = "not-allowed";
                if (count < minHeroes) {
                    btn.innerText = `Need ${minHeroes - count} More (${count}/${minHeroes}-${maxHeroes})`;
                } else {
                    btn.innerText = `Too Many Selected (${count}/${minHeroes}-${maxHeroes})`;
                }
            }
        }
    };

    // Create cards with checkbox toggling
    idleHeroes.forEach(hero => {
        const stats = getHeroFullStats(hero);
        const card = document.createElement("div");
        card.className = "hero-card";
        card.style.cursor = "pointer";
        card.style.marginBottom = "8px";
        card.style.border = "1px solid var(--wow-border-dark)";
        card.style.transition = "all 0.15s";
        card.style.padding = "8px 12px";
        card.style.borderRadius = "4px";
        card.style.background = "rgba(12, 13, 17, 0.8)";

        // Toggling selection
        card.onclick = () => {
            const idx = selectedHeroIds.indexOf(hero.id);
            if (idx === -1) {
                selectedHeroIds.push(hero.id);
                card.style.borderColor = "var(--wow-border-gold)";
                card.style.background = "rgba(179, 143, 41, 0.15)";
                card.querySelector("input").checked = true;
            } else {
                selectedHeroIds.splice(idx, 1);
                card.style.borderColor = "var(--wow-border-dark)";
                card.style.background = "rgba(12, 13, 17, 0.8)";
                card.querySelector("input").checked = false;
            }
            updateConfirmButton();
        };

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" style="pointer-events: none;" onclick="event.stopPropagation();">
                    <div>
                        <strong style="color:var(--wow-text-gold);">${hero.name}</strong> 
                        <span style="font-size:0.75rem; color:var(--wow-text-muted);">Lvl ${hero.level} ${hero.class}</span>
                    </div>
                </div>
                <div style="font-size:0.8rem;">❤️ HP: ${stats.hp} | 🗡️ Atk: ${stats.atk}</div>
            </div>
        `;
        listWrapper.appendChild(card);
    });

    // Add Master Confirm Button at the bottom
    const dispatchBtn = document.createElement("button");
    dispatchBtn.id = "confirm-dispatch-btn";
    dispatchBtn.className = "wow-button";
    dispatchBtn.style.width = "100%";
    dispatchBtn.style.marginTop = "10px";
    dispatchBtn.innerText = `Select ${minHeroes}-${maxHeroes} Heroes to Dispatch`;
    dispatchBtn.disabled = true;
    dispatchBtn.style.opacity = "0.6";
    dispatchBtn.style.cursor = "not-allowed";
    dispatchBtn.onclick = () => {
        if (selectedHeroIds.length >= minHeroes && selectedHeroIds.length <= maxHeroes) {
            startQuest(selectedHeroIds, enemyId, zoneId);
        }
    };
    container.appendChild(dispatchBtn);

    openModal("modal-select-hero-dispatch");
}

function openEquipSlotModal(heroId, slot) {
    selectedEquipSlot = { heroId, slot };
    const container = document.getElementById("equip-item-options");
    container.innerHTML = "";

    const hero = gameState.heroes.find(h => h.id === heroId);
    if (!hero) return;

    // Find compatible gear in bag inventory
    const gearList = [];
    for (let itemId in gameState.inventory) {
        if (gameState.inventory[itemId] > 0) {
            const item = ITEM_DATABASE[itemId];
            
            let isCompatible = false;
            if (slot === "secondary") {
                if (hero.class === "Warrior" || hero.class === "Paladin") {
                    isCompatible = (item.type === "shield");
                } else if (hero.class === "Rogue") {
                    isCompatible = (item.type === "weapon");
                } else if (hero.class === "Mage" || hero.class === "Priest") {
                    isCompatible = (item.type === "offhand");
                }
            } else if (slot === "weapon") {
                isCompatible = (item.type === "weapon");
            } else {
                isCompatible = (item.type === slot);
            }
            
            if (isCompatible) {
                gearList.push(itemId);
            }
        }
    }

    if (gearList.length === 0) {
        container.innerHTML = `<p style="font-size:0.85rem; color:var(--wow-text-muted); text-align:center; padding:20px;">
            No compatible [${slot.toUpperCase()}] equipment found in your inventory bags. Go craft some!
        </p>`;
        openModal("modal-select-equip");
        return;
    }

    gearList.forEach(itemId => {
        const item = ITEM_DATABASE[itemId];
        const opt = document.createElement("div");
        opt.className = "hero-card";
        opt.style.cursor = "pointer";
        opt.style.marginBottom = "5px";
        opt.onclick = () => equipItem(heroId, slot, itemId);

        let statsTxt = "";
        for (let stat in item.stats) {
            statsTxt += `+${item.stats[stat]} ${stat.toUpperCase()} `;
        }

        opt.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:1.4rem;">${item.icon}</span>
                <div>
                    <strong class="text-rarity-${item.rarity}">[${item.name}]</strong>
                    <div style="font-size:0.75rem; color:var(--rarity-uncommon); font-weight:700;">${statsTxt}</div>
                </div>
            </div>
        `;
        container.appendChild(opt);
    });

    openModal("modal-select-equip");
}

// --- CHARACTER PAPER-DOLL EQUIPMENT PAGE POPUP ---

let selectedEquipHeroId = null;

function openEquipModal(heroId) {
    const hero = gameState.heroes.find(h => h.id === heroId);
    if (!hero) return;

    selectedEquipHeroId = heroId;

    // Set Text Details
    document.getElementById("equip-hero-title").innerText = `🛡️ Character Sheet: ${hero.name}`;
    document.getElementById("doll-hero-name").innerText = hero.name;
    document.getElementById("doll-hero-level").innerText = `Level ${hero.level} Adventurer`;
    
    // Class tag branding
    const classTag = document.getElementById("doll-hero-class-tag");
    if (classTag) {
        classTag.className = `hero-class-tag class-${hero.class.toLowerCase()}`;
        classTag.innerHTML = `${CLASS_DATABASE[hero.class].classIcon} ${hero.class}`;
    }

    // Centered class icon background silhouette
    const silhouette = document.getElementById("doll-silhouette");
    if (silhouette) {
        silhouette.innerText = CLASS_DATABASE[hero.class].classIcon;
    }

    // Core stats aggregation sheet
    const stats = getHeroFullStats(hero);
    const apLimit = getHeroMaxAp(hero);
    const statsContainer = document.getElementById("doll-hero-stats");
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:3px; margin-bottom:3px;">
                <span style="color:var(--wow-text-muted);">Health Points (HP):</span>
                <strong style="color:#fff;">${stats.hp}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:3px; margin-bottom:3px;">
                <span style="color:var(--wow-text-muted);">Physical Attack (Atk):</span>
                <strong style="color:#fff;">${stats.atk}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:3px; margin-bottom:3px;">
                <span style="color:var(--wow-text-muted);">Armor Defense (Def):</span>
                <strong style="color:#fff;">${stats.def}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:3px; margin-bottom:3px;">
                <span style="color:var(--wow-text-muted);">Critical Strike Rate:</span>
                <strong style="color:#fff;">${stats.crit}%</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding-top:2px;">
                <span style="color:var(--wow-text-muted);">Action Points Limit:</span>
                <strong style="color:var(--wow-text-gold);">${apLimit} AP</strong>
            </div>
        `;
    }

    // Dynamic slot render columns
    const leftContainer = document.getElementById("doll-left-slots");
    const rightContainer = document.getElementById("doll-right-slots");
    const bottomContainer = document.getElementById("doll-bottom-slots");

    if (leftContainer) leftContainer.innerHTML = "";
    if (rightContainer) rightContainer.innerHTML = "";
    if (bottomContainer) bottomContainer.innerHTML = "";

    const leftSlots = ["head", "neck", "shoulders", "back", "chest"];
    const rightSlots = ["hands", "waist", "legs", "boots", "ring"];
    const bottomSlots = ["trinket", "weapon", "secondary"];

    // Populate Left column slots: [Label] [Slot]
    leftSlots.forEach(slot => {
        const itemId = hero.equipment[slot];
        const slotRow = document.createElement("div");
        slotRow.style.cssText = "display: flex; align-items: center; justify-content: flex-end; gap: 8px; width: 100%; height: 46px;";
        
        let slotHtml = "";
        if (itemId) {
            const item = ITEM_DATABASE[itemId];
            slotHtml = `
                <div class="eq-slot equipped" onclick="unequipItem('${hero.id}', '${slot}')" title="Unequip [${item.name}]" style="width: 42px; height: 42px; margin:0;">
                    <span class="slot-icon">${item.icon}</span>
                    <div class="item-glow rarity-glow-${item.rarity}"></div>
                </div>
            `;
        } else {
            slotHtml = `
                <div class="eq-slot" onclick="openEquipSlotModal('${hero.id}', '${slot}')" title="Equip ${slot}" style="width: 42px; height: 42px; margin:0;">
                    <span class="slot-icon" style="opacity:0.3;">${getSlotIconPlaceholder(slot)}</span>
                </div>
            `;
        }

        slotRow.innerHTML = `
            <span style="font-size: 0.65rem; color: var(--wow-text-muted); text-transform: uppercase; font-weight: bold; text-shadow: 1px 1px #000;">${slot}</span>
            ${slotHtml}
        `;
        leftContainer.appendChild(slotRow);
    });

    // Populate Right column slots: [Slot] [Label]
    rightSlots.forEach(slot => {
        const itemId = hero.equipment[slot];
        const slotRow = document.createElement("div");
        slotRow.style.cssText = "display: flex; align-items: center; justify-content: flex-start; gap: 8px; width: 100%; height: 46px;";
        
        let slotHtml = "";
        if (itemId) {
            const item = ITEM_DATABASE[itemId];
            slotHtml = `
                <div class="eq-slot equipped" onclick="unequipItem('${hero.id}', '${slot}')" title="Unequip [${item.name}]" style="width: 42px; height: 42px; margin:0;">
                    <span class="slot-icon">${item.icon}</span>
                    <div class="item-glow rarity-glow-${item.rarity}"></div>
                </div>
            `;
        } else {
            slotHtml = `
                <div class="eq-slot" onclick="openEquipSlotModal('${hero.id}', '${slot}')" title="Equip ${slot}" style="width: 42px; height: 42px; margin:0;">
                    <span class="slot-icon" style="opacity:0.3;">${getSlotIconPlaceholder(slot)}</span>
                </div>
            `;
        }

        slotRow.innerHTML = `
            ${slotHtml}
            <span style="font-size: 0.65rem; color: var(--wow-text-muted); text-transform: uppercase; font-weight: bold; text-shadow: 1px 1px #000;">${slot}</span>
        `;
        rightContainer.appendChild(slotRow);
    });

    // Populate Bottom row slots spaced horizontally under center doll
    bottomSlots.forEach(slot => {
        const itemId = hero.equipment[slot];
        const slotBox = document.createElement("div");
        slotBox.style.cssText = "display: flex; flex-direction: column; align-items: center; gap: 4px; width: 64px;";
        
        let slotHtml = "";
        if (itemId) {
            const item = ITEM_DATABASE[itemId];
            slotHtml = `
                <div class="eq-slot equipped" onclick="unequipItem('${hero.id}', '${slot}')" title="Unequip [${item.name}]" style="width: 46px; height: 46px; margin:0;">
                    <span class="slot-icon">${item.icon}</span>
                    <div class="item-glow rarity-glow-${item.rarity}"></div>
                </div>
            `;
        } else {
            slotHtml = `
                <div class="eq-slot" onclick="openEquipSlotModal('${hero.id}', '${slot}')" title="Equip ${slot}" style="width: 46px; height: 46px; margin:0;">
                    <span class="slot-icon" style="opacity:0.3;">${getSlotIconPlaceholder(slot)}</span>
                </div>
            `;
        }

        slotBox.innerHTML = `
            ${slotHtml}
            <span style="font-size: 0.62rem; color: var(--wow-text-muted); text-transform: uppercase; font-weight: bold; text-align: center; text-shadow: 1px 1px #000;">${slot}</span>
        `;
        bottomContainer.appendChild(slotBox);
    });

    // Show character sheet modal popup
    openModal("modal-hero-equipment");
}

function equipItem(heroId, slot, itemId) {
    const hero = gameState.heroes.find(h => h.id === heroId);
    if (!hero) return;

    // Deduct from bag
    addInventory(itemId, -1);
    
    // Equip onto hero (if already equipped, unequip first - handled below)
    hero.equipment[slot] = itemId;

    closeModal("modal-select-equip");
    renderHeroes();
    renderInventory();
    pushBarrensChat("Guild Coordinator", `Equipped [${ITEM_DATABASE[itemId].name}] onto ${hero.name}.`);

    // Dynamic auto-refresh of character paper doll if active!
    if (selectedEquipHeroId) {
        openEquipModal(selectedEquipHeroId);
    }
}

function unequipItem(heroId, slot) {
    const hero = gameState.heroes.find(h => h.id === heroId);
    if (!hero) return;

    const itemId = hero.equipment[slot];
    if (!itemId) return;

    // Check inventory capacity
    const filled = getInventoryFilledSlots();
    if (filled >= gameState.settings.maxBagSlots) {
        alert("Bags are full! Clear some inventory slots before unequipping gear.");
        return;
    }

    // Add back to inventory
    addInventory(itemId, 1);
    hero.equipment[slot] = null;

    renderHeroes();
    renderInventory();
    pushBarrensChat("Guild Coordinator", `Unequipped [${ITEM_DATABASE[itemId].name}] from ${hero.name}.`);

    // Dynamic auto-refresh of character paper doll if active!
    if (selectedEquipHeroId) {
        openEquipModal(selectedEquipHeroId);
    }
}

function openItemDetailsModal(itemId) {
    selectedInventorySlot = itemId;
    const item = ITEM_DATABASE[itemId];
    
    const nameEl = document.getElementById("item-details-name");
    nameEl.innerText = `[${item.name}]`;
    nameEl.className = `text-rarity-${item.rarity}`;
    
    document.getElementById("item-details-type").innerText = item.type;
    document.getElementById("item-details-price").innerText = parseCoins(item.price);
    
    let statsHtml = "";
    if (item.stats) {
        for (let s in item.stats) {
            statsHtml += `<div>+${item.stats[s]} ${s.toUpperCase()}</div>`;
        }
    } else if (item.desc) {
        statsHtml = `<div>${item.desc}</div>`;
    } else {
        statsHtml = `<div>Gathering Component</div>`;
    }
    
    document.getElementById("item-details-stats").innerHTML = statsHtml;
    
    // Configure button options
    const actBtn = document.getElementById("item-details-action-btn");
    if (item.type === "potion") {
        actBtn.innerText = "Consume Potion";
        actBtn.onclick = () => openPotionConsumeModal(itemId);
    } else {
        actBtn.innerText = "Sell Directly";
        actBtn.onclick = () => sellItemDirect();
    }
    
    openModal("modal-item-details");
}

function openPotionConsumeModal(potionId) {
    closeModal("modal-item-details");
    
    // Pick hero to heal
    const container = document.getElementById("dispatch-hero-options");
    container.innerHTML = "";

    const heroes = gameState.heroes;
    heroes.forEach(hero => {
        const stats = getHeroFullStats(hero);
        const opt = document.createElement("div");
        opt.className = "hero-card";
        opt.style.cursor = "pointer";
        opt.style.marginBottom = "5px";
        opt.onclick = () => consumePotion(hero.id, potionId);

        opt.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="color:var(--wow-text-gold);">${hero.name}</strong> 
                    <span style="font-size:0.75rem; color:var(--wow-text-muted);">Lvl ${hero.level} ${hero.class}</span>
                </div>
                <div style="font-size:0.8rem;">❤️ HP: ${hero.hp} / ${stats.hp}</div>
            </div>
        `;
        container.appendChild(opt);
    });

    // repurpose the dispatch modal temporarily
    document.querySelector("#modal-select-hero-dispatch h3").innerText = "Select Potion Target";
    openModal("modal-select-hero-dispatch");
}

function consumePotion(heroId, potionId) {
    const hero = gameState.heroes.find(h => h.id === heroId);
    if (!hero) return;

    const item = ITEM_DATABASE[potionId];
    if (!item) return;

    if (potionId === "minor_healing_potion" || potionId === "major_healing_potion") {
        const healAmt = potionId === "minor_healing_potion" ? 50 : 250;
        const max = getHeroFullStats(hero).hp;
        hero.hp = Math.min(max, hero.hp + healAmt);
        
        addInventory(potionId, -1);
        pushBarrensChat("Alchemy Shop", `Administered RESTORATIVE potion to ${hero.name}. Restored +${healAmt} HP.`);
    }

    closeModal("modal-select-hero-dispatch");
    document.querySelector("#modal-select-hero-dispatch h3").innerText = "Select Dispatch Hero"; // reset title
    renderHeroes();
    renderInventory();
}

// --- WASTES MEMES CHAT SYSTEM ---

function pushWastesChat(user, text) {
    const container = document.getElementById("wastes-chat-log");
    const msg = document.createElement("div");
    msg.className = "chat-message";
    msg.innerHTML = `
        <span class="chat-channel">[1. General - Wastes]</span> 
        <span class="chat-user">${user}</span>: 
        <span class="chat-text">${text}</span>
    `;
    container.appendChild(msg);

    // Auto scroll to bottom
    container.scrollTop = container.scrollHeight;
    
    // limit messages on screen
    const messages = container.querySelectorAll(".chat-message");
    if (messages.length > 25) {
        messages[0].remove();
    }
}

function wastesChatTick() {
    const meme = WASTES_CHAT_MEMES[Math.floor(Math.random() * WASTES_CHAT_MEMES.length)];
    pushWastesChat(meme.user, meme.text);
}

// Backward compatibility alias for the game engine
const pushBarrensChat = pushWastesChat;

// --- HERO TALENTS & SKILLS SELECTION ---

let selectedSkillsHeroId = null;
let temporarySkillsSetup = [null, null, null, null, null];
let activeSkillsSelectedSlotIndex = 0;

function openSkillsModal(heroId) {
    const hero = gameState.heroes.find(h => h.id === heroId);
    if (!hero) return;

    selectedSkillsHeroId = heroId;
    temporarySkillsSetup = [...hero.skills];
    activeSkillsSelectedSlotIndex = 0; // default select Turn 1

    document.getElementById("skills-hero-icon").innerText = CLASS_DATABASE[hero.class].classIcon;
    document.getElementById("skills-hero-name").innerText = hero.name;
    document.getElementById("skills-hero-class-level").innerText = `Level ${hero.level} ${hero.class}`;

    renderSkillsModalContent();
    openModal("modal-hero-skills");
}

function renderSkillsModalContent() {
    const hero = gameState.heroes.find(h => h.id === selectedSkillsHeroId);
    if (!hero) return;

    const maxAp = getHeroMaxAp(hero);
    const db = SKILL_DATABASE[hero.class] || [];

    // Unlocked skills list
    const unlockedList = document.getElementById("skills-unlocked-list");
    unlockedList.innerHTML = "";

    // Always append Basic Attack
    const basicCard = createSkillCard(BASIC_ATTACK_SKILL, true, () => assignSkillToSelectedSlot(null));
    unlockedList.appendChild(basicCard);

    db.forEach(skill => {
        const isUnlocked = hero.level >= skill.levelReq;
        const card = createSkillCard(skill, isUnlocked, () => {
            if (isUnlocked) {
                assignSkillToSelectedSlot(skill.id);
            }
        });
        unlockedList.appendChild(card);
    });

    // Render Slots on the right
    const rotationSlots = document.getElementById("skills-rotation-slots");
    rotationSlots.innerHTML = "";

    let currentUsedAp = 0;

    for (let i = 0; i < 5; i++) {
        const skillId = temporarySkillsSetup[i];
        let skill = BASIC_ATTACK_SKILL;
        if (skillId) {
            skill = db.find(s => s.id === skillId) || BASIC_ATTACK_SKILL;
        }

        currentUsedAp += skill.cost;

        const slotRow = document.createElement("div");
        slotRow.className = `skill-slot-row ${activeSkillsSelectedSlotIndex === i ? 'active' : ''}`;
        slotRow.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-radius: 4px;
            background: ${activeSkillsSelectedSlotIndex === i ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0,0,0,0.3)'};
            border: 1px solid ${activeSkillsSelectedSlotIndex === i ? 'var(--wow-border-gold)' : 'rgba(255,255,255,0.05)'};
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        
        slotRow.onclick = () => {
            activeSkillsSelectedSlotIndex = i;
            renderSkillsModalContent();
        };

        slotRow.innerHTML = `
            <div style="font-size: 0.75rem; width: 45px; color: var(--wow-text-muted);">Turn ${i + 1}:</div>
            <div style="font-size: 1.25rem;">${skill.icon}</div>
            <div style="flex: 1;">
                <div style="font-size: 0.85rem; font-weight: bold; color: var(--wow-text-gold);">${skill.name}</div>
                <div style="font-size: 0.7rem; color: #a5b4fc;">${skill.cost > 0 ? skill.cost + ' AP' : 'Free'}</div>
            </div>
            ${skillId ? `<button onclick="event.stopPropagation(); removeSkillFromSlot(${i});" style="background:none; border:none; color:#ef4444; font-size:1.1rem; cursor:pointer;">&times;</button>` : ''}
        `;
        rotationSlots.appendChild(slotRow);
    }

    // Update AP Ratio & Progress bar
    document.getElementById("skills-ap-ratio").innerText = `${currentUsedAp} / ${maxAp} AP`;
    const fillPercent = Math.min((currentUsedAp / maxAp) * 100, 100);
    const barFill = document.getElementById("skills-ap-bar-fill");
    barFill.style.width = `${fillPercent}%`;

    const validationMsg = document.getElementById("skills-validation-msg");
    const saveBtn = document.getElementById("skills-save-btn");

    if (currentUsedAp > maxAp) {
        barFill.style.background = "linear-gradient(to right, #ef4444, #b91c1c)";
        validationMsg.style.display = "inline-block";
        validationMsg.innerText = `⚠️ AP limit exceeded! (${currentUsedAp} / ${maxAp})`;
        saveBtn.disabled = true;
        saveBtn.style.opacity = "0.5";
    } else {
        barFill.style.background = "linear-gradient(to right, #fbbf24, #d97706)";
        validationMsg.style.display = "none";
        saveBtn.disabled = false;
        saveBtn.style.opacity = "1";
    }
}

function createSkillCard(skill, isUnlocked, onClick) {
    const card = document.createElement("div");
    card.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        border-radius: 4px;
        background: rgba(0,0,0,0.25);
        border: 1px solid ${isUnlocked ? 'rgba(255,255,255,0.08)' : 'rgba(239, 68, 68, 0.15)'};
        opacity: ${isUnlocked ? '1' : '0.5'};
        cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};
        transition: all 0.2s ease;
    `;
    if (isUnlocked) {
        card.onmouseenter = () => card.style.borderColor = "var(--wow-border-gold)";
        card.onmouseleave = () => card.style.borderColor = "rgba(255,255,255,0.08)";
        card.onclick = onClick;
    }

    card.innerHTML = `
        <div style="font-size: 1.8rem; background: rgba(0,0,0,0.4); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 4px; border: 1px solid rgba(255,215,0,0.1);">${skill.icon}</div>
        <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <strong style="font-size: 0.85rem; color: ${isUnlocked ? 'var(--wow-text-gold)' : 'var(--wow-text-muted)'};">${skill.name}</strong>
                <span style="font-size: 0.75rem; color: #a5b4fc;">${skill.cost > 0 ? skill.cost + ' AP' : 'Free'}</span>
            </div>
            <div style="font-size: 0.75rem; color: #d1d5db; margin-top: 2px;">${skill.desc}</div>
            ${!isUnlocked ? `<div style="font-size: 0.65rem; color: #ef4444; font-weight: bold; margin-top: 2px;">Requires Level ${skill.levelReq}</div>` : ''}
        </div>
    `;
    return card;
}

function assignSkillToSelectedSlot(skillId) {
    if (activeSkillsSelectedSlotIndex === null) return;
    temporarySkillsSetup[activeSkillsSelectedSlotIndex] = skillId;
    // Auto-advance to next slot to make assigning smooth!
    activeSkillsSelectedSlotIndex = (activeSkillsSelectedSlotIndex + 1) % 5;
    renderSkillsModalContent();
}

function removeSkillFromSlot(slotIndex) {
    temporarySkillsSetup[slotIndex] = null;
    renderSkillsModalContent();
}

function saveHeroSkills() {
    if (!selectedSkillsHeroId) return;
    const hero = gameState.heroes.find(h => h.id === selectedSkillsHeroId);
    if (!hero) return;

    hero.skills = [...temporarySkillsSetup];
    saveGame();
    renderHeroes();
    closeModal("modal-hero-skills");
    pushBarrensChat("Guild Coordinator", `Saved new skill rotation layout for ${hero.name}!`);
}

// --- REPEAT LAST DISPATCH QUALITY-OF-LIFE FEATURE ---

function renderRepeatButton() {
    const btn = document.getElementById("btn-repeat-last-quest");
    if (!btn) return;

    if (!gameState.lastDispatch) {
        btn.style.display = "none";
        return;
    }

    // Show the button
    btn.style.display = "inline-block";

    // Verify if all heroes from the last group are Idle
    let allIdle = true;
    let busyHeroNames = [];

    gameState.lastDispatch.heroIds.forEach(id => {
        const h = gameState.heroes.find(hero => hero.id === id);
        if (!h || h.status !== "Idle") {
            allIdle = false;
            if (h) busyHeroNames.push(h.name);
        }
    });

    if (allIdle) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerText = "🔁 Repeat Last Dispatch";
    } else {
        btn.disabled = false; // We keep it clickable to show an alert explaining who is busy/dead!
        btn.style.opacity = "0.5";
        btn.innerText = `🔁 Repeat Last (${busyHeroNames.join(", ")} Busy)`;
    }
}

function repeatLastQuest() {
    if (!gameState.lastDispatch) return;

    const dispatch = gameState.lastDispatch;
    
    // Check if any hero is busy or dead
    let busyHeroes = [];
    dispatch.heroIds.forEach(id => {
        const h = gameState.heroes.find(hero => hero.id === id);
        if (!h) {
            busyHeroes.push(`Unknown Hero`);
        } else if (h.status !== "Idle") {
            busyHeroes.push(`${h.name} is ${h.status}`);
        }
    });

    if (busyHeroes.length > 0) {
        alert(`Cannot repeat last dispatch! The following heroes are currently busy or dead:\n- ${busyHeroes.join("\n- ")}`);
        return;
    }

    // Launch quest!
    startQuest(dispatch.heroIds, dispatch.enemyId, dispatch.zoneId);
    pushBarrensChat("Guild Coordinator", "Re-dispatched the last group to the same adventure!");
}

// --- BATTLE VISUAL REPLAY ENGINE & CONTROLLER ---

let currentReplayPackage = null;
let currentReplayStep = 0;
let replayIntervalId = null;
let replaySpeedMultiplier = 1;

function startBattleReplay(questId) {
    const quest = gameState.activeQuests.find(q => q.id === questId);
    if (!quest) return;

    // Use pre-simulated combat replay if available for full determinism
    const replay = quest.replay || resolveCombat(quest);
    if (!replay) return;

    currentReplayPackage = replay;
    currentReplayStep = 0;
    replaySpeedMultiplier = 1;

    // Reset Console log
    const consoleEl = document.getElementById("battle-report-console");
    if (consoleEl) {
        consoleEl.innerHTML = "";
    }

    // Set Title
    const zone = ZONE_DATABASE.find(z => z.id === quest.zoneId);
    const titleText = `⚔️ Battle Report: ${zone ? zone.name : "Unknown Zone"} - ${replay.enemyName}`;
    document.getElementById("battle-report-title").innerText = titleText;

    // Configure Replay Buttons
    const speedBtn = document.getElementById("battle-speed-btn");
    if (speedBtn) {
        speedBtn.disabled = false;
        speedBtn.innerText = "Speed: 1x";
    }

    const skipBtn = document.getElementById("battle-skip-btn");
    if (skipBtn) {
        skipBtn.disabled = false;
        skipBtn.style.display = "inline-block";
    }

    const closeXBtn = document.getElementById("battle-close-x-btn");
    if (closeXBtn) {
        closeXBtn.disabled = true;
    }

    // Hide Loot panel & Collection close button
    const lootPanel = document.getElementById("battle-loot-panel");
    if (lootPanel) {
        lootPanel.style.display = "none";
    }

    const completeBtn = document.getElementById("battle-complete-btn");
    if (completeBtn) {
        completeBtn.style.display = "none";
    }

    const progressMsg = document.getElementById("battle-progress-msg");
    if (progressMsg) {
        progressMsg.style.display = "inline-block";
        progressMsg.innerText = "⚔️ Combat Replay Ongoing...";
    }

    // Enemy target card details
    document.getElementById("battle-enemy-name").innerText = replay.enemyName;
    document.getElementById("battle-enemy-level").innerText = `Lv. ${replay.enemyLevel} Elite`;
    document.getElementById("battle-enemy-icon").innerText = replay.enemyIcon;
    document.getElementById("battle-enemy-hp-txt").innerText = `${replay.enemyMaxHp} / ${replay.enemyMaxHp}`;
    document.getElementById("battle-enemy-hp-bar").style.width = "100%";

    // Set up participating heroes cards
    const heroesContainer = document.getElementById("battle-heroes-container");
    if (heroesContainer) {
        heroesContainer.innerHTML = `<h4 style="color: var(--wow-text-gold); margin: 0 0 5px 0; border-bottom: 1px solid rgba(255,215,0,0.1); padding-bottom: 4px; font-size: 0.85rem; text-transform: uppercase;">Guild Party</h4>`;
        
        replay.activeHeroes.forEach(hero => {
            const card = document.createElement("div");
            card.className = "battle-hero-card";
            card.id = `battle-hero-card-${hero.id}`;
            card.style.cssText = `
                padding: 10px;
                border-radius: 4px;
                background: rgba(12,13,17,0.7);
                display: flex;
                flex-direction: column;
                gap: 6px;
                border: 1px solid rgba(255,255,255,0.05);
                position: relative;
                transition: all 0.2s ease-in-out;
            `;

            card.innerHTML = `
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span style="font-size: 1.8rem; background: rgba(0,0,0,0.3); border-radius: 4px; padding: 4px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,215,0,0.15);">${CLASS_DATABASE[hero.class].classIcon}</span>
                    <div style="flex: 1; text-align: left;">
                        <div style="font-size: 0.85rem; font-weight: bold; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;" title="${hero.name}">${hero.name}</div>
                        <div style="font-size: 0.7rem; color: #a5b4fc;">Lv. ${hero.level} ${hero.class}</div>
                    </div>
                </div>
                <div style="width: 100%;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 2px;">
                        <span>Health:</span>
                        <strong id="battle-hero-hp-txt-${hero.id}">${hero.hp} / ${hero.hp}</strong>
                    </div>
                    <div class="progress-container" style="height: 10px; position: relative; background: rgba(0,0,0,0.5);">
                        <div class="progress-bar hp" id="battle-hero-hp-bar-${hero.id}" style="width: 100%; background-color: var(--bar-hp); transition: width 0.15s ease-out; height: 100%;"></div>
                        <div class="progress-bar shield" id="battle-hero-shield-bar-${hero.id}" style="width: 0%; background-color: #38bdf8; transition: width 0.15s ease-out; height: 100%; position: absolute; top: 0; left: 0; opacity: 0.7;"></div>
                    </div>
                </div>
            `;
            heroesContainer.appendChild(card);
        });
    }

    // Open Modal
    openModal("modal-battle-report");

    // Clear and start replay loop
    if (replayIntervalId) clearTimeout(replayIntervalId);
    
    // Render introductory step 0
    renderReplayStep(0);
    currentReplayStep = 1;

    // Tick starting after a short delay
    replayIntervalId = setTimeout(tickReplay, 1000);
}

function tickReplay() {
    if (!currentReplayPackage) return;

    if (currentReplayStep >= currentReplayPackage.events.length) {
        endReplay();
        return;
    }

    renderReplayStep(currentReplayStep);
    currentReplayStep++;

    const delay = replaySpeedMultiplier === 2 ? 300 : 1000;
    replayIntervalId = setTimeout(tickReplay, delay);
}

function renderReplayStep(stepIndex) {
    const replay = currentReplayPackage;
    if (!replay || stepIndex < 0 || stepIndex >= replay.events.length) return;

    const event = replay.events[stepIndex];
    if (!event) return;

    // 1. Append typewriter console log line
    const consoleEl = document.getElementById("battle-report-console");
    if (consoleEl) {
        const lineEl = document.createElement("div");
        lineEl.className = "battle-console-line";
        lineEl.style.marginBottom = "4px";

        // Styling by event content
        const text = event.text;
        if (text.includes("Victory!")) {
            lineEl.style.color = "#22c55e";
            lineEl.style.fontWeight = "bold";
            lineEl.style.fontSize = "0.9rem";
        } else if (text.includes("Defeat!")) {
            lineEl.style.color = "#ef4444";
            lineEl.style.fontWeight = "bold";
            lineEl.style.fontSize = "0.9rem";
        } else if (text.includes("LEVEL UP!")) {
            lineEl.style.color = "#fbbf24";
            lineEl.style.fontWeight = "bold";
        } else if (text.includes("CRITICAL")) {
            lineEl.style.color = "#f97316";
        } else if (text.includes("heals") || text.includes("restores") || text.includes("Renew")) {
            lineEl.style.color = "#4ade80";
        } else if (text.includes("absorbs") || text.includes("Shield")) {
            lineEl.style.color = "#38bdf8";
        } else if (text.includes("💀")) {
            lineEl.style.color = "#b91c1c";
        } else if (text.startsWith("Turn")) {
            lineEl.style.color = "#e2e8f0";
        } else {
            lineEl.style.color = "#94a3b8";
        }

        lineEl.innerText = text;
        consoleEl.appendChild(lineEl);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    // 2. Update Enemy HP
    const enemyHp = Math.max(0, event.enemyHp);
    const enemyMaxHp = replay.enemyMaxHp;
    const enemyPct = (enemyHp / enemyMaxHp) * 100;
    
    const enemyHpBar = document.getElementById("battle-enemy-hp-bar");
    if (enemyHpBar) {
        enemyHpBar.style.width = `${enemyPct}%`;
    }
    const enemyHpTxt = document.getElementById("battle-enemy-hp-txt");
    if (enemyHpTxt) {
        enemyHpTxt.innerText = `${enemyHp} / ${enemyMaxHp}`;
    }

    // 3. Update Heroes HP and Shields
    replay.activeHeroes.forEach(hero => {
        const hpVal = event.heroHps && event.heroHps[hero.id] !== undefined ? event.heroHps[hero.id] : hero.hp;
        const shieldVal = event.heroShields && event.heroShields[hero.id] !== undefined ? event.heroShields[hero.id] : 0;
        const maxHp = hero.hp;
        const hpPct = Math.max(0, (hpVal / maxHp) * 100);

        const hpBar = document.getElementById(`battle-hero-hp-bar-${hero.id}`);
        if (hpBar) {
            hpBar.style.width = `${hpPct}%`;
        }

        const hpTxt = document.getElementById(`battle-hero-hp-txt-${hero.id}`);
        if (hpTxt) {
            hpTxt.innerText = `${Math.max(0, hpVal)} / ${maxHp}`;
        }

        const shieldBar = document.getElementById(`battle-hero-shield-bar-${hero.id}`);
        if (shieldBar) {
            const shieldPct = Math.min(100, (shieldVal / maxHp) * 100);
            shieldBar.style.width = `${shieldPct}%`;
        }
    });

    // 4. Trigger visual flashes on hits and heals
    if (event.activeDmgTarget) {
        if (event.activeDmgTarget === "enemy") {
            triggerFlash("battle-enemy-card", "hit-flash");
        } else if (event.activeDmgTarget === "all") {
            replay.activeHeroes.forEach(hero => {
                triggerFlash(`battle-hero-card-${hero.id}`, "hit-flash");
            });
        } else {
            triggerFlash(`battle-hero-card-${event.activeDmgTarget}`, "hit-flash");
        }
    }

    if (event.activeHealTarget) {
        if (event.activeHealTarget === "enemy") {
            triggerFlash("battle-enemy-card", "heal-flash");
        } else if (event.activeHealTarget === "all") {
            replay.activeHeroes.forEach(hero => {
                triggerFlash(`battle-hero-card-${hero.id}`, "heal-flash");
            });
        } else {
            triggerFlash(`battle-hero-card-${event.activeHealTarget}`, "heal-flash");
        }
    }
}

function triggerFlash(elementId, className) {
    const el = document.getElementById(elementId);
    if (el) {
        el.classList.remove("hit-flash", "heal-flash");
        void el.offsetWidth; // Force DOM reflow to restart animation
        el.classList.add(className);
    }
}

function toggleReplaySpeed() {
    replaySpeedMultiplier = replaySpeedMultiplier === 1 ? 2 : 1;
    const speedBtn = document.getElementById("battle-speed-btn");
    if (speedBtn) {
        speedBtn.innerText = `Speed: ${replaySpeedMultiplier}x`;
    }
}

function skipReplay() {
    if (replayIntervalId) clearTimeout(replayIntervalId);
    if (!currentReplayPackage) return;

    // Fast-forward remaining step animations instantly
    for (let i = currentReplayStep; i < currentReplayPackage.events.length; i++) {
        renderReplayStep(i);
    }

    currentReplayStep = currentReplayPackage.events.length;
    endReplay();
}

function endReplay() {
    if (replayIntervalId) clearTimeout(replayIntervalId);

    const replay = currentReplayPackage;
    if (!replay) return;

    // Configure Replay Buttons
    const speedBtn = document.getElementById("battle-speed-btn");
    if (speedBtn) speedBtn.disabled = true;

    const skipBtn = document.getElementById("battle-skip-btn");
    if (skipBtn) {
        skipBtn.disabled = true;
        skipBtn.style.display = "none";
    }

    const closeXBtn = document.getElementById("battle-close-x-btn");
    if (closeXBtn) closeXBtn.disabled = false;

    const progressMsg = document.getElementById("battle-progress-msg");
    if (progressMsg) progressMsg.style.display = "none";

    // Set Outcome Title & Banner
    const medalEl = document.getElementById("battle-outcome-medal");
    const titleEl = document.getElementById("battle-outcome-title");
    
    if (replay.won) {
        if (medalEl) medalEl.innerText = "🏆";
        if (titleEl) {
            titleEl.innerText = "VICTORY";
            titleEl.style.color = "var(--wow-text-gold)";
        }
        document.getElementById("battle-loot-gold").innerText = parseCoins(replay.copperEarned);
    } else {
        if (medalEl) medalEl.innerText = "💀";
        if (titleEl) {
            titleEl.innerText = "DEFEAT";
            titleEl.style.color = "#ef4444";
        }
        document.getElementById("battle-loot-gold").innerText = "0c (No Loot)";
    }

    // Populate loot drops grid
    const lootItemsContainer = document.getElementById("battle-loot-items");
    if (lootItemsContainer) {
        lootItemsContainer.innerHTML = "";
        
        if (replay.won && replay.lootDropped && replay.lootDropped.length > 0) {
            replay.lootDropped.forEach(drop => {
                const item = ITEM_DATABASE[drop.itemId];
                if (item) {
                    const itemEl = document.createElement("div");
                    itemEl.className = "eq-slot equipped";
                    itemEl.style.cssText = "cursor: default; position: relative;";
                    itemEl.title = `Looted [${item.name}] x${drop.quantity}`;
                    itemEl.innerHTML = `
                        <span class="slot-icon">${item.icon}</span>
                        <div class="item-glow rarity-glow-${item.rarity}"></div>
                        <span style="position: absolute; bottom: 2px; right: 4px; font-size: 0.75rem; color: #fff; font-weight: bold; text-shadow: 1px 1px 2px #000; font-family: monospace;">x${drop.quantity}</span>
                    `;
                    lootItemsContainer.appendChild(itemEl);
                }
            });
        } else {
            lootItemsContainer.innerHTML = `<span style="font-size:0.75rem; color:var(--wow-text-muted);">${replay.won ? "No loot dropped." : "Defeated adventurers gather no materials."}</span>`;
        }
    }

    // Show loot panel & complete closing button
    document.getElementById("battle-loot-panel").style.display = "block";
    document.getElementById("battle-complete-btn").style.display = "block";
}

function closeBattleReport() {
    if (replayIntervalId) clearTimeout(replayIntervalId);

    const replay = currentReplayPackage;
    if (replay) {
        // 1. Commit and apply all final hero HP/level/XP updates
        for (const id in replay.finalHeroStates) {
            const state = replay.finalHeroStates[id];
            const hero = gameState.heroes.find(h => h.id === id);
            if (hero) {
                hero.hp = Math.round(state.hp);
                hero.status = state.status;
                hero.xp = state.xp;
                hero.level = state.level;
                hero.max_xp = state.max_xp;
            }
        }

        // 2. Award copper and item loot
        if (replay.won) {
            // Track defeated enemy for dungeon/raid unlocks
            if (replay.enemyId && !gameState.defeatedEnemies.includes(replay.enemyId)) {
                gameState.defeatedEnemies.push(replay.enemyId);
            }
            if (replay.enemyId) {
                if (!gameState.enemyStats[replay.enemyId]) {
                    gameState.enemyStats[replay.enemyId] = { kills: 0, deaths: 0 };
                }
                gameState.enemyStats[replay.enemyId].kills++;
            }

            if (replay.copperEarned > 0) {
                addGold(replay.copperEarned);
                pushBarrensChat("Guild Master", `Looted ${parseCoins(replay.copperEarned)} from ${replay.enemyName}!`);
            }

            if (replay.lootDropped && replay.lootDropped.length > 0) {
                replay.lootDropped.forEach(drop => {
                    addInventory(drop.itemId, drop.quantity);
                    const item = ITEM_DATABASE[drop.itemId];
                    if (item) {
                        pushBarrensChat("Guild Coordinator", `Acquired loot: [${item.name}] x${drop.quantity}`);
                    }
                });
            }
        } else {
            if (replay.enemyId) {
                if (!gameState.enemyStats[replay.enemyId]) {
                    gameState.enemyStats[replay.enemyId] = { kills: 0, deaths: 0 };
                }
                gameState.enemyStats[replay.enemyId].deaths++;
            }
        }

        // 3. Remove completed quest from activeQuests array
        gameState.activeQuests = gameState.activeQuests.filter(q => q.id !== replay.questId);

        // 4. Save game to local storage
        saveGame();

        // 5. Re-render affected game elements
        renderHeroes();
        renderActiveQuestsSidebar();
        renderRepeatButton();
    }

    // 6. Close Modal
    closeModal("modal-battle-report");

    currentReplayPackage = null;
}

function quickCollectQuestRewards(questId) {
    const quest = gameState.activeQuests.find(q => q.id === questId);
    if (!quest) return;

    // Use pre-simulated combat replay if available for full determinism
    const replay = quest.replay || resolveCombat(quest);
    if (!replay) return;

    // 1. Commit and apply all final hero HP/level/XP updates
    for (const id in replay.finalHeroStates) {
        const state = replay.finalHeroStates[id];
        const hero = gameState.heroes.find(h => h.id === id);
        if (hero) {
            const oldLevel = hero.level;
            hero.hp = Math.round(state.hp);
            hero.status = state.status;
            hero.xp = state.xp;
            hero.level = state.level;
            hero.max_xp = state.max_xp;

            if (replay.won) {
                pushBarrensChat("Guild Coordinator", `${hero.name} gained +${replay.xpEarned} XP.`);
                if (hero.level > oldLevel) {
                    pushBarrensChat("Guild Master", `🌟 LEVEL UP! ${hero.name} reached level ${hero.level}!`);
                }
            }
        }
    }

    // 2. Award copper and item loot
    if (replay.won) {
        // Track defeated enemy for dungeon/raid unlocks
        if (replay.enemyId && !gameState.defeatedEnemies.includes(replay.enemyId)) {
            gameState.defeatedEnemies.push(replay.enemyId);
        }
        if (replay.enemyId) {
            if (!gameState.enemyStats[replay.enemyId]) {
                gameState.enemyStats[replay.enemyId] = { kills: 0, deaths: 0 };
            }
            gameState.enemyStats[replay.enemyId].kills++;
        }

        pushBarrensChat("Guild Coordinator", `🏆 VICTORY over ${replay.enemyName}!`);
        if (replay.copperEarned > 0) {
            addGold(replay.copperEarned);
            pushBarrensChat("Guild Master", `Looted ${parseCoins(replay.copperEarned)} from ${replay.enemyName}!`);
        }

        if (replay.lootDropped && replay.lootDropped.length > 0) {
            replay.lootDropped.forEach(drop => {
                addInventory(drop.itemId, drop.quantity);
                const item = ITEM_DATABASE[drop.itemId];
                if (item) {
                    pushBarrensChat("Guild Coordinator", `Acquired loot: [${item.name}] x${drop.quantity}`);
                }
            });
        }
    } else {
        if (replay.enemyId) {
            if (!gameState.enemyStats[replay.enemyId]) {
                gameState.enemyStats[replay.enemyId] = { kills: 0, deaths: 0 };
            }
            gameState.enemyStats[replay.enemyId].deaths++;
        }
        pushBarrensChat("Guild Coordinator", `💀 DEFEAT! Group wiped against ${replay.enemyName}.`);
    }

    // 4. Remove completed quest from activeQuests array
    gameState.activeQuests = gameState.activeQuests.filter(q => q.id !== questId);

    // 5. Save game to local storage
    saveGame();

    // 6. Re-render affected game elements
    renderHeroes();
    renderActiveQuestsSidebar();
    renderRepeatButton();
}

function quickLootAndRerun(questId) {
    const quest = gameState.activeQuests.find(q => q.id === questId);
    if (!quest) return;

    const heroIds = [...quest.heroIds];
    const enemyId = quest.enemyId;
    const zoneId = quest.zoneId;

    // 1. Loot the quest
    quickCollectQuestRewards(questId);

    // 2. Check if all heroes from the group are alive and idle (ready for dispatch)
    const readyHeroIds = heroIds.filter(id => {
        const h = gameState.heroes.find(hero => hero.id === id);
        return h && h.status === "Idle" && h.hp > 0;
    });

    if (readyHeroIds.length !== heroIds.length) {
        pushBarrensChat("Guild Coordinator", `⚠️ Cannot rerun automatically: some heroes died or are unavailable.`);
        return;
    }

    // 3. Re-dispatch the group
    startQuest(readyHeroIds, enemyId, zoneId);
    saveGame();
    pushBarrensChat("Guild Coordinator", `🔄 Looted & re-dispatched the group to ${ZONE_DATABASE.find(z => z.id === zoneId).name}!`);
}

// Run Initializations
window.onload = initGame;

// Export for Node.js testing environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CLASS_DATABASE,
        SKILL_DATABASE,
        ENEMY_ROTATIONS_DATABASE,
        ITEM_DATABASE,
        ZONE_DATABASE,
        RECIPE_DATABASE,
        WASTES_CHAT_MEMES,
        CUSTOMER_NAMES,
        gameState,
        parseCoins,
        createHero,
        addInventory,
        getInventoryFilledSlots,
        resolveCombat,
        generateCustomerOffer,
        craftItem,
        loadGame,
        saveGame,
        resetGame,
        initGame,
        gameTick,
        updateQuests,
        wastesChatTick,
        pushWastesChat,
        ITEM_ID_MIGRATIONS,
        openModal,
        closeModal,
        switchTab,
        switchProfession,
        renderHeroes,
        renderInventory,
        renderCustomers,
        renderActiveQuestsSidebar,
        renderZoneSelector,
        renderEnemyList,
        renderRepeatButton,
        sellItemDirect,
        fulfillOffer,
        declineOffer,
        equipItem,
        unequipItem,
        reviveHero,
        repeatLastQuest,
        quickCollectQuestRewards,
        quickLootAndRerun,
        saveHeroSkills,
        openItemDetailsModal,
        selectZone,
        openHireModal,
        confirmHireHero,
        openDispatchModal,
        openEquipSlotModal,
        openEquipModal,
        startQuest,
        getSlotIconPlaceholder
    };
}
