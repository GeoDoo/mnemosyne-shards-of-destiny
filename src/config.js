import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import VillageScene from './scenes/VillageScene.js';
import BattleScene from './scenes/BattleScene.js';

// Game configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 540,
  height: 960,
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, MainMenuScene, VillageScene, BattleScene],
  pixelArt: true,
  roundPixels: true
};

export default config;
