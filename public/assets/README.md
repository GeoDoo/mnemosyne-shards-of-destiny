# Assets Guide

This folder contains all visual and audio assets for **Mnemosyne: Shards of Destiny**.

---

## Folder Structure

```
assets/
├── portraits/
│   ├── party/               # Dialogue portraits (48x48)
│   └── npcs/
├── sprites/
│   ├── characters/
│   │   ├── npcs/            # NPC spritesheets
│   │   └── party/           # Playable characters
│   │       ├── alkmaeon/
│   │       ├── brasidas/
│   │       └── theano/
│   └── enemies/
│       ├── bosses/          # Boss sprites
│       └── common/          # Regular enemies
├── tilesets/
│   ├── combat/              # Battle backgrounds
│   └── exploration/         # Exploration tilesets
└── ui/                      # UI screens
```

---

## Naming Conventions

### Sprites (32x32)
```
{character}_{animation}_{frame}.png

Examples:
  alkmaeon_idle_01.png
  alkmaeon_walk_01.png ... alkmaeon_walk_08.png
  alkmaeon_attack_01.png ... alkmaeon_attack_06.png
  alkmaeon_hurt_01.png
```

### Sprite Sheets (Current Format)
```
{character}_spritesheet.png

Contains all animations in horizontal rows:
- Row 1: IDLE (4-6 frames)
- Row 2: WALK (6 frames)
- Row 3: ATTACK (6 frames)
- Row 4: HURT (2 frames)
- Row 5: SKILL (4-6 frames)

Examples:
  alkmaeon_spritesheet.png
  theano_spritesheet.png
  brasidas_spritesheet.png
```

### Portraits (48x48)
```
{character}_portrait.png

Examples:
  alkmaeon_portrait.png
  theano_portrait.png
  brasidas_portrait.png
```

### Enemies
```
{enemy_id}_{animation}_{frame}.png

Examples:
  empusa_idle_01.png
  python_attack_sheet.png
  typhon_phase2_idle_01.png
```

### Tilesets (Exploration)
```
{location}_tileset.png

Examples:
  thespiae_tileset.png
  delos_tileset.png
  delphi_tileset.png
  levadeia_tileset.png
  nekromanteion_tileset.png
  olympus_tileset.png
```

### Combat Backgrounds
```
bg_{location}.png

Examples:
  bg_village.png
  bg_temple.png
  bg_mountain.png
  bg_cave.png
  bg_divine.png
  bg_final.png
```

---

## Animation Reference

### Party Members — Required Animations

| Animation | Frames | Usage |
|-----------|--------|-------|
| `idle` | 2-4 | Standing, breathing |
| `walk` | 4-8 | Movement cycle |
| `attack` | 4-6 | Basic attack |
| `skill` | 4-8 | Using abilities |
| `hurt` | 2-3 | Taking damage |
| `defend` | 2 | Blocking |
| `victory` | 4-6 | Battle won |
| `dead` | 1-2 | Knocked out |

### Character-Specific Animations

**Alkmaeon:**
- `memory_flash` — eyes glow, energy burst (6-8 frames)

**Theano:**
- `heal` — staff raised, golden light (6 frames)
- `pray` — kneeling, channeling (4 frames)

**Brasidas:**
- `shield_bash` — forward charge (4 frames)
- `war_cry` — shield raised, buff effect (4 frames)

---

## Style Guide

| Property | Value |
|----------|-------|
| **Style** | 16-bit JRPG (SNES era) |
| **Sprite Size** | 32x32 pixels |
| **Portrait Size** | 48x48 pixels |
| **Tile Size** | 16x16 pixels |
| **Palette** | 16-24 colors per character |
| **Outline** | 1px dark outline for readability |
| **Shading** | 2-3 levels (highlight, base, shadow) |

---

## Color Palettes

### Alkmaeon
- Skin: `#D4A574`, `#C4956A`, `#A67C52`
- Chiton: `#F5F5F5`, `#E8E8E8`, `#D0D0D0`
- Belt/Leather: `#8B5A2B`, `#6B4423`
- Memory Glow: `#00FFFF`, `#80FFFF`

### Theano
- Skin: `#D4A574`, `#C4956A`, `#A67C52`
- Dress Gold: `#DAA520`, `#B8860B`, `#8B6914`
- Dress Green: `#228B22`, `#1C6B1C`, `#145214`
- Wheat Crown: `#FFD700`, `#DAA520`

### Brasidas
- Skin: `#C4956A`, `#A67C52`, `#8B5A2B`
- Bronze: `#CD7F32`, `#A0522D`, `#8B4513`
- Crimson: `#DC143C`, `#B22222`, `#8B0000`
- Black: `#1A1A1A`, `#333333`

---

## Asset Checklist

### Party Members
- [x] Alkmaeon — spritesheet (alkmaeon_spritesheet.png)
- [x] Alkmaeon — portrait (alkmaeon_portrait.png)
- [x] Theano — spritesheet (theano_spritesheet.png)
- [x] Theano — portrait (theano_portrait.png)
- [x] Brasidas — spritesheet (brasidas_spritesheet.png)
- [x] Brasidas — portrait (brasidas_portrait.png)

### NPCs
- [ ] Epimenides — sprites + portrait
- [ ] Arete (spirit) — sprites + portrait
- [ ] Kleio — sprites + portrait
- [ ] Damon — sprites + portrait
- [ ] Mother (Alkmaeon's) — sprites + portrait

### Enemies (Common)
- [ ] Mormolykeia
- [ ] Strix
- [ ] Ker
- [ ] Mormo
- [ ] Empusa
- [ ] Lamia
- [ ] Eurynomos

### Enemies (Bosses)
- [ ] Python
- [ ] Melinoe
- [ ] Echidna
- [ ] Typhon (multiple phases)

### Locations
- [ ] Thespiae tileset
- [ ] Delphi tileset
- [ ] Lebadeia tileset
- [ ] Delos tileset
- [ ] Necromanteion tileset
- [ ] Olympus tileset
