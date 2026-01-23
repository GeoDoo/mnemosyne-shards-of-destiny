import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Add background image (already has title baked in)
    const bg = this.add.image(width / 2, height / 2, 'main_menu_bg');
    bg.setDisplaySize(width, height);

    // Button styling
    const buttonStyle = {
      fontSize: '28px',
      fontFamily: 'Georgia, serif',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    };

    const buttonY = height * 0.55;
    const buttonSpacing = 70;

    // New Game button
    const newGameBtn = this.createButton(width / 2, buttonY, 'New Game', buttonStyle, () => {
      this.startNewGame();
    });

    // Continue button (only show if save exists)
    const hasSave = localStorage.getItem('mnemosyne_save') !== null;
    if (hasSave) {
      const continueBtn = this.createButton(width / 2, buttonY + buttonSpacing, 'Continue', buttonStyle, () => {
        this.continueGame();
      });
    }

    // Settings button
    const settingsBtn = this.createButton(
      width / 2, 
      buttonY + buttonSpacing * (hasSave ? 2 : 1), 
      'Settings', 
      buttonStyle, 
      () => {
        this.openSettings();
      }
    );

    // Quit button (only relevant for desktop)
    const quitBtn = this.createButton(
      width / 2, 
      buttonY + buttonSpacing * (hasSave ? 3 : 2), 
      'Quit', 
      buttonStyle, 
      () => {
        this.quitGame();
      }
    );

    // Add subtle animation to buttons
    this.tweens.add({
      targets: [newGameBtn],
      alpha: { from: 0, to: 1 },
      y: { from: buttonY - 20, to: buttonY },
      duration: 500,
      ease: 'Power2'
    });
  }

  createButton(x, y, text, style, callback) {
    // Create button background
    const btnBg = this.add.rectangle(x, y, 250, 50, 0x2a2a4a, 0.8);
    btnBg.setStrokeStyle(2, 0xd4af37);
    btnBg.setInteractive({ useHandCursor: true });

    // Create button text
    const btnText = this.add.text(x, y, text, style);
    btnText.setOrigin(0.5);

    // Hover effects
    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(0x3a3a5a, 0.9);
      btnText.setScale(1.05);
    });

    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(0x2a2a4a, 0.8);
      btnText.setScale(1);
    });

    // Click handler
    btnBg.on('pointerdown', () => {
      btnBg.setFillStyle(0x1a1a3a, 1);
    });

    btnBg.on('pointerup', () => {
      btnBg.setFillStyle(0x3a3a5a, 0.9);
      callback();
    });

    return { bg: btnBg, text: btnText };
  }

  startNewGame() {
    // Initialize new game state
    const gameState = {
      currentScene: 'village',
      party: [this.createCharacter('alkmaeon')],
      inventory: [],
      currency: 0,
      storyFlags: {}
    };
    this.registry.set('gameState', gameState);

    // Transition to village
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('VillageScene');
    });
  }

  continueGame() {
    // Load saved game
    const saveData = localStorage.getItem('mnemosyne_save');
    if (saveData) {
      const gameState = JSON.parse(saveData);
      this.registry.set('gameState', gameState);
      this.scene.start('VillageScene');
    }
  }

  openSettings() {
    // TODO: Implement settings menu
    console.log('Settings not implemented yet');
  }

  quitGame() {
    // For web, just show a message or redirect
    if (confirm('Are you sure you want to quit?')) {
      window.close();
    }
  }

  createCharacter(characterId) {
    const charactersData = this.registry.get('characters');
    const charData = charactersData.party_members.find(c => c.id === characterId);
    
    if (!charData) return null;

    return {
      id: charData.id,
      name: charData.display_name,
      class: charData.character_class,
      level: 1,
      experience: 0,
      hp: charData.base_stats.max_hp,
      maxHp: charData.base_stats.max_hp,
      mp: charData.base_stats.max_mp,
      maxMp: charData.base_stats.max_mp,
      attack: charData.base_stats.attack,
      defense: charData.base_stats.defense,
      magic: charData.base_stats.magic,
      speed: charData.base_stats.speed,
      luck: charData.base_stats.luck,
      skills: charData.starting_skills || ['basic_attack', 'defend'],
      equipment: { weapon: null, armor: null, accessory: null }
    };
  }
}
