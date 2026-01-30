/**
 * House - A modular, customizable Greek house/building component
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const house = new House(scene, {
 *     x: 300, y: 250,
 *     width: 200, height: 150,
 *     preset: 'inn'  // or custom config
 *   });
 */
import Component from '../_base/Component.js';

// Preset color palettes for easy configuration
export const HouseColors = {
  roof: {
    terracotta: 0xb85535,
    terracottaLight: 0xc86545,
    blue: 0x4466aa,
    gray: 0x888888,
    brown: 0x6b4c38,
    dark: 0x3a3a4a
  },
  wall: {
    cream: 0xf0e8d8,
    white: 0xf5f5f0,
    tan: 0xe8e0d0,
    stone: 0xd4c4a8,
    stucco: 0xc9b898,
    marble: 0xf0f0f5
  },
  door: {
    darkWood: 0x5c4033,
    lightWood: 0x6b4c3b,
    oak: 0x8b6b4a,
    painted: 0x4466aa,
    iron: 0x4a4a5a
  },
  trim: {
    gold: 0xccaa44,
    blue: 0x4466aa,
    purple: 0x663366,
    red: 0xaa4444,
    green: 0x447744,
    none: null
  }
};

// Preset building configurations
export const BuildingPresets = {
  // Home variants
  cottage: {
    width: 140,
    height: 100,
    wallColor: HouseColors.wall.cream,
    wallHighlightColor: 0xf8f0e0,
    roofColor: HouseColors.roof.terracotta,
    roofHighlightColor: HouseColors.roof.terracottaLight,
    doorColor: HouseColors.door.darkWood,
    doorHighlightColor: HouseColors.door.lightWood,
    windows: [{ side: 'left', hasShutters: true, shutterColor: 0x4466aa }],
    decorations: [],
    buildingType: 'home'
  },
  
  house: {
    width: 180,
    height: 140,
    wallColor: HouseColors.wall.tan,
    wallHighlightColor: 0xf0e8d8,
    roofColor: HouseColors.roof.terracotta,
    roofHighlightColor: HouseColors.roof.terracottaLight,
    doorColor: HouseColors.door.darkWood,
    doorHighlightColor: HouseColors.door.lightWood,
    windows: [
      { side: 'left', hasShutters: true, shutterColor: 0x4466aa },
      { side: 'right', hasShutters: true, shutterColor: 0x4466aa }
    ],
    decorations: ['flowerPot'],
    buildingType: 'home'
  },
  
  villa: {
    width: 260,
    height: 180,
    wallColor: HouseColors.wall.marble,
    wallHighlightColor: 0xffffff,
    roofColor: HouseColors.roof.terracotta,
    roofHighlightColor: HouseColors.roof.terracottaLight,
    doorColor: HouseColors.door.oak,
    doorHighlightColor: 0x9b7b5a,
    trim: HouseColors.trim.gold,
    windows: [
      { side: 'left', hasShutters: true, shutterColor: 0x6b4c38 },
      { side: 'right', hasShutters: true, shutterColor: 0x6b4c38 }
    ],
    decorations: ['flowerPot', { type: 'tree' }],
    buildingType: 'home'
  },

  // Civic buildings
  barracks: {
    width: 220,
    height: 160,
    wallColor: 0xb0a090,
    wallHighlightColor: 0xc0b0a0,
    roofColor: HouseColors.roof.dark,
    roofHighlightColor: 0x4a4a5a,
    doorColor: HouseColors.door.iron,
    doorHighlightColor: 0x5a5a6a,
    windows: [
      { side: 'left', hasShutters: true, shutterColor: 0x3a3a4a },
      { side: 'right', hasShutters: true, shutterColor: 0x3a3a4a }
    ],
    decorations: [{ type: 'sign', symbol: 'hammer' }],
    buildingType: 'civic'
  },
  
  guardPost: {
    width: 120,
    height: 100,
    wallColor: 0xc0b8a8,
    wallHighlightColor: 0xd0c8b8,
    roofColor: HouseColors.roof.terracotta,
    roofHighlightColor: HouseColors.roof.terracottaLight,
    doorColor: HouseColors.door.darkWood,
    doorHighlightColor: HouseColors.door.lightWood,
    windows: [{ side: 'right' }],
    decorations: ['torch'],
    buildingType: 'civic'
  },
  
  oracle: {
    width: 180,
    height: 150,
    wallColor: HouseColors.wall.marble,
    wallHighlightColor: 0xffffff,
    roofColor: 0x6a6a8a,
    roofHighlightColor: 0x7a7a9a,
    doorColor: 0x5a5a7a,
    trim: 0x8888bb,
    windows: [],
    decorations: ['columns', 'amphora'],
    buildingType: 'civic'
  },

  inn: {
    width: 260,
    height: 180,
    wallColor: 0xe8d8c0,
    wallHighlightColor: 0xf0e0c8,
    roofColor: HouseColors.roof.brown,
    roofHighlightColor: 0x7b5c48,
    doorColor: HouseColors.door.oak,
    doorHighlightColor: 0x9b7b5a,
    trim: HouseColors.trim.gold,
    windows: [
      { side: 'left', hasShutters: true, shutterColor: 0x6b4c38 },
      { side: 'right', hasShutters: true, shutterColor: 0x6b4c38 }
    ],
    decorations: ['torch', 'hangingPlant', { type: 'sign', symbol: 'bed' }],
    buildingType: 'inn'
  },
  
  shop: {
    width: 200,
    height: 150,
    wallColor: HouseColors.wall.tan,
    wallHighlightColor: 0xf0e8d8,
    roofColor: HouseColors.roof.terracotta,
    roofHighlightColor: HouseColors.roof.terracottaLight,
    doorColor: HouseColors.door.lightWood,
    trim: HouseColors.trim.blue,
    windows: [
      { side: 'left', hasShutters: false },
      { side: 'right', hasShutters: false }
    ],
    decorations: ['amphora', 'flowerPot', { type: 'sign', symbol: 'potion' }],
    buildingType: 'shop'
  },
  
  smith: {
    width: 220,
    height: 160,
    wallColor: 0xc0b0a0,
    wallHighlightColor: 0xd0c0b0,
    roofColor: HouseColors.roof.dark,
    roofHighlightColor: 0x4a4a5a,
    doorColor: HouseColors.door.iron,
    doorHighlightColor: 0x5a5a6a,
    trim: 0x8b4513,
    windows: [{ side: 'left', hasShutters: true, shutterColor: 0x3a3a4a }],
    decorations: ['forge', 'anvil', { type: 'sign', symbol: 'hammer' }],
    buildingType: 'smith'
  },
  
  temple: {
    apollo: {
      width: 260,
      height: 200,
      wallColor: HouseColors.wall.marble,
      wallHighlightColor: 0xffffff,
      roofColor: HouseColors.roof.gray,
      roofHighlightColor: 0x999999,
      doorColor: 0x8b7355,
      trim: HouseColors.trim.gold,
      windows: [],
      decorations: ['columns', 'pediment', { type: 'statue', god: 'apollo' }],
      buildingType: 'temple',
      deity: 'apollo'
    },
    mnemosyne: {
      width: 240,
      height: 180,
      wallColor: 0xe8e8f0,
      wallHighlightColor: 0xf0f0f8,
      roofColor: 0x6a6a8a,
      roofHighlightColor: 0x7a7a9a,
      doorColor: 0x5a5a7a,
      trim: 0x8888bb,
      windows: [],
      decorations: ['columns', 'pediment', { type: 'statue', god: 'mnemosyne' }],
      buildingType: 'temple',
      deity: 'mnemosyne'
    },
    hecate: {
      width: 220,
      height: 170,
      wallColor: 0x2a2a35,
      wallHighlightColor: 0x3a3a45,
      roofColor: 0x1a1a25,
      roofHighlightColor: 0x2a2a35,
      doorColor: 0x3a3a4a,
      trim: 0x663366,
      windows: [],
      decorations: ['columns', 'pediment', { type: 'statue', god: 'hecate' }],
      buildingType: 'temple',
      deity: 'hecate'
    }
  }
};

// Factory functions - Home variants
export function createCottage(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.cottage, ...options });
}

export function createHouse(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.house, ...options });
}

export function createVilla(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.villa, ...options });
}

// Factory functions - Civic
export function createBarracks(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.barracks, ...options });
}

export function createGuardPost(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.guardPost, ...options });
}

export function createOracle(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.oracle, ...options });
}

// Factory functions - Commercial
export function createInn(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.inn, ...options });
}

export function createShop(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.shop, ...options });
}

export function createSmith(scene, x, y, options = {}) {
  return new House(scene, { x, y, ...BuildingPresets.smith, ...options });
}

export function createTemple(scene, x, y, deity = 'apollo', options = {}) {
  const preset = BuildingPresets.temple[deity] || BuildingPresets.temple.apollo;
  return new House(scene, { x, y, ...preset, ...options });
}

export default class House extends Component {
  // Default configuration
  static Defaults = {
    width: 180,
    height: 140,
    roofColor: HouseColors.roof.terracotta,
    roofHighlightColor: HouseColors.roof.terracottaLight,
    wallColor: HouseColors.wall.cream,
    wallHighlightColor: 0xf5efe5,
    doorColor: HouseColors.door.darkWood,
    doorHighlightColor: HouseColors.door.lightWood,
    doorPosition: 'center',
    windows: [{ side: 'left' }, { side: 'right' }],
    trim: null,
    decorations: [],
    hasCollider: false,
    label: null
  };
  
  constructor(scene, config = {}) {
    // Handle wallHighlightColor default based on wallColor
    if (config.wallColor && !config.wallHighlightColor) {
      config.wallHighlightColor = config.wallColor + 0x080808;
    }
    
    super(scene, config);
  }
  
  _build() {
    // Build the house from bottom to top
    this._createShadow();
    this._createWalls();
    this._createRoof();
    this._createDoor();
    this._createWindows();
    this._createDecorations();
    
    // Create collider if requested
    if (this.config.hasCollider) {
      this._createBuildingCollider();
    }
  }
  
  _createShadow() {
    const { width, height } = this.config;
    const shadow = this.scene.add.rectangle(4, 4, width, height, 0x000000, 0.3);
    this.container.add(shadow);
  }
  
  _createWalls() {
    const { width, height, wallColor, wallHighlightColor } = this.config;
    
    const wallOuter = this.scene.add.rectangle(0, 0, width, height, wallColor);
    this.container.add(wallOuter);
    
    const wallInner = this.scene.add.rectangle(0, 0, width - 4, height - 4, wallHighlightColor);
    this.container.add(wallInner);
    
    const textureLines = this.scene.add.graphics();
    textureLines.lineStyle(1, wallColor, 0.3);
    for (let i = -height/2 + 20; i < height/2 - 20; i += 25) {
      textureLines.moveTo(-width/2 + 10, i);
      textureLines.lineTo(width/2 - 10, i);
    }
    textureLines.strokePath();
    this.container.add(textureLines);
  }
  
  _createRoof() {
    const { width, height, roofColor, roofHighlightColor, trim } = this.config;
    
    const roofWidth = width + 20;
    const roofHeight = 40;
    const wallTop = -height / 2;
    
    const roof = this.scene.add.graphics();
    
    roof.fillStyle(roofColor);
    roof.beginPath();
    roof.moveTo(-roofWidth / 2, wallTop);
    roof.lineTo(0, wallTop - roofHeight);
    roof.lineTo(roofWidth / 2, wallTop);
    roof.closePath();
    roof.fillPath();
    
    roof.fillStyle(roofHighlightColor);
    roof.beginPath();
    roof.moveTo(-roofWidth / 2 + 3, wallTop - 2);
    roof.lineTo(0, wallTop - roofHeight + 5);
    roof.lineTo(0, wallTop - 2);
    roof.closePath();
    roof.fillPath();
    
    roof.lineStyle(1, roofColor - 0x111111, 0.4);
    for (let row = 0; row < 3; row++) {
      const yOffset = wallTop - 8 - (row * 10);
      const rowWidth = roofWidth * (1 - row * 0.25);
      roof.moveTo(-rowWidth / 2 + 10, yOffset);
      roof.lineTo(rowWidth / 2 - 10, yOffset);
    }
    roof.strokePath();
    
    this.container.add(roof);
    
    const ridgeCap = this.scene.add.rectangle(0, wallTop - roofHeight + 4, 24, 8, roofColor - 0x222222);
    this.container.add(ridgeCap);
    
    if (trim) {
      const trimLine = this.scene.add.rectangle(0, wallTop + 2, width + 10, 4, trim);
      this.container.add(trimLine);
    }
  }
  
  _createDoor() {
    const { width, height, doorColor, doorHighlightColor, doorPosition, buildingType } = this.config;
    
    let doorX = 0;
    if (doorPosition === 'left') doorX = -width / 4;
    else if (doorPosition === 'right') doorX = width / 4;
    
    const isTemple = buildingType === 'temple';
    const doorWidth = isTemple ? 90 : 32;
    const doorHeight = isTemple ? 150 : 60;
    const doorY = height / 2 - doorHeight / 2;
    
    const doorFrame = this.scene.add.rectangle(doorX, doorY, doorWidth, doorHeight, doorColor);
    this.container.add(doorFrame);
    
    const doorPanel = this.scene.add.rectangle(doorX, doorY, doorWidth - 6, doorHeight - 6, doorHighlightColor);
    this.container.add(doorPanel);
    
    const handleX = doorX + doorWidth / 2 - 7;
    const handle = this.scene.add.circle(handleX, doorY, isTemple ? 4 : 3, 0x8b7355);
    this.container.add(handle);
    
    const arch = this.scene.add.graphics();
    arch.fillStyle(doorColor);
    arch.fillEllipse(doorX, doorY - doorHeight / 2 + 3, doorWidth - 2, isTemple ? 14 : 10);
    this.container.add(arch);
  }
  
  _createWindows() {
    const { width, height, windows } = this.config;
    
    if (!windows || windows.length === 0) return;
    
    windows.forEach((windowConfig, index) => {
      const side = windowConfig.side ?? (index % 2 === 0 ? 'left' : 'right');
      const yOffset = windowConfig.y ?? -5;
      
      let windowX;
      if (side === 'left') windowX = -width / 4;
      else if (side === 'right') windowX = width / 4;
      else windowX = windowConfig.x ?? 0;
      
      const windowWidth = windowConfig.width ?? 28;
      const windowHeight = windowConfig.height ?? 36;
      
      const frame = this.scene.add.rectangle(windowX, yOffset, windowWidth + 6, windowHeight + 6, 0xcccccc);
      this.container.add(frame);
      
      const opening = this.scene.add.rectangle(windowX, yOffset, windowWidth, windowHeight, 0x2a2a35);
      this.container.add(opening);
      
      const reflection = this.scene.add.rectangle(windowX - 4, yOffset - 6, 8, 12, 0x4a4a55, 0.5);
      this.container.add(reflection);
      
      if (windowConfig.hasShutters) {
        const shutterColor = windowConfig.shutterColor ?? 0x4466aa;
        const leftShutter = this.scene.add.rectangle(windowX - windowWidth / 2 - 5, yOffset, 8, windowHeight, shutterColor);
        this.container.add(leftShutter);
        const rightShutter = this.scene.add.rectangle(windowX + windowWidth / 2 + 5, yOffset, 8, windowHeight, shutterColor);
        this.container.add(rightShutter);
      }
    });
  }
  
  _createDecorations() {
    const { width, height, decorations } = this.config;
    
    if (!decorations || decorations.length === 0) return;
    
    decorations.forEach(deco => {
      if (deco === 'flowerPot' || deco.type === 'flowerPot') {
        this._drawFlowerPot(deco.x ?? width / 4, height / 2 - 10);
      }
      if (deco === 'hangingPlant' || deco.type === 'hangingPlant') {
        this._drawHangingPlant(deco.x ?? -width / 3, -height / 2 + 20);
      }
      if (deco === 'amphora' || deco.type === 'amphora') {
        this._drawAmphora(deco.x ?? -width / 3, height / 2 - 25);
      }
      if (deco === 'torch' || deco.type === 'torch') {
        this._drawTorch(deco.x ?? width / 2 - 15, deco.y ?? -15);
      }
      if (deco.type === 'sign') {
        this._drawSign(deco.x ?? 0, -height / 2 - 55, deco.symbol);
      }
      if (deco.type === 'tree') {
        this._drawTree(deco.x ?? width / 2 + 60, height / 2 - 30);
      }
      if (deco === 'forge' || deco.type === 'forge') {
        this._drawForge(deco.x ?? -width / 2 - 50, height / 2 - 20);
      }
      if (deco === 'anvil' || deco.type === 'anvil') {
        this._drawAnvil(deco.x ?? width / 2 + 45, height / 2 - 10);
      }
      if (deco === 'columns' || deco.type === 'columns') {
        this._drawColumns();
      }
      if (deco === 'pediment' || deco.type === 'pediment') {
        this._drawPediment();
      }
      if (deco.type === 'statue') {
        this._drawStatue(deco.god ?? 'apollo', deco.x ?? this.config.width / 2 + 35);
      }
    });
  }
  
  _drawFlowerPot(potX, potY) {
    const pot = this.scene.add.graphics();
    pot.fillStyle(0xb86b4a);
    pot.fillEllipse(potX, potY, 24, 16);
    pot.fillRect(potX - 10, potY - 18, 20, 18);
    pot.fillStyle(0x4a8a4a);
    pot.fillCircle(potX - 5, potY - 26, 10);
    pot.fillCircle(potX + 6, potY - 30, 8);
    pot.fillStyle(0xff6688);
    pot.fillCircle(potX, potY - 35, 6);
    this.container.add(pot);
  }
  
  _drawHangingPlant(plantX, plantY) {
    const plant = this.scene.add.graphics();
    plant.lineStyle(4, 0x3a6b32);
    plant.moveTo(plantX, plantY);
    plant.lineTo(plantX - 12, plantY + 35);
    plant.moveTo(plantX, plantY);
    plant.lineTo(plantX + 8, plantY + 28);
    plant.moveTo(plantX, plantY);
    plant.lineTo(plantX - 5, plantY + 25);
    plant.strokePath();
    plant.fillStyle(0x4a8a4a);
    plant.fillCircle(plantX - 12, plantY + 35, 8);
    plant.fillCircle(plantX + 8, plantY + 28, 7);
    plant.fillCircle(plantX - 5, plantY + 25, 6);
    this.container.add(plant);
  }
  
  _drawAmphora(ampX, ampY) {
    const amphora = this.scene.add.graphics();
    amphora.fillStyle(0xb86b4a);
    amphora.fillEllipse(ampX, ampY, 22, 35);
    amphora.fillStyle(0xa05a3a);
    amphora.fillEllipse(ampX, ampY - 22, 12, 8);
    amphora.lineStyle(4, 0xa05a3a);
    amphora.strokeCircle(ampX - 14, ampY - 10, 8);
    amphora.strokeCircle(ampX + 14, ampY - 10, 8);
    this.container.add(amphora);
  }
  
  _drawTorch(torchX, torchY) {
    const torch = this.scene.add.graphics();
    torch.fillStyle(0x555555);
    torch.fillRect(torchX, torchY, 8, 40);
    torch.fillStyle(0x8b6914);
    torch.fillRect(torchX - 4, torchY - 10, 16, 16);
    torch.fillStyle(0xff6622);
    torch.fillTriangle(torchX + 4, torchY - 10, torchX - 6, torchY - 35, torchX + 14, torchY - 35);
    torch.fillStyle(0xffaa44);
    torch.fillTriangle(torchX + 4, torchY - 14, torchX, torchY - 30, torchX + 8, torchY - 30);
    this.container.add(torch);
  }
  
  _drawSign(signX, signY, symbol) {
    const gfx = this.scene.add.graphics();
    gfx.fillStyle(0x4a3a2a);
    gfx.fillRect(signX - 4, signY + 45, 8, 40);
    
    if (symbol === 'bed') {
      gfx.fillStyle(0x8b7355);
      gfx.fillRect(signX - 40, signY + 35, 10, 8);
      gfx.fillRect(signX + 30, signY + 35, 10, 8);
      gfx.fillRect(signX - 40, signY - 15, 10, 58);
      gfx.fillRect(signX + 30, signY + 10, 10, 33);
      gfx.fillRect(signX - 40, signY + 27, 80, 8);
      gfx.fillStyle(0xd4c8b8);
      gfx.fillRoundedRect(signX - 28, signY, 56, 26, 5);
      gfx.fillStyle(0xeee8dd);
      gfx.fillRoundedRect(signX - 25, signY - 10, 22, 16, 6);
      gfx.fillStyle(0xc9b8a0);
      gfx.fillRect(signX - 28, signY + 14, 56, 12);
    } else if (symbol === 'potion') {
      gfx.fillStyle(0x4a9a4a);
      gfx.fillEllipse(signX, signY + 15, 55, 60);
      gfx.fillStyle(0x5ab85a);
      gfx.fillEllipse(signX - 12, signY + 5, 16, 30);
      gfx.fillStyle(0xd4c8b8);
      gfx.fillRect(signX - 10, signY - 32, 20, 22);
      gfx.fillStyle(0x8b6b4b);
      gfx.fillRoundedRect(signX - 13, signY - 45, 26, 16, 5);
      gfx.fillStyle(0x6ac86a);
      gfx.fillEllipse(signX + 10, signY + 20, 10, 14);
    } else if (symbol === 'hammer') {
      gfx.fillStyle(0xa08060);
      gfx.fillRoundedRect(signX - 6, signY - 5, 12, 65, 3);
      gfx.fillStyle(0x806040);
      gfx.fillRect(signX - 6, signY + 35, 12, 6);
      gfx.fillRect(signX - 6, signY + 48, 12, 6);
      gfx.fillStyle(0x707070);
      gfx.fillRoundedRect(signX - 35, signY - 30, 70, 28, 4);
      gfx.fillStyle(0x909090);
      gfx.fillRect(signX - 30, signY - 24, 60, 10);
      gfx.fillStyle(0x606060);
      gfx.fillRect(signX - 35, signY - 30, 70, 5);
    }
    
    this.container.add(gfx);
  }
  
  _drawTree(treeX, treeY) {
    const tree = this.scene.add.graphics();
    tree.fillStyle(0x000000, 0.3);
    tree.fillEllipse(treeX + 4, treeY + 50, 35, 15);
    tree.fillStyle(0x5c4033);
    tree.fillRect(treeX - 10, treeY, 20, 55);
    tree.fillStyle(0x6b4c38);
    tree.fillRect(treeX - 6, treeY + 4, 12, 48);
    tree.fillStyle(0x2d5a27);
    tree.fillEllipse(treeX, treeY - 45, 32, 80);
    tree.fillStyle(0x3a6b32);
    tree.fillEllipse(treeX, treeY - 45, 24, 70);
    tree.fillStyle(0x4a8a4a);
    tree.fillEllipse(treeX - 4, treeY - 55, 16, 50);
    this.container.add(tree);
  }
  
  _drawForge(forgeX, forgeY) {
    const forge = this.scene.add.graphics();
    forge.fillStyle(0x555555);
    forge.fillRect(forgeX - 30, forgeY - 5, 60, 35);
    forge.fillStyle(0x666666);
    forge.fillRect(forgeX - 26, forgeY - 2, 52, 30);
    forge.fillStyle(0x1a1a1a);
    forge.fillEllipse(forgeX, forgeY + 5, 40, 20);
    forge.fillStyle(0xcc3300);
    forge.fillEllipse(forgeX - 8, forgeY + 2, 14, 8);
    forge.fillStyle(0xff6600);
    forge.fillEllipse(forgeX + 6, forgeY + 4, 10, 6);
    forge.fillStyle(0xff4400);
    forge.fillTriangle(forgeX - 10, forgeY, forgeX - 15, forgeY - 35, forgeX - 5, forgeY);
    forge.fillTriangle(forgeX + 5, forgeY, forgeX + 10, forgeY - 45, forgeX + 15, forgeY);
    forge.fillStyle(0xffaa00);
    forge.fillTriangle(forgeX, forgeY - 5, forgeX - 4, forgeY - 30, forgeX + 4, forgeY - 5);
    this.container.add(forge);
  }
  
  _drawAnvil(anvilX, anvilY) {
    const anvil = this.scene.add.graphics();
    anvil.fillStyle(0x5c4033);
    anvil.fillRect(anvilX - 14, anvilY, 28, 18);
    anvil.fillStyle(0x6b4c38);
    anvil.fillRect(anvilX - 12, anvilY + 2, 24, 14);
    anvil.fillStyle(0x3a3a3a);
    anvil.fillRect(anvilX - 12, anvilY - 12, 24, 14);
    anvil.fillStyle(0x5a5a5a);
    anvil.fillRect(anvilX - 22, anvilY - 18, 44, 8);
    anvil.fillTriangle(anvilX + 22, anvilY - 16, anvilX + 38, anvilY - 12, anvilX + 22, anvilY - 10);
    anvil.fillStyle(0x6a6a6a);
    anvil.fillRect(anvilX - 20, anvilY - 16, 40, 3);
    this.container.add(anvil);
  }
  
  _drawColumns() {
    const { width, height } = this.config;
    const colSpacing = width / 4;
    
    for (let i = -1; i <= 1; i += 2) {
      const colX = i * colSpacing * 0.8;
      const column = this.scene.add.graphics();
      
      column.fillStyle(0xcccccc);
      column.fillRect(colX - 10, height / 2 - 8, 20, 8);
      column.fillStyle(0xdddddd);
      column.fillRect(colX - 7, -height / 2 + 30, 14, height - 45);
      column.fillStyle(0xeeeeee);
      column.fillRect(colX - 5, -height / 2 + 32, 10, height - 49);
      column.lineStyle(1, 0xcccccc, 0.5);
      column.moveTo(colX - 3, -height / 2 + 35);
      column.lineTo(colX - 3, height / 2 - 15);
      column.moveTo(colX + 3, -height / 2 + 35);
      column.lineTo(colX + 3, height / 2 - 15);
      column.strokePath();
      column.fillStyle(0xdddddd);
      column.fillRect(colX - 10, -height / 2 + 22, 20, 6);
      column.fillRect(colX - 12, -height / 2 + 16, 24, 6);
      
      this.container.add(column);
    }
  }
  
  _drawPediment() {
    const { width, height } = this.config;
    const pedY = -height / 2 - 20;
    
    const pediment = this.scene.add.graphics();
    pediment.fillStyle(0xccccbb);
    pediment.fillRect(-width / 2 - 5, -height / 2, width + 10, 12);
    pediment.fillStyle(0xddddcc);
    pediment.beginPath();
    pediment.moveTo(-width / 2 - 10, -height / 2);
    pediment.lineTo(0, pedY - 25);
    pediment.lineTo(width / 2 + 10, -height / 2);
    pediment.closePath();
    pediment.fillPath();
    pediment.lineStyle(3, 0xbbbbaa);
    pediment.beginPath();
    pediment.moveTo(-width / 2 - 10, -height / 2);
    pediment.lineTo(0, pedY - 25);
    pediment.lineTo(width / 2 + 10, -height / 2);
    pediment.closePath();
    pediment.strokePath();
    pediment.fillStyle(0xccaa44);
    pediment.fillCircle(0, pedY - 30, 8);
    pediment.fillStyle(0xddbb55);
    pediment.fillCircle(0, pedY - 30, 5);
    
    this.container.add(pediment);
  }
  
  _drawStatue(god, statueX) {
    const { height } = this.config;
    const statueY = height / 2 - 50;
    
    const statue = this.scene.add.graphics();
    
    // Pedestal
    statue.fillStyle(0x888888);
    statue.fillRect(statueX - 18, statueY + 30, 36, 12);
    statue.fillStyle(0x999999);
    statue.fillRect(statueX - 15, statueY + 20, 30, 12);
    statue.fillStyle(0xaaaaaa);
    statue.fillRect(statueX - 12, statueY + 14, 24, 8);
    
    let statueColor = 0xcccccc;
    let accentColor = 0xccaa44;
    
    if (god === 'apollo') {
      statueColor = 0xdddddd;
      accentColor = 0xccaa44;
    } else if (god === 'mnemosyne') {
      statueColor = 0xccccdd;
      accentColor = 0x8888bb;
    } else if (god === 'hecate') {
      statueColor = 0x555566;
      accentColor = 0x663366;
    }
    
    statue.fillStyle(statueColor);
    statue.fillRect(statueX - 10, statueY - 25, 20, 40);
    statue.fillCircle(statueX, statueY - 38, 12);
    
    if (god === 'apollo') {
      statue.fillStyle(accentColor);
      statue.fillEllipse(statueX - 22, statueY - 10, 10, 18);
      statue.lineStyle(2, 0x8b6914);
      statue.moveTo(statueX - 22, statueY - 22);
      statue.lineTo(statueX - 22, statueY + 2);
      statue.strokePath();
      statue.lineStyle(1, 0xccaa44);
      for (let i = -2; i <= 2; i++) {
        statue.moveTo(statueX - 22 + i * 2, statueY - 18);
        statue.lineTo(statueX - 22 + i * 2, statueY - 2);
      }
      statue.strokePath();
      statue.fillStyle(accentColor);
      for (let i = 0; i < 7; i++) {
        const angle = -Math.PI / 2 + (i - 3) * 0.35;
        const rayX = statueX + Math.cos(angle) * 22;
        const rayY = statueY - 38 + Math.sin(angle) * 22;
        statue.fillTriangle(statueX, statueY - 45, rayX - 3, rayY, rayX + 3, rayY);
      }
    } else if (god === 'mnemosyne') {
      statue.fillStyle(accentColor);
      statue.fillRect(statueX - 12, statueY - 5, 24, 3);
      statue.fillStyle(0x6688aa);
      statue.fillEllipse(statueX - 20, statueY - 5, 10, 14);
      statue.fillStyle(0x88aacc);
      statue.fillEllipse(statueX - 20, statueY - 5, 7, 10);
      statue.fillStyle(0xaaccee);
      statue.fillEllipse(statueX - 22, statueY - 8, 3, 4);
      statue.fillStyle(accentColor);
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i - 2) * 0.5;
        const starX = statueX + Math.cos(angle) * 18;
        const starY = statueY - 38 + Math.sin(angle) * 18;
        statue.fillCircle(starX, starY - 8, 3);
      }
    } else if (god === 'hecate') {
      statue.fillStyle(0x8b6914);
      statue.fillRect(statueX - 25, statueY - 45, 4, 50);
      statue.fillRect(statueX + 21, statueY - 45, 4, 50);
      statue.fillRect(statueX - 2, statueY - 55, 4, 60);
      statue.fillStyle(0x663366);
      statue.fillTriangle(statueX - 23, statueY - 45, statueX - 28, statueY - 58, statueX - 18, statueY - 58);
      statue.fillTriangle(statueX + 23, statueY - 45, statueX + 18, statueY - 58, statueX + 28, statueY - 58);
      statue.fillTriangle(statueX, statueY - 55, statueX - 6, statueY - 70, statueX + 6, statueY - 70);
      statue.fillStyle(0x8844aa);
      statue.fillTriangle(statueX - 23, statueY - 48, statueX - 26, statueY - 55, statueX - 20, statueY - 55);
      statue.fillTriangle(statueX + 23, statueY - 48, statueX + 20, statueY - 55, statueX + 26, statueY - 55);
      statue.fillTriangle(statueX, statueY - 58, statueX - 4, statueY - 66, statueX + 4, statueY - 66);
      statue.fillStyle(accentColor);
      statue.fillRect(statueX - 15, statueY + 8, 30, 3);
      statue.fillRect(statueX - 1, statueY + 2, 3, 12);
    }
    
    this.container.add(statue);
  }
  
  _createBuildingCollider() {
    const { width, height } = this.config;
    this._createCollider(width + 10, height + 10);
  }
  
  // Get config summary for debugging
  getConfigSummary() {
    const { width, height, doorPosition, windows, decorations } = this.config;
    return `${width}x${height}, door: ${doorPosition}, windows: ${windows.length}, deco: ${decorations.length}`;
  }
}
