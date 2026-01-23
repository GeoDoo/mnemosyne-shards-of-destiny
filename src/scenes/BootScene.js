import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Georgia, serif'
    });
    loadingText.setOrigin(0.5);

    // Progress bar background
    const progressBarBg = this.add.rectangle(width / 2, height / 2, 400, 30, 0x222222);
    progressBarBg.setOrigin(0.5);

    // Progress bar fill
    const progressBar = this.add.rectangle(width / 2 - 195, height / 2, 0, 20, 0xd4af37);
    progressBar.setOrigin(0, 0.5);

    // Update progress bar
    this.load.on('progress', (value) => {
      progressBar.width = 390 * value;
    });

    // Load UI assets
    this.load.image('main_menu_bg', 'assets/ui/main_menu_bg.png');
    this.load.image('victory_screen', 'assets/ui/victory_screen.png');
    this.load.image('gameover_screen', 'assets/ui/gameover_screen.png');

    // Load combat backgrounds
    this.load.image('bg_village', 'assets/tilesets/combat/bg_village.png');
    this.load.image('bg_temple', 'assets/tilesets/combat/bg_temple.png');
    this.load.image('bg_mountain', 'assets/tilesets/combat/bg_mountain.png');
    this.load.image('bg_cave', 'assets/tilesets/combat/bg_cave.png');
    this.load.image('bg_divine', 'assets/tilesets/combat/bg_divine.png');
    this.load.image('bg_final', 'assets/tilesets/combat/bg_final.png');

    // Load exploration tilesets
    this.load.image('tileset_thespiae', 'assets/tilesets/exploration/thespiae_tileset.png');
    this.load.image('tileset_temple', 'assets/tilesets/exploration/temple_tileset.png');

    // Load party portraits
    this.load.image('portrait_alkmaeon', 'assets/portraits/party/alkmaeon_portrait.png');
    this.load.image('portrait_theano', 'assets/portraits/party/theano_portrait.png');
    this.load.image('portrait_brasidas', 'assets/portraits/party/brasidas_portrait.png');

    // Load NPC portraits
    this.load.image('portrait_epimenides', 'assets/portraits/npcs/epimenides_portrait.png');
    this.load.image('portrait_damon', 'assets/portraits/npcs/damon_portrait.png');
    this.load.image('portrait_kleio', 'assets/portraits/npcs/kleio_portrait.png');
    this.load.image('portrait_mother', 'assets/portraits/npcs/mother_portrait.png');
    this.load.image('portrait_arete', 'assets/portraits/npcs/arete_portrait.png');

    // Load character images (use portraits as stand-in sprites for now)
    this.load.image('sprite_alkmaeon', 'assets/portraits/party/alkmaeon_portrait.png');
    this.load.image('sprite_theano', 'assets/portraits/party/theano_portrait.png');
    this.load.image('sprite_brasidas', 'assets/portraits/party/brasidas_portrait.png');
    this.load.image('sprite_epimenides', 'assets/portraits/npcs/epimenides_portrait.png');

    // Load JSON data
    this.load.json('characters', 'data/characters.json');
    this.load.json('enemies', 'data/enemies.json');
    this.load.json('skills', 'data/skills.json');
    this.load.json('dialogues', 'data/dialogues.json');
  }

  create() {
    // Store loaded data in registry for global access
    this.registry.set('characters', this.cache.json.get('characters'));
    this.registry.set('enemies', this.cache.json.get('enemies'));
    this.registry.set('skills', this.cache.json.get('skills'));
    this.registry.set('dialogues', this.cache.json.get('dialogues'));

    // Initialize game state
    this.registry.set('gameState', {
      currentScene: 'village',
      party: [],
      inventory: [],
      currency: 0,
      storyFlags: {}
    });

    // Start main menu
    this.scene.start('MainMenuScene');
  }
}
