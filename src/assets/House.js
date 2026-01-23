/**
 * House - A modular, customizable Greek house component
 * 
 * Usage:
 *   const house = new House(scene, {
 *     x: 300,
 *     y: 250,
 *     width: 200,
 *     height: 150,
 *     roofColor: 0xb85535,
 *     wallColor: 0xf0e8d8,
 *     doorColor: 0x5c4033,
 *     doorPosition: 'center',
 *     windows: [{ side: 'left' }, { side: 'right' }],
 *     decorations: ['flowerPot'],
 *     hasCollider: true
 *   });
 */

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

// Preset building configurations for specific building types
export const BuildingPresets = {
  // INN - Warm, inviting, larger building with multiple windows
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
    decorations: ['torch', 'hangingPlant', { type: 'sign', text: 'INN', symbol: 'bed', color: 0xccaa44 }],
    buildingType: 'inn'
  },
  
  // SHOP - Merchant-style with awning feel, displays goods
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
    decorations: ['amphora', 'flowerPot', { type: 'sign', text: 'SHOP', symbol: 'potion', color: 0x4466aa }],
    buildingType: 'shop'
  },
  
  // SMITH - Industrial, sturdy, darker tones with forge elements
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
    windows: [
      { side: 'left', hasShutters: true, shutterColor: 0x3a3a4a }
    ],
    decorations: ['forge', 'anvil', { type: 'sign', text: 'SMITH', symbol: 'hammer', color: 0xcc6600 }],
    buildingType: 'smith'
  },
  
  // TEMPLE - Grand, sacred, marble-like with columns and god statue
  // Only temples for gods in the story: Apollo, Mnemosyne, Hecate
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

// Factory functions to create specific building types
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

export default class House {
  /**
   * @param {Phaser.Scene} scene - The Phaser scene to add the house to
   * @param {Object} config - Configuration options
   */
  constructor(scene, config = {}) {
    this.scene = scene;
    
    // Apply defaults
    this.config = {
      x: config.x ?? 0,
      y: config.y ?? 0,
      width: config.width ?? 180,
      height: config.height ?? 140,
      roofColor: config.roofColor ?? HouseColors.roof.terracotta,
      roofHighlightColor: config.roofHighlightColor ?? HouseColors.roof.terracottaLight,
      wallColor: config.wallColor ?? HouseColors.wall.cream,
      wallHighlightColor: config.wallHighlightColor ?? (config.wallColor ? config.wallColor + 0x080808 : 0xf5efe5),
      doorColor: config.doorColor ?? HouseColors.door.darkWood,
      doorHighlightColor: config.doorHighlightColor ?? HouseColors.door.lightWood,
      doorPosition: config.doorPosition ?? 'center', // 'center', 'left', 'right'
      windows: config.windows ?? [{ side: 'left' }, { side: 'right' }],
      trim: config.trim ?? null,
      decorations: config.decorations ?? [],
      hasCollider: config.hasCollider ?? false,
      label: config.label ?? null // Optional label for gallery display
    };
    
    this.container = null;
    this.collider = null;
    
    this._create();
  }
  
  _create() {
    const { x, y, width, height } = this.config;
    
    // Create container at position
    this.container = this.scene.add.container(x, y);
    
    // Build the house from bottom to top
    this._createShadow();
    this._createWalls();
    this._createRoof();
    this._createDoor();
    this._createWindows();
    this._createDecorations();
    
    // Create collider if requested
    if (this.config.hasCollider) {
      this._createCollider();
    }
  }
  
  _createShadow() {
    const { width, height } = this.config;
    const shadow = this.scene.add.rectangle(4, 4, width, height, 0x000000, 0.3);
    this.container.add(shadow);
  }
  
  _createWalls() {
    const { width, height, wallColor, wallHighlightColor } = this.config;
    
    // Main wall (outer)
    const wallOuter = this.scene.add.rectangle(0, 0, width, height, wallColor);
    this.container.add(wallOuter);
    
    // Wall highlight (inner, slightly lighter)
    const wallInner = this.scene.add.rectangle(0, 0, width - 4, height - 4, wallHighlightColor);
    this.container.add(wallInner);
    
    // Wall texture lines (subtle horizontal bands)
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
    
    // Main roof triangle
    roof.fillStyle(roofColor);
    roof.beginPath();
    roof.moveTo(-roofWidth / 2, wallTop);
    roof.lineTo(0, wallTop - roofHeight);
    roof.lineTo(roofWidth / 2, wallTop);
    roof.closePath();
    roof.fillPath();
    
    // Left side highlight (sunlit)
    roof.fillStyle(roofHighlightColor);
    roof.beginPath();
    roof.moveTo(-roofWidth / 2 + 3, wallTop - 2);
    roof.lineTo(0, wallTop - roofHeight + 5);
    roof.lineTo(0, wallTop - 2);
    roof.closePath();
    roof.fillPath();
    
    // Roof tiles pattern
    roof.lineStyle(1, roofColor - 0x111111, 0.4);
    for (let row = 0; row < 3; row++) {
      const yOffset = wallTop - 8 - (row * 10);
      const rowWidth = roofWidth * (1 - row * 0.25);
      roof.moveTo(-rowWidth / 2 + 10, yOffset);
      roof.lineTo(rowWidth / 2 - 10, yOffset);
    }
    roof.strokePath();
    
    this.container.add(roof);
    
    // Ridge cap (top of roof)
    const ridgeCap = this.scene.add.rectangle(0, wallTop - roofHeight + 4, 24, 8, roofColor - 0x222222);
    this.container.add(ridgeCap);
    
    // Optional trim/border
    if (trim) {
      const trimLine = this.scene.add.rectangle(0, wallTop + 2, width + 10, 4, trim);
      this.container.add(trimLine);
    }
  }
  
  _createDoor() {
    const { width, height, doorColor, doorHighlightColor, doorPosition, buildingType } = this.config;
    
    // Calculate door X position
    let doorX = 0;
    if (doorPosition === 'left') {
      doorX = -width / 4;
    } else if (doorPosition === 'right') {
      doorX = width / 4;
    }
    
    // Temple doors are MASSIVE
    const isTemple = buildingType === 'temple';
    const doorWidth = isTemple ? 90 : 32;
    const doorHeight = isTemple ? 150 : 60;
    const doorY = height / 2 - doorHeight / 2;
    
    // Door frame (darker)
    const doorFrame = this.scene.add.rectangle(doorX, doorY, doorWidth, doorHeight, doorColor);
    this.container.add(doorFrame);
    
    // Door panel (lighter)
    const doorPanel = this.scene.add.rectangle(doorX, doorY, doorWidth - 6, doorHeight - 6, doorHighlightColor);
    this.container.add(doorPanel);
    
    // Door handle
    const handleX = doorX + doorWidth / 2 - 7;
    const handle = this.scene.add.circle(handleX, doorY, isTemple ? 4 : 3, 0x8b7355);
    this.container.add(handle);
    
    // Door arch (Greek style)
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
      
      // Calculate X position based on side
      let windowX;
      if (side === 'left') {
        windowX = -width / 4;
      } else if (side === 'right') {
        windowX = width / 4;
      } else {
        // 'center' or custom x position
        windowX = windowConfig.x ?? 0;
      }
      
      const windowWidth = windowConfig.width ?? 28;
      const windowHeight = windowConfig.height ?? 36;
      
      // Window frame (stone)
      const frame = this.scene.add.rectangle(windowX, yOffset, windowWidth + 6, windowHeight + 6, 0xcccccc);
      this.container.add(frame);
      
      // Window opening (dark - interior)
      const opening = this.scene.add.rectangle(windowX, yOffset, windowWidth, windowHeight, 0x2a2a35);
      this.container.add(opening);
      
      // Window reflection/light
      const reflection = this.scene.add.rectangle(windowX - 4, yOffset - 6, 8, 12, 0x4a4a55, 0.5);
      this.container.add(reflection);
      
      // Optional shutters
      if (windowConfig.hasShutters) {
        const shutterColor = windowConfig.shutterColor ?? 0x4466aa;
        // Left shutter
        const leftShutter = this.scene.add.rectangle(windowX - windowWidth / 2 - 5, yOffset, 8, windowHeight, shutterColor);
        this.container.add(leftShutter);
        // Right shutter
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
        const potX = deco.x ?? width / 4;
        const potY = height / 2 - 10;
        
        // Terracotta pot - BIGGER
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
      
      if (deco === 'hangingPlant' || deco.type === 'hangingPlant') {
        const plantX = deco.x ?? -width / 3;
        const plantY = -height / 2 + 20;
        
        // Hanging vines - BIGGER
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
      
      if (deco === 'amphora' || deco.type === 'amphora') {
        const ampX = deco.x ?? -width / 3;
        const ampY = height / 2 - 25;
        
        // Amphora - BIGGER
        const amphora = this.scene.add.graphics();
        amphora.fillStyle(0xb86b4a);
        amphora.fillEllipse(ampX, ampY, 22, 35);
        amphora.fillStyle(0xa05a3a);
        amphora.fillEllipse(ampX, ampY - 22, 12, 8);
        // Handles
        amphora.lineStyle(4, 0xa05a3a);
        amphora.strokeCircle(ampX - 14, ampY - 10, 8);
        amphora.strokeCircle(ampX + 14, ampY - 10, 8);
        this.container.add(amphora);
      }
      
      if (deco === 'torch' || deco.type === 'torch') {
        const torchX = deco.x ?? width / 2 - 15;
        const torchY = deco.y ?? -15;
        
        // Torch - BIGGER
        const torch = this.scene.add.graphics();
        torch.fillStyle(0x555555);
        torch.fillRect(torchX, torchY, 8, 40);
        torch.fillStyle(0x8b6914);
        torch.fillRect(torchX - 4, torchY - 10, 16, 16);
        // Flame
        torch.fillStyle(0xff6622);
        torch.fillTriangle(torchX + 4, torchY - 10, torchX - 6, torchY - 35, torchX + 14, torchY - 35);
        torch.fillStyle(0xffaa44);
        torch.fillTriangle(torchX + 4, torchY - 14, torchX, torchY - 30, torchX + 8, torchY - 30);
        this.container.add(torch);
      }
      
      // SIGN - Just the symbol, HUGE and clear, no rectangle
      if (deco.type === 'sign') {
        const signX = deco.x ?? 0;
        const signY = -height / 2 - 55;
        const symbol = deco.symbol;
        
        const gfx = this.scene.add.graphics();
        
        // Hanging bracket
        gfx.fillStyle(0x4a3a2a);
        gfx.fillRect(signX - 4, signY + 45, 8, 40);
        
        if (symbol === 'bed') {
          // HUGE BED - 80x55
          gfx.fillStyle(0x8b7355);
          // Frame
          gfx.fillRect(signX - 40, signY + 35, 10, 8);   // left leg
          gfx.fillRect(signX + 30, signY + 35, 10, 8);   // right leg
          gfx.fillRect(signX - 40, signY - 15, 10, 58);  // headboard
          gfx.fillRect(signX + 30, signY + 10, 10, 33);  // footboard
          gfx.fillRect(signX - 40, signY + 27, 80, 8);   // base
          // Mattress
          gfx.fillStyle(0xd4c8b8);
          gfx.fillRoundedRect(signX - 28, signY, 56, 26, 5);
          // Pillow
          gfx.fillStyle(0xeee8dd);
          gfx.fillRoundedRect(signX - 25, signY - 10, 22, 16, 6);
          // Blanket fold
          gfx.fillStyle(0xc9b8a0);
          gfx.fillRect(signX - 28, signY + 14, 56, 12);
        } else if (symbol === 'potion') {
          // HUGE POTION - 60x75
          // Bottle body
          gfx.fillStyle(0x4a9a4a);
          gfx.fillEllipse(signX, signY + 15, 55, 60);
          // Highlight
          gfx.fillStyle(0x5ab85a);
          gfx.fillEllipse(signX - 12, signY + 5, 16, 30);
          // Neck
          gfx.fillStyle(0xd4c8b8);
          gfx.fillRect(signX - 10, signY - 32, 20, 22);
          // Cork
          gfx.fillStyle(0x8b6b4b);
          gfx.fillRoundedRect(signX - 13, signY - 45, 26, 16, 5);
          // Liquid shine
          gfx.fillStyle(0x6ac86a);
          gfx.fillEllipse(signX + 10, signY + 20, 10, 14);
        } else if (symbol === 'hammer') {
          // HUGE HAMMER - 75x70
          // Handle
          gfx.fillStyle(0xa08060);
          gfx.fillRoundedRect(signX - 6, signY - 5, 12, 65, 3);
          // Handle wrap
          gfx.fillStyle(0x806040);
          gfx.fillRect(signX - 6, signY + 35, 12, 6);
          gfx.fillRect(signX - 6, signY + 48, 12, 6);
          // Head
          gfx.fillStyle(0x707070);
          gfx.fillRoundedRect(signX - 35, signY - 30, 70, 28, 4);
          // Head shine
          gfx.fillStyle(0x909090);
          gfx.fillRect(signX - 30, signY - 24, 60, 10);
          // Head top edge
          gfx.fillStyle(0x606060);
          gfx.fillRect(signX - 35, signY - 30, 70, 5);
        }
        
        this.container.add(gfx);
      }
      
      // TREE - Decorative tree/cypress for villas - BIGGER
      if (deco.type === 'tree') {
        const treeX = deco.x ?? width / 2 + 60;
        const treeY = height / 2 - 30;
        
        const tree = this.scene.add.graphics();
        // Shadow
        tree.fillStyle(0x000000, 0.3);
        tree.fillEllipse(treeX + 4, treeY + 50, 35, 15);
        // Trunk
        tree.fillStyle(0x5c4033);
        tree.fillRect(treeX - 10, treeY, 20, 55);
        tree.fillStyle(0x6b4c38);
        tree.fillRect(treeX - 6, treeY + 4, 12, 48);
        // Cypress-style foliage (tall and narrow - Greek)
        tree.fillStyle(0x2d5a27);
        tree.fillEllipse(treeX, treeY - 45, 32, 80);
        tree.fillStyle(0x3a6b32);
        tree.fillEllipse(treeX, treeY - 45, 24, 70);
        tree.fillStyle(0x4a8a4a);
        tree.fillEllipse(treeX - 4, treeY - 55, 16, 50);
        this.container.add(tree);
      }
      
      // FORGE - Blacksmith forge with fire - positioned OUTSIDE building
      if (deco === 'forge' || deco.type === 'forge') {
        const forgeX = deco.x ?? -width / 2 - 50;
        const forgeY = height / 2 - 20;
        
        const forge = this.scene.add.graphics();
        // Stone base
        forge.fillStyle(0x555555);
        forge.fillRect(forgeX - 30, forgeY - 5, 60, 35);
        forge.fillStyle(0x666666);
        forge.fillRect(forgeX - 26, forgeY - 2, 52, 30);
        // Fire pit
        forge.fillStyle(0x1a1a1a);
        forge.fillEllipse(forgeX, forgeY + 5, 40, 20);
        // Coals
        forge.fillStyle(0xcc3300);
        forge.fillEllipse(forgeX - 8, forgeY + 2, 14, 8);
        forge.fillStyle(0xff6600);
        forge.fillEllipse(forgeX + 6, forgeY + 4, 10, 6);
        // Flames
        forge.fillStyle(0xff4400);
        forge.fillTriangle(forgeX - 10, forgeY, forgeX - 15, forgeY - 35, forgeX - 5, forgeY);
        forge.fillTriangle(forgeX + 5, forgeY, forgeX + 10, forgeY - 45, forgeX + 15, forgeY);
        forge.fillStyle(0xffaa00);
        forge.fillTriangle(forgeX, forgeY - 5, forgeX - 4, forgeY - 30, forgeX + 4, forgeY - 5);
        this.container.add(forge);
      }
      
      // ANVIL - Blacksmith anvil - positioned OUTSIDE building
      if (deco === 'anvil' || deco.type === 'anvil') {
        const anvilX = deco.x ?? width / 2 + 45;
        const anvilY = height / 2 - 10;
        
        const anvil = this.scene.add.graphics();
        // Stump base
        anvil.fillStyle(0x5c4033);
        anvil.fillRect(anvilX - 14, anvilY, 28, 18);
        anvil.fillStyle(0x6b4c38);
        anvil.fillRect(anvilX - 12, anvilY + 2, 24, 14);
        // Anvil body
        anvil.fillStyle(0x3a3a3a);
        anvil.fillRect(anvilX - 12, anvilY - 12, 24, 14);
        // Top surface
        anvil.fillStyle(0x5a5a5a);
        anvil.fillRect(anvilX - 22, anvilY - 18, 44, 8);
        // Horn (pointed end)
        anvil.fillTriangle(anvilX + 22, anvilY - 16, anvilX + 38, anvilY - 12, anvilX + 22, anvilY - 10);
        // Highlight
        anvil.fillStyle(0x6a6a6a);
        anvil.fillRect(anvilX - 20, anvilY - 16, 40, 3);
        this.container.add(anvil);
      }
      
      // COLUMNS - Greek temple columns (front facade)
      if (deco === 'columns' || deco.type === 'columns') {
        const colSpacing = width / 4;
        const colY = 0;
        
        for (let i = -1; i <= 1; i += 2) {
          const colX = i * colSpacing * 0.8;
          
          const column = this.scene.add.graphics();
          // Column base
          column.fillStyle(0xcccccc);
          column.fillRect(colX - 10, height / 2 - 8, 20, 8);
          // Column shaft
          column.fillStyle(0xdddddd);
          column.fillRect(colX - 7, -height / 2 + 30, 14, height - 45);
          column.fillStyle(0xeeeeee);
          column.fillRect(colX - 5, -height / 2 + 32, 10, height - 49);
          // Fluting (vertical lines)
          column.lineStyle(1, 0xcccccc, 0.5);
          column.moveTo(colX - 3, -height / 2 + 35);
          column.lineTo(colX - 3, height / 2 - 15);
          column.moveTo(colX + 3, -height / 2 + 35);
          column.lineTo(colX + 3, height / 2 - 15);
          column.strokePath();
          // Capital (Doric style)
          column.fillStyle(0xdddddd);
          column.fillRect(colX - 10, -height / 2 + 22, 20, 6);
          column.fillRect(colX - 12, -height / 2 + 16, 24, 6);
          this.container.add(column);
        }
      }
      
      // PEDIMENT - Triangular temple top decoration (no text)
      if (deco === 'pediment' || deco.type === 'pediment') {
        const pedY = -height / 2 - 20;
        
        const pediment = this.scene.add.graphics();
        // Entablature (beam)
        pediment.fillStyle(0xccccbb);
        pediment.fillRect(-width / 2 - 5, -height / 2, width + 10, 12);
        // Triangular pediment
        pediment.fillStyle(0xddddcc);
        pediment.beginPath();
        pediment.moveTo(-width / 2 - 10, -height / 2);
        pediment.lineTo(0, pedY - 25);
        pediment.lineTo(width / 2 + 10, -height / 2);
        pediment.closePath();
        pediment.fillPath();
        // Pediment border
        pediment.lineStyle(3, 0xbbbbaa);
        pediment.beginPath();
        pediment.moveTo(-width / 2 - 10, -height / 2);
        pediment.lineTo(0, pedY - 25);
        pediment.lineTo(width / 2 + 10, -height / 2);
        pediment.closePath();
        pediment.strokePath();
        // Acroterion (decorative element at peak)
        pediment.fillStyle(0xccaa44);
        pediment.fillCircle(0, pedY - 30, 8);
        pediment.fillStyle(0xddbb55);
        pediment.fillCircle(0, pedY - 30, 5);
        this.container.add(pediment);
      }
      
      // STATUE - God statue for temples
      if (deco.type === 'statue') {
        const god = deco.god ?? 'apollo';
        const statueX = deco.x ?? width / 2 + 35;
        const statueY = height / 2 - 50;
        
        const statue = this.scene.add.graphics();
        
        // Pedestal base
        statue.fillStyle(0x888888);
        statue.fillRect(statueX - 18, statueY + 30, 36, 12);
        statue.fillStyle(0x999999);
        statue.fillRect(statueX - 15, statueY + 20, 30, 12);
        statue.fillStyle(0xaaaaaa);
        statue.fillRect(statueX - 12, statueY + 14, 24, 8);
        
        // Statue colors based on god
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
        
        // Body/robes
        statue.fillStyle(statueColor);
        statue.fillRect(statueX - 10, statueY - 25, 20, 40);
        
        // Head
        statue.fillStyle(statueColor);
        statue.fillCircle(statueX, statueY - 38, 12);
        
        // God-specific features
        if (god === 'apollo') {
          // Lyre in hand (larger)
          statue.fillStyle(accentColor);
          statue.fillEllipse(statueX - 22, statueY - 10, 10, 18);
          statue.lineStyle(2, 0x8b6914);
          statue.moveTo(statueX - 22, statueY - 22);
          statue.lineTo(statueX - 22, statueY + 2);
          statue.strokePath();
          // Lyre strings
          statue.lineStyle(1, 0xccaa44);
          for (let i = -2; i <= 2; i++) {
            statue.moveTo(statueX - 22 + i * 2, statueY - 18);
            statue.lineTo(statueX - 22 + i * 2, statueY - 2);
          }
          statue.strokePath();
          // Sun ray crown (bigger, more visible)
          statue.fillStyle(accentColor);
          for (let i = 0; i < 7; i++) {
            const angle = -Math.PI / 2 + (i - 3) * 0.35;
            const rayX = statueX + Math.cos(angle) * 22;
            const rayY = statueY - 38 + Math.sin(angle) * 22;
            statue.fillTriangle(statueX, statueY - 45, rayX - 3, rayY, rayX + 3, rayY);
          }
        } else if (god === 'mnemosyne') {
          // Flowing robes detail
          statue.fillStyle(accentColor);
          statue.fillRect(statueX - 12, statueY - 5, 24, 3);
          // Mirror/pool symbol (memory)
          statue.fillStyle(0x6688aa);
          statue.fillEllipse(statueX - 20, statueY - 5, 10, 14);
          statue.fillStyle(0x88aacc);
          statue.fillEllipse(statueX - 20, statueY - 5, 7, 10);
          statue.fillStyle(0xaaccee);
          statue.fillEllipse(statueX - 22, statueY - 8, 3, 4);
          // Crown of stars (memory of the cosmos)
          statue.fillStyle(accentColor);
          for (let i = 0; i < 5; i++) {
            const angle = -Math.PI / 2 + (i - 2) * 0.5;
            const starX = statueX + Math.cos(angle) * 18;
            const starY = statueY - 38 + Math.sin(angle) * 18;
            statue.fillCircle(starX, starY - 8, 3);
          }
        } else if (god === 'hecate') {
          // Triple torch (her symbol)
          statue.fillStyle(0x8b6914);
          statue.fillRect(statueX - 25, statueY - 45, 4, 50);
          statue.fillRect(statueX + 21, statueY - 45, 4, 50);
          statue.fillRect(statueX - 2, statueY - 55, 4, 60);
          // Flames
          statue.fillStyle(0x663366);
          statue.fillTriangle(statueX - 23, statueY - 45, statueX - 28, statueY - 58, statueX - 18, statueY - 58);
          statue.fillTriangle(statueX + 23, statueY - 45, statueX + 18, statueY - 58, statueX + 28, statueY - 58);
          statue.fillTriangle(statueX, statueY - 55, statueX - 6, statueY - 70, statueX + 6, statueY - 70);
          // Inner flames
          statue.fillStyle(0x8844aa);
          statue.fillTriangle(statueX - 23, statueY - 48, statueX - 26, statueY - 55, statueX - 20, statueY - 55);
          statue.fillTriangle(statueX + 23, statueY - 48, statueX + 20, statueY - 55, statueX + 26, statueY - 55);
          statue.fillTriangle(statueX, statueY - 58, statueX - 4, statueY - 66, statueX + 4, statueY - 66);
          // Crossroads symbol at base
          statue.fillStyle(accentColor);
          statue.fillRect(statueX - 15, statueY + 8, 30, 3);
          statue.fillRect(statueX - 1, statueY + 2, 3, 12);
        }
        
        this.container.add(statue);
      }
    });
  }
  
  _createCollider() {
    const { x, y, width, height } = this.config;
    
    // Create invisible collision rectangle
    this.collider = this.scene.add.rectangle(x, y, width + 10, height + 10, 0x000000, 0);
    this.scene.physics.add.existing(this.collider, true); // true = static body
  }
  
  // Public methods
  
  getContainer() {
    return this.container;
  }
  
  getCollider() {
    return this.collider;
  }
  
  setPosition(x, y) {
    this.container.setPosition(x, y);
    if (this.collider) {
      this.collider.setPosition(x, y);
      this.collider.body.reset(x, y);
    }
  }
  
  setDepth(depth) {
    this.container.setDepth(depth);
  }
  
  setScale(scale) {
    this.container.setScale(scale);
  }
  
  destroy() {
    if (this.container) {
      this.container.destroy();
    }
    if (this.collider) {
      this.collider.destroy();
    }
  }
  
  // Get a summary of the config for display
  getConfigSummary() {
    const { width, height, doorPosition, windows, decorations } = this.config;
    return `${width}x${height}, door: ${doorPosition}, windows: ${windows.length}, deco: ${decorations.length}`;
  }
}
