# Mnemosyne: Shards of Destiny

A turn-based JRPG built with Godot 4, set in ancient Greece where a young hero uncovers divine memories and faces monsters from authentic Greek mythology.

## Story

*In the village of Thespiae, at the foot of Mount Helicon, a young man named Alkmaeon begins to experience visions — fragments of divine memory that blaze across his mind whenever he visits the nearby ruins of a Temple of Apollo. As the Red Moon rises and Typhon stirs beneath the earth, Alkmaeon must journey across Greece to recover the scattered Shards of Destiny before the Father of Monsters breaks free and plunges the world into chaos.*

*Guided by Hecate at the crossroads and haunted by echoes of Mnemosyne, he will travel from Delphi to Delos, from the springs of Lebadeia to the Necromanteion at the Acheron River — the very entrance to the underworld.*

## Features

### MVP Scope
- **Turn-based Party Combat**: Classic JRPG-style battles with up to 3 party members
- **Exploration**: Top-down exploration of authentic Greek locations
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

| Character | Class | Description |
|-----------|-------|-------------|
| **Alkmaeon** | Memory Seeker | Protagonist from Thespiae; "mighty in wrath" |
| **Theano** | Priestess of Demeter | Healer trained at Demeter's sanctuary |
| **Brasidas** | Spartan Warrior | Bold general seeking redemption |

### Locations (Real Greek Sites)

| Location | Significance |
|----------|--------------|
| **Thespiae** | Starting village at foot of Mount Helicon |
| **Delphi** | Apollo's sanctuary, home of the Pythia |
| **Lebadeia** | Springs of Lethe and Mnemosyne |
| **Delos** | Sacred island, Apollo's birthplace |
| **Necromanteion** | Oracle of the Dead at Acheron River |
| **Mount Olympus** | Home of the gods |

### Enemies (Greek Mythology)

| Monster | Description |
|---------|-------------|
| **Empusa** | Shapeshifting vampire servant of Hecate |
| **Lamia** | Child-devouring demon queen |
| **Python** | Great serpent of Delphi |
| **Melinoe** | Goddess of nightmares |
| **Echidna** | Mother of Monsters |
| **Typhon** | Father of Monsters, final boss |

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
├── assets/           # Sprites, portraits, audio
│   ├── sprites/      # Character and enemy sprites
│   └── portraits/    # Dialogue portraits (48x48)
├── data/             # JSON data files
│   ├── characters.json
│   ├── enemies.json
│   └── skills.json
├── scenes/           # Godot scene files (.tscn)
│   ├── main/         # Main menu
│   ├── exploration/  # Village, Temple
│   ├── combat/       # Battle scene
│   └── ui/           # UI components
├── scripts/          # GDScript files
│   ├── autoload/     # Singleton managers
│   ├── combat/       # Battle system
│   ├── exploration/  # Player, NPCs, interactions
│   └── ui/           # UI controllers
├── story/            # Narrative scripts (Markdown)
│   ├── 00_intro.md through 07_chapter7_binding.md
│   └── README.md     # Story bible
└── project.godot
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
- Pixel art assets (in progress)
- Sound effects and music
- UI polish
- Mobile optimization

## License

All rights reserved.

## Credits

Developed by GeoDoo
