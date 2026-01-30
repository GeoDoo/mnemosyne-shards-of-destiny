/**
 * Storage - Container props (barrel, crate, chest, sack)
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const chest = new Storage(scene, { x: 300, y: 400, variant: 'chest' });
 */
import Component from '../_base/Component.js';

// Storage variant configurations
export const StoragePresets = {
  barrel: {
    type: 'barrel',
    width: 20,
    height: 28,
    colors: {
      wood: 0x6b4c38,
      woodLight: 0x7b5c48,
      rim: 0x5c4033,
      rimDark: 0x4a3525,
      band: 0x555555
    }
  },
  
  crate: {
    type: 'crate',
    width: 24,
    height: 24,
    colors: {
      wood: 0x8b6914,
      woodLight: 0x9b7924,
      plank: 0x7b5914
    }
  },
  
  chest: {
    type: 'chest',
    width: 32,
    height: 22,
    colors: {
      wood: 0x6b4c38,
      woodLight: 0x7b5c48,
      metal: 0x888855,
      metalLight: 0xaaaa77,
      lock: 0x666644
    }
  },
  
  sack: {
    type: 'sack',
    width: 20,
    height: 26,
    colors: {
      fabric: 0xc9b898,
      fabricDark: 0xb9a888,
      tie: 0x8b7355
    }
  }
};

export default class Storage extends Component {
  static Defaults = {
    variant: 'crate',
    hasCollider: true
  };
  
  _build() {
    const { variant } = this.config;
    const preset = StoragePresets[variant] || StoragePresets.crate;
    
    // Shadow
    this._drawShadow(preset);
    
    if (preset.type === 'barrel') {
      this._drawBarrel(preset);
    } else if (preset.type === 'crate') {
      this._drawCrate(preset);
    } else if (preset.type === 'chest') {
      this._drawChest(preset);
    } else if (preset.type === 'sack') {
      this._drawSack(preset);
    }
    
    if (this.config.hasCollider) {
      this._createCollider(preset.width, preset.height * 0.7, 0, 0);
    }
  }
  
  _drawShadow(preset) {
    const { width } = preset;
    this.container.add(
      this.scene.add.ellipse(2, 3, width + 2, 10, 0x000000, 0.3)
    );
  }
  
  _drawBarrel(preset) {
    const { width, height, colors } = preset;
    
    // Main body
    this.container.add(this.scene.add.ellipse(0, 0, width, height, colors.wood));
    this.container.add(this.scene.add.ellipse(0, 0, width - 2, height - 2, colors.woodLight));
    
    // Top rim
    this.container.add(this.scene.add.ellipse(0, -height * 0.36, width - 2, 8, colors.rim));
    this.container.add(this.scene.add.ellipse(0, -height * 0.36, width - 6, 5, colors.rimDark));
    
    // Metal bands
    const gfx = this.scene.add.graphics();
    gfx.lineStyle(2, colors.band);
    gfx.strokeEllipse(0, -height * 0.14, width, 8);
    gfx.strokeEllipse(0, height * 0.21, width, 8);
    this.container.add(gfx);
  }
  
  _drawCrate(preset) {
    const { width, height, colors } = preset;
    
    // Main body
    this.container.add(this.scene.add.rectangle(0, 0, width, height, colors.wood));
    this.container.add(this.scene.add.rectangle(0, 0, width - 4, height - 4, colors.woodLight));
    
    // Plank details
    const gfx = this.scene.add.graphics();
    gfx.fillStyle(colors.plank);
    
    const offset = width * 0.27;
    // Horizontal planks
    gfx.fillRect(-width / 2 + 2, -offset - 1, width - 4, 2);
    gfx.fillRect(-width / 2 + 2, offset - 1, width - 4, 2);
    // Vertical planks
    gfx.fillRect(-offset - 1, -height / 2 + 2, 2, height - 4);
    gfx.fillRect(offset - 1, -height / 2 + 2, 2, height - 4);
    
    this.container.add(gfx);
  }
  
  _drawChest(preset) {
    const { width, height, colors } = preset;
    
    // Main body
    this.container.add(this.scene.add.rectangle(0, 2, width, height - 4, colors.wood));
    this.container.add(this.scene.add.rectangle(0, 2, width - 4, height - 8, colors.woodLight));
    
    // Lid (curved top)
    const gfx = this.scene.add.graphics();
    gfx.fillStyle(colors.wood);
    gfx.fillRoundedRect(-width / 2, -height / 2, width, height / 2, { tl: 6, tr: 6, bl: 0, br: 0 });
    gfx.fillStyle(colors.woodLight);
    gfx.fillRoundedRect(-width / 2 + 2, -height / 2 + 2, width - 4, height / 2 - 4, { tl: 4, tr: 4, bl: 0, br: 0 });
    
    // Metal trim
    gfx.fillStyle(colors.metal);
    gfx.fillRect(-width / 2, -2, width, 4);
    gfx.fillRect(-width / 2, -height / 2 + height / 4, width, 3);
    
    // Corner brackets
    gfx.fillStyle(colors.metalLight);
    gfx.fillRect(-width / 2, -height / 2, 6, 10);
    gfx.fillRect(width / 2 - 6, -height / 2, 6, 10);
    gfx.fillRect(-width / 2, height / 2 - 8, 6, 8);
    gfx.fillRect(width / 2 - 6, height / 2 - 8, 6, 8);
    
    // Lock
    gfx.fillStyle(colors.lock);
    gfx.fillRect(-4, -4, 8, 8);
    gfx.fillStyle(colors.metalLight);
    gfx.fillCircle(0, -1, 2);
    
    this.container.add(gfx);
  }
  
  _drawSack(preset) {
    const { width, height, colors } = preset;
    
    // Main body (bulging shape)
    const gfx = this.scene.add.graphics();
    
    gfx.fillStyle(colors.fabricDark);
    gfx.fillEllipse(0, 4, width + 2, height - 6);
    
    gfx.fillStyle(colors.fabric);
    gfx.fillEllipse(0, 2, width, height - 8);
    
    // Tied top
    gfx.fillStyle(colors.fabricDark);
    gfx.fillEllipse(0, -height / 2 + 6, width * 0.5, 10);
    
    gfx.fillStyle(colors.fabric);
    gfx.beginPath();
    gfx.moveTo(-4, -height / 2 + 2);
    gfx.lineTo(0, -height / 2 - 2);
    gfx.lineTo(4, -height / 2 + 2);
    gfx.closePath();
    gfx.fillPath();
    
    // Tie/rope
    gfx.fillStyle(colors.tie);
    gfx.fillRect(-6, -height / 2 + 4, 12, 3);
    
    // Wrinkle details
    gfx.lineStyle(1, colors.fabricDark, 0.5);
    gfx.moveTo(-width * 0.3, -2);
    gfx.lineTo(-width * 0.2, 8);
    gfx.moveTo(width * 0.25, 0);
    gfx.lineTo(width * 0.3, 10);
    gfx.strokePath();
    
    this.container.add(gfx);
  }
}

// Factory functions
export function createBarrel(scene, x, y, options = {}) {
  return new Storage(scene, { x, y, variant: 'barrel', ...options });
}

export function createCrate(scene, x, y, options = {}) {
  return new Storage(scene, { x, y, variant: 'crate', ...options });
}

export function createChest(scene, x, y, options = {}) {
  return new Storage(scene, { x, y, variant: 'chest', ...options });
}

export function createSack(scene, x, y, options = {}) {
  return new Storage(scene, { x, y, variant: 'sack', ...options });
}
