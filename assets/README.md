# Assets Guide

This folder contains all visual and audio assets for **Mnemosyne: Shards of Destiny**.

---

## Folder Structure

```
assets/
├── sprites/
│   ├── characters/
│   │   ├── party/           # Playable characters
│   │   │   ├── alkmaeon/
│   │   │   ├── theano/
│   │   │   └── brasidas/
│   │   └── npcs/            # Non-playable characters
│   │       ├── epimenides/
│   │       ├── arete/
│   │       ├── kleio/
│   │       └── damon/
│   ├── enemies/
│   │   ├── common/          # Regular enemies
│   │   └── bosses/          # Boss sprites
│   ├── ui/                  # UI elements, icons
│   └── effects/             # VFX, particles
├── portraits/
│   ├── party/               # Dialogue portraits (64x64 or 96x96)
│   └── npcs/
├── tilesets/
│   ├── thespiae/            # Starting village
│   ├── delphi/              # Apollo's sanctuary
│   ├── lebadeia/            # Well of Mnemosyne
│   ├── delos/               # Sacred island
│   ├── necromanteion/       # Oracle of the Dead
│   └── olympus/             # Mount Olympus
├── backgrounds/
│   ├── combat/              # Battle backgrounds
│   └── exploration/         # Parallax layers
└── audio/
    ├── music/               # BGM tracks
    └── sfx/                 # Sound effects
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

### Sprite Sheets
```
{character}_{animation}_sheet.png

Examples:
  alkmaeon_walk_sheet.png    (8 frames horizontal)
  brasidas_attack_sheet.png  (6 frames horizontal)
```

### Portraits (64x64 or 96x96)
```
{character}_portrait_{expression}.png

Examples:
  alkmaeon_portrait_neutral.png
  alkmaeon_portrait_surprised.png
  theano_portrait_sad.png
  brasidas_portrait_angry.png
```

### Enemies
```
{enemy_id}_{animation}_{frame}.png

Examples:
  empusa_idle_01.png
  python_attack_sheet.png
  typhon_phase2_idle_01.png
```

### Tilesets
```
{location}_tileset.png       (main tileset atlas)
{location}_autotile.png      (for terrain autotiling)
{location}_objects.png       (decorative objects)

Examples:
  thespiae_tileset.png
  delphi_autotile.png
  necromanteion_objects.png
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
- [ ] Alkmaeon — sprites (32x32)
- [ ] Alkmaeon — portrait
- [ ] Theano — sprites (32x32)
- [ ] Theano — portrait
- [ ] Brasidas — sprites (32x32)
- [ ] Brasidas — portrait

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
