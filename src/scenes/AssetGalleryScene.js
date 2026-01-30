import Phaser from 'phaser';
import { House, HouseColors, BuildingPresets, createCottage, createHouse, createVilla, createInn, createShop, createSmith, createTemple } from '../components';

/**
 * AssetGalleryScene - A storybook-style catalog view for previewing game assets
 * 
 * Navigation:
 *   - Arrow keys: scroll through assets
 *   - ESC: return to main menu
 *   - R: refresh/rebuild assets
 */
export default class AssetGalleryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AssetGalleryScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Background (fixed)
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
    
    // Create scrollable container - EVERYTHING scrolls together
    this.scrollY = 0;
    this.maxScroll = 0;
    this.assetContainer = this.add.container(0, 0);
    
    // Create the building variants (this adds title too)
    this.createHouseVariants();
    
    // Input (ESC still works to go back)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    
    // Mouse wheel scrolling
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      this.scrollY = Phaser.Math.Clamp(this.scrollY + deltaY * 0.8, 0, this.maxScroll);
      this.assetContainer.setY(-this.scrollY);
    });
  }

  createHouseVariants() {
    const { width } = this.cameras.main;
    
    // Clear existing
    this.assetContainer.removeAll(true);
    this.houses = [];
    
    // Title (scrolls with content) - with proper spacing
    const title = this.add.text(width / 2, 100, 'ASSET GALLERY', {
      fontSize: '64px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.assetContainer.add(title);
    
    // Subtitle
    const subtitle = this.add.text(width / 2, 180, 'Ancient Greek Building Components', {
      fontSize: '32px',
      fill: '#888888'
    }).setOrigin(0.5);
    this.assetContainer.add(subtitle);
    
    const startY = 400;
    const rowHeight = 550;
    
    // Define building variants
    const variants = [
      // Home variants
      { label: 'COTTAGE', description: 'Simple dwelling for common folk', config: BuildingPresets.cottage },
      { label: 'HOUSE', description: 'Standard family residence', config: BuildingPresets.house },
      { label: 'VILLA', description: 'Wealthy residence with garden', config: BuildingPresets.villa },
      // Commercial
      { label: 'INN', description: 'Rest and recover HP/MP', config: BuildingPresets.inn },
      { label: 'SHOP', description: 'Buy and sell items', config: BuildingPresets.shop },
      { label: 'SMITH', description: 'Weapons and armor', config: BuildingPresets.smith },
      // Temples
      { label: 'Temple of Apollo', description: 'God of light and prophecy', config: BuildingPresets.temple.apollo },
      { label: 'Temple of Mnemosyne', description: 'Keeper of cosmic memory', config: BuildingPresets.temple.mnemosyne },
      { label: 'Temple of Hecate', description: 'Guide at thresholds', config: BuildingPresets.temple.hecate }
    ];
    
    // ONE building per row - LOTS OF SPACE
    variants.forEach((variant, index) => {
      const cardX = width / 2;
      const cardY = startY + index * rowHeight;
      
      // Wide card background with padding
      const card = this.add.rectangle(cardX, cardY, 1600, rowHeight - 80, 0x222233, 0.95);
      card.setStrokeStyle(1, 0x333344);
      this.assetContainer.add(card);
      
      // Building on the RIGHT side of the card
      const buildingX = cardX + 350;
      const house = new House(this, {
        x: buildingX,
        y: cardY,
        ...variant.config
      });
      this.assetContainer.add(house.getContainer());
      this.houses.push(house);
      
      // Text on the LEFT side - plenty of room
      const textX = cardX - 600;
      
      // Label - BIG
      const label = this.add.text(textX, cardY - 80, variant.label, {
        fontSize: '48px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0, 0.5);
      this.assetContainer.add(label);
      
      // Description
      const desc = this.add.text(textX, cardY, variant.description, {
        fontSize: '28px',
        fill: '#bbbbbb'
      }).setOrigin(0, 0.5);
      this.assetContainer.add(desc);
      
      // Config summary
      const summary = house.getConfigSummary();
      const summaryText = this.add.text(textX, cardY + 70, summary, {
        fontSize: '20px',
        fill: '#777777'
      }).setOrigin(0, 0.5);
      this.assetContainer.add(summaryText);
    });
    
    // Calculate max scroll
    const contentHeight = startY + variants.length * rowHeight + 100;
    this.maxScroll = Math.max(0, contentHeight - this.cameras.main.height);
  }

  update() {
    // Scroll with arrow keys
    const scrollSpeed = 15;
    
    if (this.cursors.up.isDown) {
      this.scrollY = Math.max(0, this.scrollY - scrollSpeed);
      this.assetContainer.setY(-this.scrollY);
    }
    if (this.cursors.down.isDown) {
      this.scrollY = Math.min(this.maxScroll, this.scrollY + scrollSpeed);
      this.assetContainer.setY(-this.scrollY);
    }
    
    // ESC to return to menu
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.scene.start('MainMenuScene');
    }
  }
}
