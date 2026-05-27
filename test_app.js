// ====================================================
// 🧪 WORLD OF WARCREST - Master JS Test Suite 🧪
// ====================================================

const createElementMock = (tag = 'div') => {
    const el = {
        tagName: tag.toUpperCase(),
        innerText: '',
        innerHTML: '',
        value: '',
        className: '',
        style: {},
        classList: {
            classes: new Set(),
            add: (c) => el.classList.classes.add(c),
            remove: (c) => el.classList.classes.delete(c),
            contains: (c) => el.classList.classes.has(c),
        },
        children: [],
        appendChild: (child) => {
            if (child) {
                el.children.push(child);
                el.innerHTML += child.innerHTML || child.innerText || '';
            }
        },
        remove: () => {},
        querySelectorAll: () => el.children.length ? el.children : [el],
        querySelector: (sel) => el.children.length ? el.children[0] : el,
        setAttribute: () => {},
        removeAttribute: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
    };
    return el;
};

const elementsCache = {};
const getElementMock = (id) => {
    if (!elementsCache[id]) {
        elementsCache[id] = createElementMock();
    }
    return elementsCache[id];
};

global.window = global;
global.document = {
    getElementById: getElementMock,
    createElement: createElementMock,
    querySelectorAll: () => [createElementMock()],
    querySelector: () => createElementMock(),
};
global.localStorage = {
    store: {},
    getItem: (key) => global.localStorage.store[key] || null,
    setItem: (key, val) => global.localStorage.store[key] = String(val),
    removeItem: (key) => delete global.localStorage.store[key],
};
global.alert = () => {};
global.confirm = () => true;
global.location = { reload: () => {} };
global.setInterval = () => {};

// --- Load app.js module ---
const app = require('./app.js');
const assert = require('node:assert');
const test = require('node:test');

// ====================================================
// 1. Core Formatting & Math Tests
// ====================================================

test('parseCoins handles various copper amounts correctly', () => {
    assert.strictEqual(app.parseCoins(5), '5c');
    assert.strictEqual(app.parseCoins(120), '1s 20c');
    assert.strictEqual(app.parseCoins(25000), '2g 50s');
    assert.strictEqual(app.parseCoins(12534), '1g 25s 34c');
    assert.strictEqual(app.parseCoins(0), '0c');
});

// ====================================================
// 2. Hero Generation Tests
// ====================================================

test('createHero sets correct class properties and stats', () => {
    const warrior = app.createHero('Thrallor', 'Warrior');
    assert.strictEqual(warrior.name, 'Thrallor');
    assert.strictEqual(warrior.class, 'Warrior');
    assert.strictEqual(warrior.level, 1);
    assert.strictEqual(warrior.xp, 0);
    assert.strictEqual(warrior.hp, app.CLASS_DATABASE.Warrior.baseHp);
    assert.strictEqual(warrior.max_hp, app.CLASS_DATABASE.Warrior.baseHp);
    assert.strictEqual(warrior.atk, app.CLASS_DATABASE.Warrior.baseAtk);

    const mage = app.createHero('Jina', 'Mage');
    assert.strictEqual(mage.class, 'Mage');
    assert.strictEqual(mage.hp, app.CLASS_DATABASE.Mage.baseHp);
    assert.strictEqual(mage.atk, app.CLASS_DATABASE.Mage.baseAtk);
});

// ====================================================
// 3. Inventory Management Tests
// ====================================================

test('Inventory capacity and addition/removal logic', () => {
    // Reset inventory state
    app.gameState.inventory = {};

    // Verify slots filled initially
    assert.strictEqual(app.getInventoryFilledSlots(), 0);

    // Add copper ore
    const added = app.addInventory('copper_ore', 3);
    assert.strictEqual(added, true);
    assert.strictEqual(app.getInventoryFilledSlots(), 1);
    assert.strictEqual(app.gameState.inventory['copper_ore'], 3);

    // Add more copper ore
    app.addInventory('copper_ore', 5);
    assert.strictEqual(app.gameState.inventory['copper_ore'], 8);

    // Remove some copper ore
    app.addInventory('copper_ore', -4);
    assert.strictEqual(app.gameState.inventory['copper_ore'], 4);

    // Remove all copper ore
    app.addInventory('copper_ore', -4);
    assert.strictEqual(app.gameState.inventory['copper_ore'], undefined);
    assert.strictEqual(app.getInventoryFilledSlots(), 0);
});

// ====================================================
// 4. Shopping & Customer Offers Tests
// ====================================================

test('generateCustomerOffer creates valid offers', () => {
    app.gameState.customers = [];

    // Trigger customer generator
    app.generateCustomerOffer();
    assert.strictEqual(app.gameState.customers.length, 1);

    const customer = app.gameState.customers[0];
    assert.ok(customer.id.startsWith('npc_'));
    assert.ok(app.CUSTOMER_NAMES.includes(customer.name));
    assert.ok(customer.price > 0);
    assert.ok(app.ITEM_DATABASE[customer.requestedItemId]);
});

// ====================================================
// 5. Retro Wastes General Chat Tests
// ====================================================

test('pushWastesChat and wastesChatTick logs memes successfully', () => {
    const chatLogContainer = getElementMock('wastes-chat-log');
    chatLogContainer.innerHTML = '';

    // Push system log
    app.pushWastesChat('System', 'Testing general logs');
    assert.ok(chatLogContainer.innerHTML.includes('System'));
    assert.ok(chatLogContainer.innerHTML.includes('Testing general logs'));

    // Trigger wastes tick
    app.wastesChatTick();
    // Verify an element has loaded
    assert.ok(chatLogContainer.innerHTML.includes('[1. General - Wastes]'));
});

// ====================================================
// 6. Save Systems & WoW Migration Tests
// ====================================================

test('loadGame translates legacy WoW item keys to parodied ones cleanly', () => {
    // Inject a simulated WoW-infected save structure inside mock localStorage
    const wowSave = {
        gold: 1000,
        inventory: {
            "hogger_claw": 2,
            "red_defias_mask": 1,
            "copper_ore": 10
        },
        heroes: [
            {
                id: "hero_test",
                name: "Luther",
                class: "Paladin",
                equipment: {
                    "weapon": "hoggers_slicer",
                    "secondary": "hoggers_champion_shield"
                }
            }
        ],
        customers: [
            {
                id: "npc_test",
                name: "Thrall",
                requestedItemId: "sulfuras_hand"
            }
        ]
    };

    localStorage.setItem("wow_warcrest_save", JSON.stringify(wowSave));

    // Reset game state and load
    app.loadGame();

    // Assertions for item keys translations
    assert.strictEqual(app.gameState.inventory["hogger_claw"], undefined);
    assert.strictEqual(app.gameState.inventory["ironpaw_claw"], 2);
    assert.strictEqual(app.gameState.inventory["red_defias_mask"], undefined);
    assert.strictEqual(app.gameState.inventory["red_outlaw_mask"], 1);
    assert.strictEqual(app.gameState.inventory["copper_ore"], 10);

    // Assertions for hero gear translations
    const hero = app.gameState.heroes.find(h => h.id === "hero_test");
    assert.ok(hero);
    assert.strictEqual(hero.equipment["weapon"], "ironpaws_slicer");
    assert.strictEqual(hero.equipment["secondary"], "ironpaws_champion_shield");

    // Assertions for shopper/customer translations
    const shopper = app.gameState.customers.find(c => c.id === "npc_test");
    assert.ok(shopper);
    assert.strictEqual(shopper.name, "Throm"); // Thrall translated to Throm
    assert.strictEqual(shopper.requestedItemId, "cinderfury_hand"); // sulfuras_hand translated to cinderfury_hand
});

// ====================================================
// 7. Combat Resolution Engine Tests
// ====================================================

test('resolveCombat resolves battle formulas and drops correctly', () => {
    // Seed heroes inside game state
    app.gameState.heroes = [
        app.createHero('Vanguard', 'Warrior'),
        app.createHero('Pyromancer', 'Mage'),
        app.createHero('Healer', 'Priest')
    ];

    // Seed levels and stats high so we can win the fight
    app.gameState.heroes.forEach(h => {
        h.level = 10;
        h.hp = 1000;
        h.max_hp = 1000;
        h.atk = 150;
        h.def = 80;
    });

    // Configure quest targeting Elderwood Forest (Zone 0) Elite "Ironpaw the Defiant [Elite]" (ID: "ironpaw")
    const quest = {
        heroIds: app.gameState.heroes.map(h => h.id),
        zoneId: 0,
        enemyId: "ironpaw"
    };

    const replay = app.resolveCombat(quest);

    assert.ok(replay);
    assert.strictEqual(replay.enemyName, "Ironpaw the Defiant [Elite]");
    assert.ok(replay.events.length > 0);
    assert.ok(typeof replay.won === 'boolean');
    assert.ok(replay.copperEarned > 0);
    assert.ok(Array.isArray(replay.lootDropped));
});

test('resolveCombat extreme battle testing all class skills and enemy mechanics', () => {
    // Seed heroes inside game state for all 5 classes
    app.gameState.heroes = [
        app.createHero('Vanguard', 'Warrior'),
        app.createHero('Pyromancer', 'Mage'),
        app.createHero('Healer', 'Priest'),
        app.createHero('Assasin', 'Rogue'),
        app.createHero('Guardian', 'Paladin')
    ];

    // Seed levels and stats high so we can survive and trigger everything
    app.gameState.heroes.forEach((h, idx) => {
        h.level = 20;
        h.xp = 0;
        h.max_xp = 100;
        h.hp = 10000;
        h.max_hp = 10000;
        h.atk = 200;
        h.def = 100;
        if (idx === 3) {
            // Assassin has 1 HP so they die on turn 1 to trigger knockout and clearHeroBuffs
            h.hp = 1;
            h.max_hp = 1;
        }
    });

    // Populate skills arrays with all specialized moves
    app.gameState.heroes[0].skills = ["heroic_strike", "shield_block", "taunt", "sunder_armor", "shield_slam"];
    app.gameState.heroes[1].skills = ["fireball", "frostbolt", "amplify_magic", "blink", "pyroblast"];
    app.gameState.heroes[2].skills = ["flash_heal", "renew", "power_word_shield", "prayer_of_healing", "mind_blast"];
    app.gameState.heroes[3].skills = ["sinister_strike", "expose_armor", "eviscerate", "feint", "adrenaline_rush"];
    app.gameState.heroes[4].skills = ["judgement_of_light", "holy_light", "blessing_of_kings", "consecration", "lay_on_hands"];

    // Set custom stats and extreme rotation on ironpaw
    const zone = app.ZONE_DATABASE.find(z => z.id === 0);
    const enemy = zone.enemies.find(e => e.id === "ironpaw");
    
    const originalHp = enemy.hp;
    const originalAtk = enemy.atk;
    const originalXp = enemy.xp;
    const originalDrops = enemy.drops;
    const originalRotation = app.ENEMY_ROTATIONS_DATABASE.ironpaw;

    // High HP and XP to trigger multiple level ups, high Attack to guarantee hits
    enemy.hp = 150000;
    enemy.atk = 150;
    enemy.xp = 5000; 
    
    // Identical drops to trigger duplicate quantity increment logic
    enemy.drops = [
        { itemId: "copper_ore", rate: 1.0 },
        { itemId: "copper_ore", rate: 1.0 }
    ];

    app.ENEMY_ROTATIONS_DATABASE.ironpaw = [
        { name: "Slam", action: "attack", mult: 1.5, stun: true },
        { name: "Savage Howl", action: "atk_buff", mult: 0.4, duration: 2, desc: "Attack +40%" },
        { name: "Iron Skin", action: "def_buff", mult: 0.5, duration: 2, desc: "Def +50%" },
        { name: "Web Spray", action: "atk_debuff", mult: 0.3, duration: 2, desc: "Atk -30%" },
        { name: "Feed", action: "heal", mult: 0.15, desc: "Heal 15%" },
        { name: "Blade Storm", action: "aoe", mult: 1.0, desc: "AoE attack" },
        { name: "Dash", action: "evade_buff", mult: 0.3, duration: 2, desc: "Evade +30%" },
        { name: "Poison Bite", action: "dot", mult: 0.5, duration: 3, desc: "DoT spray" },
        { name: "Fireball", action: "attack", mult: 1.8, ignoreDef: true, desc: "Ign Def attack" }
    ];

    const quest = {
        heroIds: app.gameState.heroes.map(h => h.id),
        zoneId: 0,
        enemyId: "ironpaw"
    };

    const replay = app.resolveCombat(quest);

    // Restore original elite settings to keep database clean
    enemy.hp = originalHp;
    enemy.atk = originalAtk;
    enemy.xp = originalXp;
    enemy.drops = originalDrops;
    app.ENEMY_ROTATIONS_DATABASE.ironpaw = originalRotation;

    assert.ok(replay);
    assert.ok(replay.events.length > 0);
});

test('craftItem and reviveHero edge cases and alerts', () => {
    // 1. reviveHero failures
    app.gameState.heroes = [app.createHero('DeadHero', 'Warrior')];
    const hero = app.gameState.heroes[0];
    hero.status = 'Dead';
    app.gameState.gold = 0; // Not enough gold to revive
    app.reviveHero(hero.id);
    assert.strictEqual(hero.status, 'Dead');

    // 2. craftItem level req failure
    app.gameState.crafters.blacksmith = { lvl: 1, xp: 0, max_xp: 100 };
    app.gameState.gold = 10000;
    app.gameState.inventory = { "copper_ore": 100 };
    app.craftItem('golem_crusher', 'blacksmith'); // reqLvl is 6

    // 3. craftItem gold failure
    app.gameState.gold = 0;
    app.craftItem('copper_sword', 'blacksmith');

    // 4. craftItem mats failure
    app.gameState.gold = 5000;
    app.gameState.inventory = {};
    app.craftItem('copper_sword', 'blacksmith');

    // 5. craftItem full bag failure and refund
    app.gameState.inventory = { "copper_ore": 10 };
    app.gameState.gold = 5000;
    app.gameState.settings.maxBagSlots = 0;
    app.craftItem('copper_sword', 'blacksmith');
    assert.strictEqual(app.gameState.inventory['copper_sword'], undefined);
    
    // Restore bag slots
    app.gameState.settings.maxBagSlots = 20;

    // 6. craftItem profession level up
    app.gameState.crafters.blacksmith = { lvl: 1, xp: 110, max_xp: 100 };
    app.gameState.inventory = { "copper_ore": 10 };
    app.gameState.gold = 5000;
    app.craftItem('copper_sword', 'blacksmith');
    assert.strictEqual(app.gameState.crafters.blacksmith.lvl, 2);
    
    assert.ok(true);
});

test('UI Modal and Dispatch functions render DOM nodes', () => {
    // 1. openHireModal
    app.openHireModal(100);
    
    // 2. confirmHireHero empty name
    const nameInput = getElementMock("hire-hero-name");
    nameInput.value = "";
    app.confirmHireHero();

    // 3. confirmHireHero insufficient gold
    nameInput.value = "Newbie";
    app.gameState.gold = 5;
    app.gameState.heroes = [app.createHero('H1', 'Warrior')];
    app.confirmHireHero(); // cost is 100, gold is 5
    
    // 4. Successful hire
    nameInput.value = "Newbie";
    const classSelect = getElementMock("hire-hero-class");
    classSelect.value = "Mage";
    app.gameState.gold = 10000;
    app.confirmHireHero();
    
    // 5. openDispatchModal when no heroes are idle
    app.gameState.heroes.forEach(h => h.status = "Questing");
    app.openDispatchModal(0, 'ironpaw');

    // 6. openDispatchModal with idle heroes
    app.gameState.heroes = [
        app.createHero('Idle1', 'Warrior'),
        app.createHero('Idle2', 'Priest')
    ];
    app.openDispatchModal(0, 'ironpaw');
    
    // Trigger card click on first child elements
    const mockCard = getElementMock("dispatch-hero-options").querySelector();
    if (mockCard && mockCard.onclick) {
        mockCard.onclick(); // Selects hero
        mockCard.onclick(); // Deselects hero
    }

    // 7. openEquipSlotModal with compatibility testing across classes and slots
    app.gameState.heroes = [
        app.createHero('EquipWarrior', 'Warrior'),
        app.createHero('EquipRogue', 'Rogue'),
        app.createHero('EquipMage', 'Mage')
    ];
    app.gameState.inventory = {
        "copper_sword": 1,
        "copper_shield": 1,
        "wastes_barbute": 1,
        "copper_band": 1
    };
    app.openEquipSlotModal(app.gameState.heroes[0].id, 'weapon');
    app.openEquipSlotModal(app.gameState.heroes[0].id, 'secondary'); // shield
    app.openEquipSlotModal(app.gameState.heroes[1].id, 'secondary'); // Rogue offhand weapon
    app.openEquipSlotModal(app.gameState.heroes[2].id, 'secondary'); // Mage offhand
    app.openEquipSlotModal(app.gameState.heroes[0].id, 'ring');

    // Click on a compatible option to equip it
    const mockOpt = getElementMock("equip-item-options").querySelector();
    if (mockOpt && mockOpt.onclick) {
        mockOpt.onclick();
    }

    // 8. openEquipModal with equipped gear
    const heroToEquip = app.gameState.heroes[0];
    app.gameState.inventory = { "copper_sword": 1, "wastes_barbute": 1 };
    app.equipItem(heroToEquip.id, 'weapon', 'copper_sword');
    app.equipItem(heroToEquip.id, 'head', 'wastes_barbute');
    
    // Add item that gives extra AP to test getHeroMaxAp equipment loop
    app.ITEM_DATABASE.wastes_barbute.stats = { ap: 3 };

    app.openEquipModal(heroToEquip.id);
    
    // Unequip bags full error
    app.gameState.settings.maxBagSlots = 0;
    app.unequipItem(heroToEquip.id, 'weapon');
    app.gameState.settings.maxBagSlots = 20;

    // Trigger unequip via card onclick
    const mockLeftSlots = getElementMock("doll-left-slots");
    const mockEquippedSlot = mockLeftSlots.querySelector();
    if (mockEquippedSlot && mockEquippedSlot.onclick) {
        mockEquippedSlot.onclick(); // Unequips wastes_barbute
    }

    // 9. selectZone for all zones and getSlotIconPlaceholder fallback
    assert.strictEqual(app.getSlotIconPlaceholder('backpack'), '📦');
    app.selectZone(0);
    app.selectZone(1);
    app.selectZone(2);
    app.selectZone(3);
    app.selectZone(4);
    app.selectZone(5);
    app.selectZone(6);
    
    assert.ok(true);
});

test('shopper ticks and offer declines', () => {
    app.gameState.customers = [{ id: 'npc_decline_test', name: 'Thrall', requestedItemId: 'copper_sword', price: 200 }];
    app.declineOffer('npc_decline_test');
    assert.strictEqual(app.gameState.customers.length, 0);

    // Fulfill nonexistent offer
    app.fulfillOffer('nonexistent');

    // customer generator tick
    app.gameState.customers = [];
    app.wastesChatTick();
});

// ====================================================
// 8. Modals & UI Tab Switching Tests
// ====================================================

test('Modal triggers open and close without exceptions', () => {
    app.openModal('modal-hire-hero');
    app.closeModal('modal-hire-hero');
    assert.ok(true); // Verification that execution finished successfully
});

test('Profession and Tab selectors switch tabs cleanly', () => {
    app.switchTab('quests');
    app.switchTab('crafting');
    app.switchTab('market');
    app.switchProfession('tailor');
    app.switchProfession('blacksmith');
    assert.ok(true);
});

// ====================================================
// 9. Rendering Systems Tests
// ====================================================

test('General rendering engines execute correctly with loaded state', () => {
    app.gameState.heroes = [
        app.createHero('Luther', 'Paladin'),
        app.createHero('DeadLuther', 'Warrior'),
        app.createHero('QuestingLuther', 'Priest')
    ];
    app.gameState.heroes[0].skills = ["holy_light", "blessing_of_kings", "consecration", null, null];
    app.gameState.heroes[1].status = 'Dead';
    app.gameState.heroes[2].status = 'Questing';
    
    app.gameState.inventory = { "copper_ore": 5, "ironpaws_slicer": 1 };
    app.gameState.customers = [{ id: 'npc_render', name: 'Jayna', requestedItemId: 'copper_sword', price: 200 }];
    app.gameState.activeQuests = [{
        id: 'q_render',
        heroIds: [app.gameState.heroes[0].id],
        enemyId: 'kobold_vermin',
        zoneId: 0,
        durationTotal: 10,
        durationRemaining: 5,
        isCompleted: false
    }];

    app.renderHeroes();
    app.renderInventory();
    app.renderCustomers();
    app.renderActiveQuestsSidebar();
    app.renderZoneSelector();
    app.renderEnemyList();
    app.renderRepeatButton();
    assert.ok(true);
});

// ====================================================
// 10. Item Crafting & Merchant Systems Tests
// ====================================================

test('craftItem performs inventory and XP updates', () => {
    app.gameState.inventory = { "copper_ore": 10 };
    app.gameState.gold = 5000;
    app.craftItem('copper_sword', 'blacksmith');
    assert.strictEqual(app.gameState.inventory['copper_sword'], 1);
    assert.strictEqual(app.gameState.inventory['copper_ore'], 7);
});

test('sellItemDirect and fulfillOffer execute payouts', () => {
    app.gameState.inventory = { "copper_sword": 2 };
    app.openItemDetailsModal('copper_sword');
    
    // Direct sell
    app.sellItemDirect();
    assert.strictEqual(app.gameState.inventory['copper_sword'], 1);

    // Customer sell
    const offer = { id: 'npc_customer_trade', name: 'Luther', requestedItemId: 'copper_sword', price: 500 };
    app.gameState.customers = [offer];
    app.fulfillOffer('npc_customer_trade');
    assert.strictEqual(app.gameState.inventory['copper_sword'], undefined);
});

// ====================================================
// 11. Equipment Operations Tests
// ====================================================

test('equipItem and unequipItem executes gear bindings on hero', () => {
    const hero = app.gameState.heroes[0];
    app.gameState.inventory = { "ironpaws_slicer": 1 };
    
    // Equip
    app.equipItem(hero.id, 'weapon', 'ironpaws_slicer');
    assert.strictEqual(hero.equipment.weapon, 'ironpaws_slicer');

    // Unequip
    app.unequipItem(hero.id, 'weapon');
    assert.strictEqual(hero.equipment.weapon, null);
    assert.strictEqual(app.gameState.inventory['ironpaws_slicer'], 1);
});

// ====================================================
// 12. Revivals, Rotations & Repeat Quest Dispatches
// ====================================================

test('reviveHero restores dead heroes', () => {
    const hero = app.gameState.heroes[0];
    hero.status = 'Dead';
    app.gameState.gold = 100000;
    
    app.reviveHero(hero.id);
    assert.strictEqual(hero.status, 'Idle');
});

test('repeatLastQuest re-dispatches groups cleanly', () => {
    app.gameState.lastDispatch = {
        heroIds: [app.gameState.heroes[0].id],
        enemyId: 'kobold_vermin',
        zoneId: 0
    };
    app.gameState.heroes[0].status = 'Idle';
    app.repeatLastQuest();
    assert.strictEqual(app.gameState.heroes[0].status, 'Questing');

    // Test startQuest with a single string to cover Array.isArray branch
    app.gameState.heroes[0].status = 'Idle';
    app.startQuest(app.gameState.heroes[0].id, 'kobold_vermin', 0);
    assert.strictEqual(app.gameState.heroes[0].status, 'Questing');
});

test('quickCollectQuestRewards collects loot instantly without replay', () => {
    const hero = app.gameState.heroes[0];
    hero.status = 'Questing';
    
    // Set kobold_vermin to always drop copper_ore
    const zone = app.ZONE_DATABASE.find(z => z.id === 0);
    const enemy = zone.enemies.find(e => e.id === "kobold_vermin");
    const originalDrops = enemy.drops;
    enemy.drops = [{ itemId: "copper_ore", rate: 1.0 }];

    app.gameState.activeQuests = [{
        id: 'q_quick_rewards',
        heroIds: [hero.id],
        enemyId: 'kobold_vermin',
        zoneId: 0,
        durationTotal: 10,
        durationRemaining: 0,
        isCompleted: true
    }];

    app.quickCollectQuestRewards('q_quick_rewards');
    assert.strictEqual(app.gameState.activeQuests.length, 0);

    // Restore original drops
    enemy.drops = originalDrops;
});

// ====================================================
// 13. System Game Lifecycle Loop Tests
// ====================================================

test('Lifecycle functions updateQuests and initGame run successfully', () => {
    app.gameState.heroes[0].status = 'Questing';
    app.gameState.activeQuests = [{
        id: 'q_lifecycle_test',
        heroIds: [app.gameState.heroes[0].id],
        enemyId: 'kobold_vermin',
        zoneId: 0,
        durationTotal: 10,
        durationRemaining: 1,
        isCompleted: false
    }];

    // Update quest timer
    app.updateQuests();
    assert.strictEqual(app.gameState.activeQuests[0].durationRemaining, 0);
    assert.strictEqual(app.gameState.activeQuests[0].isCompleted, true);

    // Initializer
    app.initGame();
});

test('Strict group size validations for dungeons, raids, and adventure zones', () => {
    // Clean up active quests and reset heroes to idle
    app.gameState.activeQuests = [];
    app.gameState.heroes = [];

    // Create 20 mock heroes
    for (let i = 0; i < 20; i++) {
        app.gameState.heroes.push(app.createHero(`Hero_${i}`, 'Warrior'));
    }

    // 1. Try starting a dungeon quest (Zone ID 1: The Grim Mines, type: dungeon) with 1 hero (should fail)
    const dungeonZoneId = 1;
    const dungeonEnemyId = 'outlaw_scamp';
    const singleHeroId = [app.gameState.heroes[0].id];
    
    app.startQuest(singleHeroId, dungeonEnemyId, dungeonZoneId);
    assert.strictEqual(app.gameState.heroes[0].status, 'Idle', 'Dungeon dispatch with 1 hero should fail and remain Idle');
    assert.strictEqual(app.gameState.activeQuests.length, 0);

    // 2. Try starting a dungeon quest with 3 heroes (should succeed)
    const threeHeroIds = [app.gameState.heroes[0].id, app.gameState.heroes[1].id, app.gameState.heroes[2].id];
    app.startQuest(threeHeroIds, dungeonEnemyId, dungeonZoneId);
    assert.strictEqual(app.gameState.heroes[0].status, 'Questing', 'Dungeon dispatch with 3 heroes should succeed');
    assert.strictEqual(app.gameState.heroes[1].status, 'Questing');
    assert.strictEqual(app.gameState.heroes[2].status, 'Questing');
    assert.strictEqual(app.gameState.activeQuests.length, 1);

    // Clean up
    app.gameState.activeQuests = [];
    app.gameState.heroes.forEach(h => h.status = 'Idle');

    // 3. Try starting a raid quest (Zone ID 17: Obsidian Caldera [Raid], type: raid) with 5 heroes (should fail)
    const raidZoneId = 17;
    const raidEnemyId = 'fire_elemental';
    const fiveHeroIds = app.gameState.heroes.slice(0, 5).map(h => h.id);
    app.startQuest(fiveHeroIds, raidEnemyId, raidZoneId);
    assert.strictEqual(app.gameState.heroes[0].status, 'Idle', 'Raid dispatch with 5 heroes should fail');
    assert.strictEqual(app.gameState.activeQuests.length, 0);

    // 4. Try starting a raid quest with 10 heroes (should succeed)
    const tenHeroIds = app.gameState.heroes.slice(0, 10).map(h => h.id);
    app.startQuest(tenHeroIds, raidEnemyId, raidZoneId);
    assert.strictEqual(app.gameState.heroes[0].status, 'Questing', 'Raid dispatch with 10 heroes should succeed');
    assert.strictEqual(app.gameState.activeQuests.length, 1);

    // Clean up
    app.gameState.activeQuests = [];
    app.gameState.heroes.forEach(h => h.status = 'Idle');

    // 5. Try starting a zone quest (Zone ID 0: Elderwood Forest, type: zone) with 6 heroes (should fail)
    const zoneZoneId = 0;
    const zoneEnemyId = 'kobold_vermin';
    const sixHeroIds = app.gameState.heroes.slice(0, 6).map(h => h.id);
    app.startQuest(sixHeroIds, zoneEnemyId, zoneZoneId);
    assert.strictEqual(app.gameState.heroes[0].status, 'Idle', 'Zone dispatch with 6 heroes should fail');
    assert.strictEqual(app.gameState.activeQuests.length, 0);

    // 6. Try starting a zone quest with 1 hero (should succeed)
    app.startQuest([app.gameState.heroes[0].id], zoneEnemyId, zoneZoneId);
    assert.strictEqual(app.gameState.heroes[0].status, 'Questing', 'Zone dispatch with 1 hero should succeed');
    assert.strictEqual(app.gameState.activeQuests.length, 1);
});

test('Enriched dungeons and raids database structure validation', () => {
    // Assert there are exactly 20 zones in ZONE_DATABASE
    assert.strictEqual(app.ZONE_DATABASE.length, 20);

    // Assert that Grim Mines has 4 enemies (outlaw_scamp, grim_digger, steam_shredder, greentooth)
    const grimMines = app.ZONE_DATABASE.find(z => z.name === "The Grim Mines");
    assert.ok(grimMines);
    assert.strictEqual(grimMines.enemies.length, 4);

    // Verify all added enemies have valid levels and stats
    grimMines.enemies.forEach(enemy => {
        assert.ok(enemy.id);
        assert.ok(enemy.name);
        assert.ok(enemy.hp > 0);
        assert.ok(enemy.atk > 0);
        assert.ok(enemy.xp > 0);
    });

    // Check that custom boss rotations are loaded and execute correctly
    const shredderRot = app.ENEMY_ROTATIONS_DATABASE['steam_shredder'];
    assert.ok(shredderRot);
    assert.strictEqual(shredderRot.length, 5);

    // Check Darkwing Summit and Wyrmqueen's Den are present
    const darkwingSummit = app.ZONE_DATABASE.find(z => z.id === 18);
    assert.ok(darkwingSummit);
    assert.strictEqual(darkwingSummit.name, "Darkwing Summit [Raid]");
    assert.strictEqual(darkwingSummit.enemies.length, 4);

    const wyrmqueensDen = app.ZONE_DATABASE.find(z => z.id === 19);
    assert.ok(wyrmqueensDen);
    assert.strictEqual(wyrmqueensDen.name, "Wyrmqueen's Den [Raid]");
    assert.strictEqual(wyrmqueensDen.enemies.length, 3);
});

test('Variable quest durations scale dynamically based on hero strength and combat simulation', () => {
    // 1. Save original stats and modify weapon stats to give extreme stats
    const originalStats = { ...app.ITEM_DATABASE.copper_sword.stats };
    app.ITEM_DATABASE.copper_sword.stats = { atk: 50000, hp: 100000, def: 10000 };

    // 2. Clear state
    app.gameState.activeQuests = [];
    app.gameState.heroes = [];

    // 3. Create strong and weak heroes
    const strongHero = app.createHero('StrongHero', 'Warrior');
    const weakHero = app.createHero('WeakHero', 'Warrior');

    // Make sure they have unique IDs
    strongHero.id = 'hero_strong';
    weakHero.id = 'hero_weak';

    app.gameState.heroes.push(strongHero);
    app.gameState.heroes.push(weakHero);

    // 4. Equip strong hero
    strongHero.equipment.weapon = 'copper_sword';

    // 5. Run a quest dispatch with the strong hero
    app.startQuest([strongHero.id], 'kobold_vermin', 0);
    assert.strictEqual(app.gameState.activeQuests.length, 1);
    
    const strongQuest = app.gameState.activeQuests[0];
    const strongTurns = strongQuest.replay.turns;
    const strongDuration = strongQuest.durationTotal;

    // Reset quest state and hero status for next test dispatch
    app.gameState.activeQuests = [];
    strongHero.status = 'Idle';
    strongHero.activeQuestId = null;

    // 6. Run a quest dispatch with the weak hero against the exact same enemy
    app.startQuest([weakHero.id], 'kobold_vermin', 0);
    assert.strictEqual(app.gameState.activeQuests.length, 1);

    const weakQuest = app.gameState.activeQuests[0];
    const weakTurns = weakQuest.replay.turns;
    const weakDuration = weakQuest.durationTotal;

    // 7. Verify dynamic scaling
    // Strong hero should defeat the enemy in fewer turns than weak hero
    assert.ok(strongTurns < weakTurns, `Strong hero turns (${strongTurns}) should be less than weak hero turns (${weakTurns})`);
    assert.ok(strongDuration < weakDuration, `Strong hero duration (${strongDuration}) should be less than weak hero duration (${weakDuration})`);

    // Verify quest has replay cached
    assert.ok(strongQuest.replay, 'Quest should have pre-simulated replay cached');

    // 8. Test quickCollectQuestRewards using the cached replay
    // Clean up active quests and start quest again with strong hero to test looting
    app.gameState.activeQuests = [];
    weakHero.status = 'Idle';
    weakHero.activeQuestId = null;

    app.startQuest([strongHero.id], 'kobold_vermin', 0);
    const activeQuest = app.gameState.activeQuests[0];
    const cachedReplay = activeQuest.replay;
    assert.ok(cachedReplay);

    // Call quickCollectQuestRewards and verify it finishes successfully
    app.quickCollectQuestRewards(activeQuest.id);
    assert.strictEqual(app.gameState.activeQuests.length, 0);

    // Restore original copper_sword stats
    app.ITEM_DATABASE.copper_sword.stats = originalStats;
});

test('quickLootAndRerun loots completed quest and automatically re-dispatches living heroes', () => {
    // 1. Reset state
    app.gameState.activeQuests = [];
    app.gameState.heroes = [];

    // 2. Create hero
    const hero = app.createHero('Rerunner', 'Warrior');
    hero.id = 'hero_rerun';
    hero.status = 'Questing';
    hero.hp = 100;
    app.gameState.heroes.push(hero);

    // 3. Set kobold_vermin drops
    const zone = app.ZONE_DATABASE.find(z => z.id === 0);
    const enemy = zone.enemies.find(e => e.id === "kobold_vermin");
    const originalDrops = enemy.drops;
    enemy.drops = [{ itemId: "copper_ore", rate: 1.0 }];

    // 4. Set up completed active quest
    app.gameState.activeQuests = [{
        id: 'q_rerun_test',
        heroIds: [hero.id],
        enemyId: 'kobold_vermin',
        zoneId: 0,
        durationTotal: 10,
        durationRemaining: 0,
        isCompleted: true
    }];

    // 5. Execute quickLootAndRerun
    app.quickLootAndRerun('q_rerun_test');

    // 6. Verify result
    // The old quest 'q_rerun_test' should be removed, and a NEW quest should be created automatically
    assert.strictEqual(app.gameState.activeQuests.length, 1);
    assert.notStrictEqual(app.gameState.activeQuests[0].id, 'q_rerun_test');
    assert.strictEqual(app.gameState.activeQuests[0].enemyId, 'kobold_vermin');
    assert.strictEqual(app.gameState.activeQuests[0].zoneId, 0);
    assert.deepStrictEqual(app.gameState.activeQuests[0].heroIds, [hero.id]);
    assert.strictEqual(hero.status, 'Questing');

    // Restore original drops
    enemy.drops = originalDrops;
});

test('Dungeon and raid enemy unlocking progression is enforced strictly', () => {
    // 1. Reset state
    app.gameState.activeQuests = [];
    app.gameState.heroes = [];
    app.gameState.defeatedEnemies = [];

    // 2. Create 3 idle heroes to satisfy the 3-5 group size constraint for Grim Mines dungeon (Zone ID 1)
    for (let i = 0; i < 3; i++) {
        const h = app.createHero(`DungeonHero_${i}`, 'Warrior');
        h.id = `hero_dungeon_${i}`;
        h.level = 10;
        h.hp = 1000;
        h.max_hp = 1000;
        h.atk = 150;
        h.def = 80;
        app.gameState.heroes.push(h);
    }
    const heroIds = app.gameState.heroes.map(h => h.id);

    // Zone ID 1 is "The Grim Mines", which is a dungeon
    // Enemies list: outlaw_scamp (trash), grim_digger (trash), steam_shredder (boss), greentooth (final boss)
    const firstEnemyId = 'outlaw_scamp';
    const secondEnemyId = 'grim_digger';

    // 3. Try to start a quest for the second enemy directly (should fail because first is not defeated)
    app.startQuest(heroIds, secondEnemyId, 1);
    assert.strictEqual(app.gameState.activeQuests.length, 0, 'Should not allow dispatching to locked second enemy');
    assert.strictEqual(app.gameState.heroes[0].status, 'Idle');

    // 4. Manually mark the first enemy as defeated
    app.gameState.defeatedEnemies.push(firstEnemyId);

    // 5. Try starting the quest for the second enemy again (should now succeed!)
    app.startQuest(heroIds, secondEnemyId, 1);
    assert.strictEqual(app.gameState.activeQuests.length, 1, 'Should allow dispatching once predecessor is defeated');
    assert.strictEqual(app.gameState.heroes[0].status, 'Questing');

    // 6. Complete the quest and verify it adds the second enemy to defeatedEnemies
    const quest = app.gameState.activeQuests[0];
    quest.durationRemaining = 0;
    quest.isCompleted = true;

    // Execute quick collection
    app.quickCollectQuestRewards(quest.id);
    
    // Assert that the second enemy is now registered as defeated
    assert.ok(app.gameState.defeatedEnemies.includes(secondEnemyId), 'Looting victory should register second enemy as defeated');
});

test('Enriched dungeons and raids unique equipment drops count matches target constraints', () => {
    app.ZONE_DATABASE.forEach(zone => {
        if (zone.type === 'dungeon' || zone.type === 'raid') {
            const isRaid = (zone.type === 'raid');
            const minItems = isRaid ? 5 : 2;
            const maxItems = isRaid ? 10 : 5;

            const bosses = zone.enemies.filter(enemy => enemy.name.includes('[Boss]'));
            bosses.forEach(boss => {
                // Count unique gear drops: items whose type is NOT 'material'
                const uniqueGearDrops = boss.drops.filter(drop => {
                    const item = app.ITEM_DATABASE[drop.itemId];
                    return item && item.type !== 'material';
                });
                const count = uniqueGearDrops.length;
                
                assert.ok(
                    count >= minItems && count <= maxItems,
                    `Boss "${boss.name}" in "${zone.name}" should drop between ${minItems} and ${maxItems} unique items (actual: ${count})`
                );

                // Verify drop rates are reasonable
                uniqueGearDrops.forEach(drop => {
                    const item = app.ITEM_DATABASE[drop.itemId];
                    assert.ok(item, `Item "${drop.itemId}" should exist in ITEM_DATABASE`);
                    assert.ok(drop.rate > 0 && drop.rate <= 1.0, `Drop rate for "${drop.itemId}" on "${boss.name}" should be between 0 and 1`);
                });
            });
        }
    });
});

test('Victory and defeat tracking increments kills and deaths correctly', () => {
    // 1. Reset state
    app.gameState.activeQuests = [];
    app.gameState.defeatedEnemies = [];
    app.gameState.enemyStats = {};

    const mockEnemyId = 'test_mob_tracking';

    // 2. Simulate quickCollectQuestRewards victory
    const mockReplayWon = {
        questId: 'quest_test_won',
        enemyId: mockEnemyId,
        enemyName: 'Test Target Mob',
        won: true,
        finalHeroStates: {},
        copperEarned: 10,
        lootDropped: []
    };

    app.gameState.activeQuests.push({
        id: 'quest_test_won',
        heroIds: [],
        enemyId: mockEnemyId,
        zoneId: 0,
        replay: mockReplayWon
    });

    app.quickCollectQuestRewards('quest_test_won');
    assert.strictEqual(app.gameState.enemyStats[mockEnemyId].kills, 1, 'Victory should increment kills to 1');
    assert.strictEqual(app.gameState.enemyStats[mockEnemyId].deaths, 0, 'Victory should leave deaths at 0');

    // 3. Simulate quickCollectQuestRewards defeat
    const mockReplayLost = {
        questId: 'quest_test_lost',
        enemyId: mockEnemyId,
        enemyName: 'Test Target Mob',
        won: false,
        finalHeroStates: {},
        copperEarned: 0,
        lootDropped: []
    };

    app.gameState.activeQuests.push({
        id: 'quest_test_lost',
        heroIds: [],
        enemyId: mockEnemyId,
        zoneId: 0,
        replay: mockReplayLost
    });

    app.quickCollectQuestRewards('quest_test_lost');
    assert.strictEqual(app.gameState.enemyStats[mockEnemyId].kills, 1, 'Defeat should leave kills at 1');
    assert.strictEqual(app.gameState.enemyStats[mockEnemyId].deaths, 1, 'Defeat should increment deaths to 1');
});

test('Zone asset mappings and enemy card styled background covers resolve successfully', () => {
    // 1. Assert getZoneAsset successfully maps every zone name in ZONE_DATABASE to a valid .png source path
    app.ZONE_DATABASE.forEach(zone => {
        const asset = app.getZoneAsset(zone.name);
        assert.ok(asset, `Asset should resolve for zone: ${zone.name}`);
        assert.ok(asset.src.endsWith('.png'), `Asset source for "${zone.name}" should be a PNG file path`);
        assert.ok(asset.filter, `Asset filter should be defined for zone: ${zone.name}`);
    });

    // 2. Mock and execute renderEnemyList to verify card styles are configured correctly
    app.renderEnemyList();

    const container = document.getElementById('enemy-list-container');
    assert.ok(container.children.length > 0, 'Enemy list container should contain rendered cards');

    const firstCard = container.children[0];
    assert.ok(firstCard.style.backgroundImage.includes('url('), 'Card style should include background image cover');
    assert.strictEqual(firstCard.style.backgroundSize, 'cover', 'Card background size should be cover');
    assert.strictEqual(firstCard.style.position, 'relative', 'Card position should be relative to hold absolute portraits');
    assert.strictEqual(firstCard.style.overflow, 'hidden', 'Card overflow should be hidden to clip large portraits');

    // Assert that the first card has the watermark portrait div for normal enemies in its innerHTML
    assert.ok(firstCard.innerHTML.includes('enemy-portrait-watermark'), 'Normal enemy card should contain a watermark portrait element');
    assert.ok(firstCard.innerHTML.includes('position: absolute'), 'Watermark style should include position absolute');

    // 3. Select Obsidian Caldera [Raid] zone to test custom Ignis the Firelord portrait
    const calderaIndex = app.ZONE_DATABASE.findIndex(z => z.name === "Obsidian Caldera [Raid]");
    if (calderaIndex !== -1) {
        const calderaContainer = document.getElementById('enemy-list-container');
        calderaContainer.children = []; // Clear children to bypass mock accumulation
        
        app.selectZone(calderaIndex);

        const cards = Array.from(calderaContainer.children);
        
        // Find Ignis card
        const ignisCard = cards.find(c => c.innerHTML.includes('Ignis the Firelord'));
        assert.ok(ignisCard, 'Ignis the Firelord card should be found inside Obsidian Caldera');
        assert.ok(ignisCard.style.backgroundImage.includes('assets/ignis_firelord.png'), 'Ignis card should use his custom portrait file');

        // Verify Ignis card does not have the watermark portrait since it uses high-fidelity custom portrait background
        assert.ok(!ignisCard.innerHTML.includes('enemy-portrait-watermark'), 'Ignis card should not contain a watermark overlay');

        // Restore zone index
        calderaContainer.children = [];
        app.selectZone(0);
    }

    // 4. Verify distinct procedural background artwork generator handles multiple enemies
    const zone0 = app.ZONE_DATABASE[0];
    const kobold = zone0.enemies[0];
    const spider = zone0.enemies[1];
    
    const koboldBg = app.getEnemyBackgroundSVG(kobold, zone0);
    const spiderBg = app.getEnemyBackgroundSVG(spider, zone0);
    
    assert.ok(koboldBg.startsWith('data:image/svg+xml'), 'Kobold background should be an SVG data URI');
    assert.ok(spiderBg.startsWith('data:image/svg+xml'), 'Spider background should be an SVG data URI');
    assert.notStrictEqual(koboldBg, spiderBg, 'Every enemy must have a unique procedurally generated background artwork');
});








