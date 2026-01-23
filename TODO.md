# Mnemosyne: Shards of Destiny — Development Progress

**Last Updated:** 2026-01-23 (Migrated to Phaser.js)

---

## Tech Stack

- **Engine:** Phaser 3 (web-based)
- **Build Tool:** Vite
- **Language:** JavaScript (ES6 modules)

---

## Phase 1: Project Setup ✅ COMPLETE

- [x] Migrate from Godot to Phaser.js
- [x] Set up Vite build system
- [x] Create project structure
- [x] Configure game settings (1920x1080, scalable)

---

## Phase 2: Core Scenes ✅ COMPLETE

- [x] BootScene (asset loading, progress bar)
- [x] MainMenuScene (background, buttons, new game/continue)
- [x] VillageScene (exploration, player movement, NPC interaction)
- [x] BattleScene (turn-based combat system)

---

## Phase 3: Systems ⬜ IN PROGRESS

- [x] CombatSystem (damage calculation, turn order)
- [x] Game state management (registry)
- [x] Save/Load (localStorage)
- [ ] DialogueSystem (branching, typewriter effect, portraits)

---

## Phase 4: Content Integration ⬜ TODO

- [ ] Load all character sprites properly
- [ ] Load all enemy sprites
- [ ] Implement skills from skills.json
- [ ] Add more NPCs to village
- [ ] Create temple exploration scene
- [ ] Random encounter system

---

## Phase 5: Polish ⬜ TODO

- [ ] Animations for combat
- [ ] Sound effects and music
- [ ] Screen transitions
- [ ] Mobile touch controls refinement
- [ ] Settings menu (volume, etc.)

---

## Phase 6: Story Implementation ⬜ TODO

- [ ] Chapter 1 story events
- [ ] Vision sequences
- [ ] Story flags and branching
- [ ] Boss encounters

---

## Quick Reference

### Running the Game

```bash
npm install    # Install dependencies
npm run dev    # Start development server
npm run build  # Build for production
```

### Project Structure

```
src/
├── main.js           # Entry point
├── config.js         # Phaser configuration
├── scenes/           # Game scenes
│   ├── BootScene.js
│   ├── MainMenuScene.js
│   ├── VillageScene.js
│   └── BattleScene.js
└── systems/          # Game systems
    └── CombatSystem.js

public/
├── assets/           # Images, sprites
└── data/             # JSON data files
```

### Asset Counts

| Category | Complete | Total |
|----------|----------|-------|
| Party portraits | 3 | 3 |
| NPC portraits | 5 | 5 |
| Combat backgrounds | 6 | 6 |
| UI screens | 3 | 3 |
| Tilesets | 9 | 9 |

---

## Phase 7: Modular Asset System ⬜ IN PROGRESS

### Buildings
- [x] House base component (walls, roof, doors, windows)
- [x] Inn, Shop, Smith presets
- [x] Temple presets (Apollo, Mnemosyne, Hecate)
- [ ] Home variants (small cottage, medium house, large villa)
- [ ] Civic buildings (barracks, guard post, oracle/shrine)
- [ ] Market stalls and vendor carts

### Environment
- [ ] Tree variants (cypress, olive, oak, dead tree)
- [ ] Rocks/boulders (small, medium, large clusters)
- [ ] Water features (well, fountain, pond, stream edge)
- [ ] Paths/roads (dirt, stone, marble tiles)
- [ ] Barriers (fences, walls, gates, bridges)

### Props
- [x] Forge, anvil, amphora, flower pots, torches
- [ ] Storage items (barrels, crates, chests, sacks)
- [ ] Furniture (benches, tables, chairs, beds)
- [ ] Decorations (statues, columns, urns, banners)
- [ ] Utility items (campfire, cooking pot, weapon rack, ladder)

### Characters
- [ ] Modular player character system
- [ ] NPC system (villagers, merchants, guards)
- [ ] Enemy system with variants

### UI Components
- [ ] Dialogue box component
- [ ] Inventory panel component
- [ ] HUD elements (health bar, MP bar, minimap)
- [ ] Menu components (pause, settings, save/load)

---

## Next Priority

**Phase 7: Modular Asset System** — Build reusable LEGO-like components
