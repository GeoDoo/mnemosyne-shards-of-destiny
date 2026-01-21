# Mnemosyne: Shards of Destiny

A turn-based RPG built with Godot 4, where a young hero uncovers divine memories at an ancient Temple of Apollo.

## Story

*In a humble village nestled beneath starlit mountains, a young boy's destiny begins to stir the moment he steps among the shattered pillars of an ancient Temple of Apollo. As he walks through the silent ruins, radiant yet unsettling flashes of a forgotten past blaze across his mind — visions that feel both alien and unmistakably his own. With each return to the sacred site, the memories burn brighter, as if the stones themselves are awakening to call him. High above, a rare Red Moon swells in the heavens — or perhaps a celestial alignment foretold by the secretive teachings of the Orphics begins to take shape — and with it, the visions surge with divine intensity. Compelled by a force greater than fear, the boy feels a heroic summons rising in his heart, drawing him beyond his village and into a world of gods, mysteries, and ancient truths that he must uncover to understand his place in the unfolding fate of the cosmos.*

## Features

### MVP Scope
- **Turn-based Party Combat**: Classic JRPG-style battles with up to 3 party members
- **Exploration**: Top-down exploration of the village and Temple of Apollo ruins
- **Skill System**: Learn and upgrade abilities through leveling and story progression
- **Vision Sequences**: Experience divine memories that reveal the story
- **Mobile-First**: Touch controls with virtual joystick support

### Combat System
- Turn order based on Speed stat
- Attack, Skills, Defend, and Items commands
- Elemental affinities (Light, Shadow, Fire)
- Status effects and critical hits
- XP and leveling progression

### Characters
- **Alkmaeon** - Memory Seeker (protagonist) — "mighty in wrath", a name heavy with tragic fate
- **Theano** - Priestess of Demeter (healer)
- **Brasidas** - Spartan Warrior (damage dealer)

## Getting Started

### Requirements
- [Godot 4.2+](https://godotengine.org/download)

### Running the Project
1. Clone or download this repository
2. Open Godot 4
3. Click "Import" and select the `project.godot` file
4. Press F5 or click the Play button to run

### Mobile Export
1. Configure Android/iOS export templates in Godot
2. Go to Project > Export
3. Add Android or iOS preset
4. Configure signing and build

## Project Structure

```
mnemosyne-shards-of-destiny/
├── assets/           # Sprites, audio, fonts
├── data/             # JSON data files (skills, enemies, characters)
├── scenes/           # Godot scene files (.tscn)
│   ├── main/         # Main menu
│   ├── exploration/  # Village, Temple
│   ├── combat/       # Battle scene
│   ├── ui/           # UI components
│   └── characters/   # Player, NPC scenes
├── scripts/          # GDScript files
│   ├── autoload/     # Singleton managers
│   ├── combat/       # Battle system
│   ├── exploration/  # Player, NPCs, interactions
│   ├── data/         # Data classes
│   └── ui/           # UI controllers
└── project.godot     # Godot project file
```

## Controls

### Keyboard
- **WASD / Arrow Keys**: Move
- **E**: Interact
- **Escape**: Menu

### Touch (Mobile)
- **Virtual Joystick**: Move
- **Tap**: Interact / Select

## Development Roadmap

### Phase 1: Foundation ✓
- Project structure
- Core managers (Game, Party, Save, Audio)
- Scene transition system

### Phase 2: Exploration
- Player movement
- NPC interaction
- Dialogue system
- Village map

### Phase 3: Combat
- Turn-based battle system
- Skills and abilities
- Enemy AI
- Victory/defeat flow

### Phase 4: Content
- Temple of Apollo area
- Vision sequences
- Story dialogue
- Additional party members

### Phase 5: Polish
- Pixel art assets
- Sound effects and music
- UI polish
- Mobile optimization

## License

All rights reserved.

## Credits

Developed by GeoDoo
