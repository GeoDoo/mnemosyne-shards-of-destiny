/**
 * Barrier - Fence, wall, gate, and bridge components
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const fence = new Barrier(scene, { x: 300, y: 400, variant: 'fence', width: 100 });
 */
import Component from '../_base/Component.js';

// Barrier variant configurations
export const BarrierPresets = {
  fence: {
    type: 'fence',
    defaultWidth: 80,
    height: 35,
    colors: {
      post: 0x6b4c38,
      postLight: 0x7b5c48,
      rail: 0x8b6b4a,
      railLight: 0x9b7b5a
    }
  },
  
  wall: {
    type: 'wall',
    defaultWidth: 80,
    height: 50,
    colors: {
      stone: 0x777777,
      stoneMid: 0x888888,
      stoneLight: 0x999999,
      mortar: 0x555555
    }
  },
  
  gate: {
    type: 'gate',
    defaultWidth: 60,
    height: 70,
    colors: {
      post: 0x555555,
      postLight: 0x666666,
      door: 0x4a3a2a,
      doorLight: 0x5a4a3a,
      metal: 0x444444
    }
  },
  
  bridge: {
    type: 'bridge',
    defaultWidth: 100,
    height: 40,
    colors: {
      plank: 0x8b6b4a,
      plankDark: 0x6b4c38,
      rail: 0x5c4033,
      rope: 0x9b8b6a
    }
  }
};

export default class Barrier extends Component {
  static Defaults = {
    variant: 'fence',
    width: null, // Uses preset default if not specified
    hasCollider: true
  };
  
  _build() {
    const { variant } = this.config;
    const preset = BarrierPresets[variant] || BarrierPresets.fence;
    const width = this.config.width || preset.defaultWidth;
    
    if (preset.type === 'fence') {
      this._drawFence(preset, width);
    } else if (preset.type === 'wall') {
      this._drawWall(preset, width);
    } else if (preset.type === 'gate') {
      this._drawGate(preset, width);
    } else if (preset.type === 'bridge') {
      this._drawBridge(preset, width);
    }
    
    if (this.config.hasCollider) {
      this._createCollider(width, preset.height * 0.6, 0, 0);
    }
  }
  
  _drawFence(preset, width) {
    const { height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Posts
    const postCount = Math.max(2, Math.floor(width / 30) + 1);
    const postSpacing = width / (postCount - 1);
    
    for (let i = 0; i < postCount; i++) {
      const x = -width / 2 + i * postSpacing;
      gfx.fillStyle(colors.post);
      gfx.fillRect(x - 4, -height / 2, 8, height);
      gfx.fillStyle(colors.postLight);
      gfx.fillRect(x - 2, -height / 2 + 2, 4, height - 4);
      // Post cap
      gfx.fillStyle(colors.post);
      gfx.fillTriangle(x - 5, -height / 2, x, -height / 2 - 6, x + 5, -height / 2);
    }
    
    // Rails
    gfx.fillStyle(colors.rail);
    gfx.fillRect(-width / 2, -height / 4, width, 6);
    gfx.fillRect(-width / 2, height / 4 - 3, width, 6);
    gfx.fillStyle(colors.railLight);
    gfx.fillRect(-width / 2, -height / 4 + 1, width, 3);
    gfx.fillRect(-width / 2, height / 4 - 2, width, 3);
    
    this.container.add(gfx);
  }
  
  _drawWall(preset, width) {
    const { height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Mortar base
    gfx.fillStyle(colors.mortar);
    gfx.fillRect(-width / 2, -height / 2, width, height);
    
    // Stone blocks
    const blockWidth = 20;
    const blockHeight = 12;
    const rows = Math.floor(height / blockHeight);
    const cols = Math.floor(width / blockWidth);
    
    for (let row = 0; row < rows; row++) {
      const offset = (row % 2) * (blockWidth / 2);
      for (let col = 0; col < cols + 1; col++) {
        const x = -width / 2 + col * blockWidth + offset;
        const y = -height / 2 + row * blockHeight;
        
        if (x > width / 2 - 5) continue;
        
        const bw = Math.min(blockWidth - 2, width / 2 - x + blockWidth / 2);
        
        gfx.fillStyle(colors.stone);
        gfx.fillRect(x + 1, y + 1, bw - 2, blockHeight - 2);
        gfx.fillStyle(colors.stoneLight, 0.4);
        gfx.fillRect(x + 2, y + 2, bw * 0.4, blockHeight * 0.3);
      }
    }
    
    // Top cap
    gfx.fillStyle(colors.stoneMid);
    gfx.fillRect(-width / 2 - 2, -height / 2 - 4, width + 4, 6);
    
    this.container.add(gfx);
  }
  
  _drawGate(preset, width) {
    const { height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Posts
    const postWidth = 12;
    gfx.fillStyle(colors.post);
    gfx.fillRect(-width / 2, -height / 2, postWidth, height);
    gfx.fillRect(width / 2 - postWidth, -height / 2, postWidth, height);
    gfx.fillStyle(colors.postLight);
    gfx.fillRect(-width / 2 + 2, -height / 2 + 2, postWidth - 4, height - 4);
    gfx.fillRect(width / 2 - postWidth + 2, -height / 2 + 2, postWidth - 4, height - 4);
    
    // Arch top
    gfx.fillStyle(colors.post);
    gfx.fillRect(-width / 2, -height / 2 - 8, width, 10);
    
    // Door
    const doorWidth = width - postWidth * 2 - 4;
    gfx.fillStyle(colors.door);
    gfx.fillRect(-doorWidth / 2, -height / 2 + 5, doorWidth, height - 10);
    gfx.fillStyle(colors.doorLight);
    gfx.fillRect(-doorWidth / 2 + 3, -height / 2 + 8, doorWidth - 6, height - 16);
    
    // Door details (planks)
    gfx.lineStyle(2, colors.door);
    gfx.moveTo(0, -height / 2 + 8);
    gfx.lineTo(0, height / 2 - 8);
    gfx.strokePath();
    
    // Metal bands
    gfx.fillStyle(colors.metal);
    gfx.fillRect(-doorWidth / 2, -height / 4, doorWidth, 4);
    gfx.fillRect(-doorWidth / 2, height / 4 - 2, doorWidth, 4);
    
    // Handle
    gfx.fillStyle(colors.metal);
    gfx.fillCircle(doorWidth / 4, 0, 4);
    
    this.container.add(gfx);
  }
  
  _drawBridge(preset, width) {
    const { height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Shadow/water beneath
    gfx.fillStyle(0x3366aa, 0.4);
    gfx.fillRect(-width / 2 - 5, 5, width + 10, height / 2);
    
    // Support beams underneath
    gfx.fillStyle(colors.plankDark);
    gfx.fillRect(-width / 2 + 5, height / 4, 8, height / 2);
    gfx.fillRect(width / 2 - 13, height / 4, 8, height / 2);
    
    // Main planks
    const plankWidth = 12;
    const plankCount = Math.floor(width / plankWidth);
    
    for (let i = 0; i < plankCount; i++) {
      const x = -width / 2 + i * plankWidth + 2;
      const shade = i % 2 === 0 ? colors.plank : colors.plankDark;
      gfx.fillStyle(shade);
      gfx.fillRect(x, -height / 4, plankWidth - 2, height / 2);
    }
    
    // Side rails
    gfx.fillStyle(colors.rail);
    gfx.fillRect(-width / 2, -height / 2, width, 6);
    gfx.fillRect(-width / 2, -height / 2, 6, height / 3);
    gfx.fillRect(width / 2 - 6, -height / 2, 6, height / 3);
    
    // Rope detail
    gfx.lineStyle(2, colors.rope);
    gfx.moveTo(-width / 2 + 3, -height / 2 + 6);
    gfx.lineTo(-width / 2 + 3, -height / 4);
    gfx.moveTo(width / 2 - 3, -height / 2 + 6);
    gfx.lineTo(width / 2 - 3, -height / 4);
    gfx.strokePath();
    
    this.container.add(gfx);
  }
}

// Factory functions
export function createFence(scene, x, y, options = {}) {
  return new Barrier(scene, { x, y, variant: 'fence', ...options });
}

export function createWall(scene, x, y, options = {}) {
  return new Barrier(scene, { x, y, variant: 'wall', ...options });
}

export function createGate(scene, x, y, options = {}) {
  return new Barrier(scene, { x, y, variant: 'gate', ...options });
}

export function createBridge(scene, x, y, options = {}) {
  return new Barrier(scene, { x, y, variant: 'bridge', ...options });
}
