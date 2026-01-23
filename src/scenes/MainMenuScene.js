import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    const bg = this.add.image(width / 2, height / 2, 'main_menu_bg');
    bg.setDisplaySize(width, height);

    // Menu panel
    const panelY = height * 0.6;
    this.add.rectangle(width / 2, panelY + 20, 280, 200, 0x000000, 0.7)
      .setStrokeStyle(2, 0xcccccc);

    // Buttons
    const buttons = [
      { text: 'New Game', y: panelY - 30, action: () => this.startNewGame() },
      { text: 'Continue', y: panelY + 25, action: () => this.continueGame(), disabled: !this.hasSave() },
      { text: 'Settings', y: panelY + 80, action: () => {} }
    ];

    buttons.forEach(({ text, y, action, disabled }) => {
      const btn = this.add.text(width / 2, y, text, {
        fontSize: '24px',
        fill: disabled ? '#555555' : '#ffffff',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      if (!disabled) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setColor('#ffcc00'));
        btn.on('pointerout', () => btn.setColor('#ffffff'));
        btn.on('pointerdown', action);
      }
    });

    // Fade in
    this.cameras.main.fadeIn(800);
  }

  hasSave() {
    return localStorage.getItem('mnemosyne_save') !== null;
  }

  startNewGame() {
    const gameState = {
      currentScene: 'village',
      party: [{
        id: 'alkmaeon',
        name: 'Alkmaeon',
        level: 1,
        hp: 100,
        maxHp: 100,
        mp: 40,
        maxMp: 40,
        attack: 15,
        defense: 10,
        magic: 12,
        speed: 11,
        isDefending: false
      }],
      inventory: [],
      currency: 50
    };
    this.registry.set('gameState', gameState);

    this.cameras.main.fadeOut(800);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('VillageScene');
    });
  }

  continueGame() {
    const saveData = localStorage.getItem('mnemosyne_save');
    if (saveData) {
      this.registry.set('gameState', JSON.parse(saveData));
      this.cameras.main.fadeOut(800);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('VillageScene');
      });
    }
  }
}
