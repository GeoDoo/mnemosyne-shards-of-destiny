/**
 * Path - Road/path tile component with variants
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const path = new Path(scene, { x: 300, y: 400, variant: 'stone', width: 100 });
 */
import Component from '../_base/Component.js';

// Path variant configurations
export const PathPresets = {
  dirt: {
    type: 'dirt',
    colors: {
      base: 0x8b7355,
      mid: 0x9b8365,
      light: 0xab9375,
      detail: 0x7a6245
    }
  },
  
  stone: {
    type: 'stone',
    colors: {
      base: 0x777777,
      mid: 0x888888,
      light: 0x999999,
      grout: 0x555555
    }
  },
  
  marble: {
    type: 'marble',
    colors: {
      base: 0xdddddd,
      mid: 0xeeeeee,
      light: 0xffffff,
      grout: 0xaaaaaa,
      accent: 0xccaa88
    }
  }
};

export default class Path extends Component {
  static Defaults = {
    variant: 'stone',
    width: 80,
    height: 80,
    hasCollider: false
  };
  
  _build() {
    const { variant, width, height } = this.config;
    const preset = PathPresets[variant] || PathPresets.stone;
    
    if (preset.type === 'dirt') {
      this._drawDirtPath(preset, width, height);
    } else if (preset.type === 'stone') {
      this._drawStonePath(preset, width, height);
    } else if (preset.type === 'marble') {
      this._drawMarblePath(preset, width, height);
    }
  }
  
  _drawDirtPath(preset, width, height) {
    const { colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Base dirt
    gfx.fillStyle(colors.base);
    gfx.fillRect(-width / 2, -height / 2, width, height);
    
    // Texture variation
    gfx.fillStyle(colors.mid);
    for (let i = 0; i < 8; i++) {
      const x = -width / 2 + Math.random() * width;
      const y = -height / 2 + Math.random() * height;
      gfx.fillEllipse(x, y, 8 + Math.random() * 12, 4 + Math.random() * 6);
    }
    
    // Light patches
    gfx.fillStyle(colors.light, 0.5);
    for (let i = 0; i < 4; i++) {
      const x = -width / 2 + Math.random() * width;
      const y = -height / 2 + Math.random() * height;
      gfx.fillEllipse(x, y, 10 + Math.random() * 15, 5 + Math.random() * 8);
    }
    
    // Small stones/pebbles
    gfx.fillStyle(colors.detail);
    for (let i = 0; i < 6; i++) {
      const x = -width / 2 + Math.random() * width;
      const y = -height / 2 + Math.random() * height;
      gfx.fillCircle(x, y, 2 + Math.random() * 3);
    }
    
    this.container.add(gfx);
  }
  
  _drawStonePath(preset, width, height) {
    const { colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Grout base
    gfx.fillStyle(colors.grout);
    gfx.fillRect(-width / 2, -height / 2, width, height);
    
    // Cobblestones in a rough grid
    const stoneSize = 18;
    const gap = 3;
    const cols = Math.floor(width / (stoneSize + gap));
    const rows = Math.floor(height / (stoneSize + gap));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offsetX = (row % 2) * (stoneSize / 2); // Offset every other row
        const x = -width / 2 + col * (stoneSize + gap) + stoneSize / 2 + offsetX;
        const y = -height / 2 + row * (stoneSize + gap) + stoneSize / 2;
        
        // Skip if outside bounds
        if (x > width / 2 - 5) continue;
        
        // Random size variation
        const sizeVar = 0.8 + Math.random() * 0.4;
        const w = stoneSize * sizeVar;
        const h = stoneSize * sizeVar * (0.85 + Math.random() * 0.3);
        
        // Stone base
        gfx.fillStyle(colors.base);
        gfx.fillRoundedRect(x - w / 2, y - h / 2, w, h, 3);
        
        // Highlight
        gfx.fillStyle(colors.light, 0.5);
        gfx.fillRoundedRect(x - w / 2 + 2, y - h / 2 + 2, w * 0.5, h * 0.4, 2);
      }
    }
    
    this.container.add(gfx);
  }
  
  _drawMarblePath(preset, width, height) {
    const { colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Grout base
    gfx.fillStyle(colors.grout);
    gfx.fillRect(-width / 2, -height / 2, width, height);
    
    // Regular marble tiles
    const tileSize = 24;
    const gap = 2;
    const cols = Math.floor(width / (tileSize + gap));
    const rows = Math.floor(height / (tileSize + gap));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = -width / 2 + col * (tileSize + gap) + tileSize / 2 + gap;
        const y = -height / 2 + row * (tileSize + gap) + tileSize / 2 + gap;
        
        // Alternate pattern
        const isAccent = (row + col) % 5 === 0;
        
        // Tile base
        gfx.fillStyle(isAccent ? colors.accent : colors.base);
        gfx.fillRect(x - tileSize / 2, y - tileSize / 2, tileSize, tileSize);
        
        // Highlight
        gfx.fillStyle(colors.light, 0.3);
        gfx.fillRect(x - tileSize / 2 + 2, y - tileSize / 2 + 2, tileSize * 0.4, tileSize * 0.3);
      }
    }
    
    this.container.add(gfx);
  }
}

// Factory functions
export function createDirtPath(scene, x, y, options = {}) {
  return new Path(scene, { x, y, variant: 'dirt', ...options });
}

export function createStonePath(scene, x, y, options = {}) {
  return new Path(scene, { x, y, variant: 'stone', ...options });
}

export function createMarblePath(scene, x, y, options = {}) {
  return new Path(scene, { x, y, variant: 'marble', ...options });
}
