/**
 * Decoration - Ornamental props (statues, columns, urns, banners)
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const statue = new Decoration(scene, { x: 300, y: 400, variant: 'statue' });
 */
import Component from '../_base/Component.js';

// Decoration variant configurations
export const DecorationPresets = {
  statue: {
    type: 'statue',
    width: 30,
    height: 60,
    colors: {
      stone: 0xcccccc,
      stoneLight: 0xdddddd,
      stoneDark: 0xaaaaaa,
      pedestal: 0x888888
    }
  },
  
  column: {
    type: 'column',
    width: 20,
    height: 70,
    colors: {
      shaft: 0xdddddd,
      shaftLight: 0xeeeeee,
      capital: 0xcccccc,
      base: 0xbbbbbb
    }
  },
  
  urn: {
    type: 'urn',
    width: 22,
    height: 30,
    colors: {
      body: 0xb86b4a,
      bodyLight: 0xc87b5a,
      rim: 0xa05a3a,
      pattern: 0x8b4a2a
    }
  },
  
  banner: {
    type: 'banner',
    width: 24,
    height: 50,
    colors: {
      pole: 0x6b4c38,
      fabric: 0x884444,
      fabricLight: 0x995555,
      trim: 0xccaa44
    }
  }
};

export default class Decoration extends Component {
  static Defaults = {
    variant: 'statue',
    hasCollider: true
  };
  
  _build() {
    const { variant } = this.config;
    const preset = DecorationPresets[variant] || DecorationPresets.statue;
    
    this._drawShadow(preset);
    
    if (preset.type === 'statue') {
      this._drawStatue(preset);
    } else if (preset.type === 'column') {
      this._drawColumn(preset);
    } else if (preset.type === 'urn') {
      this._drawUrn(preset);
    } else if (preset.type === 'banner') {
      this._drawBanner(preset);
    }
    
    if (this.config.hasCollider) {
      this._createCollider(preset.width * 0.8, preset.height * 0.3, 0, preset.height * 0.3);
    }
  }
  
  _drawShadow(preset) {
    const { width } = preset;
    this.container.add(
      this.scene.add.ellipse(2, 4, width * 0.9, 10, 0x000000, 0.25)
    );
  }
  
  _drawStatue(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Pedestal
    gfx.fillStyle(colors.pedestal);
    gfx.fillRect(-width / 2 + 2, height / 4, width - 4, 12);
    gfx.fillRect(-width / 2 + 5, height / 4 - 4, width - 10, 6);
    
    // Body
    gfx.fillStyle(colors.stone);
    gfx.fillRect(-8, -height / 4, 16, height / 2);
    
    // Head
    gfx.fillStyle(colors.stoneLight);
    gfx.fillCircle(0, -height / 3, 10);
    
    // Arms suggestion
    gfx.fillStyle(colors.stone);
    gfx.fillRect(-width / 2 + 2, -height / 6, 8, 4);
    gfx.fillRect(width / 2 - 10, -height / 6, 8, 4);
    
    // Robe folds
    gfx.lineStyle(1, colors.stoneDark, 0.5);
    gfx.moveTo(-4, -height / 5);
    gfx.lineTo(-6, height / 4 - 6);
    gfx.moveTo(4, -height / 5);
    gfx.lineTo(6, height / 4 - 6);
    gfx.strokePath();
    
    this.container.add(gfx);
  }
  
  _drawColumn(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Base
    gfx.fillStyle(colors.base);
    gfx.fillRect(-width / 2 - 2, height / 3, width + 4, 8);
    gfx.fillRect(-width / 2, height / 3 - 4, width, 6);
    
    // Shaft
    gfx.fillStyle(colors.shaft);
    gfx.fillRect(-width / 2 + 2, -height / 3, width - 4, height * 0.65);
    gfx.fillStyle(colors.shaftLight);
    gfx.fillRect(-width / 2 + 4, -height / 3 + 2, width - 8, height * 0.65 - 4);
    
    // Fluting
    gfx.lineStyle(1, colors.capital, 0.4);
    gfx.moveTo(-width / 4, -height / 3 + 4);
    gfx.lineTo(-width / 4, height / 3 - 8);
    gfx.moveTo(width / 4, -height / 3 + 4);
    gfx.lineTo(width / 4, height / 3 - 8);
    gfx.strokePath();
    
    // Capital (Doric style)
    gfx.fillStyle(colors.capital);
    gfx.fillRect(-width / 2, -height / 3 - 4, width, 6);
    gfx.fillRect(-width / 2 - 2, -height / 3 - 10, width + 4, 8);
    
    this.container.add(gfx);
  }
  
  _drawUrn(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Main body
    gfx.fillStyle(colors.body);
    gfx.fillEllipse(0, 4, width, height - 8);
    gfx.fillStyle(colors.bodyLight);
    gfx.fillEllipse(-2, 2, width - 4, height - 12);
    
    // Neck
    gfx.fillStyle(colors.rim);
    gfx.fillEllipse(0, -height / 3, width * 0.5, 10);
    
    // Rim
    gfx.fillStyle(colors.body);
    gfx.fillEllipse(0, -height / 3 - 3, width * 0.6, 6);
    
    // Handles
    gfx.lineStyle(3, colors.rim);
    gfx.strokeCircle(-width / 2 - 2, -2, 6);
    gfx.strokeCircle(width / 2 + 2, -2, 6);
    
    // Decorative pattern
    gfx.lineStyle(2, colors.pattern, 0.6);
    gfx.moveTo(-width / 3, 8);
    gfx.lineTo(width / 3, 8);
    gfx.moveTo(-width / 3, 14);
    gfx.lineTo(width / 3, 14);
    gfx.strokePath();
    
    this.container.add(gfx);
  }
  
  _drawBanner(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Pole
    gfx.fillStyle(colors.pole);
    gfx.fillRect(-2, -height / 2, 4, height);
    
    // Pole finial
    gfx.fillStyle(colors.trim);
    gfx.fillCircle(0, -height / 2 - 4, 5);
    
    // Fabric
    gfx.fillStyle(colors.fabric);
    gfx.beginPath();
    gfx.moveTo(2, -height / 2 + 5);
    gfx.lineTo(width / 2 + 8, -height / 3);
    gfx.lineTo(width / 2 + 5, height / 4);
    gfx.lineTo(2, height / 3);
    gfx.closePath();
    gfx.fillPath();
    
    // Fabric highlight
    gfx.fillStyle(colors.fabricLight);
    gfx.beginPath();
    gfx.moveTo(4, -height / 2 + 8);
    gfx.lineTo(width / 2 + 2, -height / 3 + 5);
    gfx.lineTo(width / 2, height / 5);
    gfx.lineTo(4, height / 4);
    gfx.closePath();
    gfx.fillPath();
    
    // Trim
    gfx.fillStyle(colors.trim);
    gfx.fillRect(2, -height / 2 + 5, width / 2 + 4, 4);
    gfx.fillRect(width / 2 + 3, height / 4 - 2, 6, 8);
    
    this.container.add(gfx);
  }
}

// Factory functions
export function createStatue(scene, x, y, options = {}) {
  return new Decoration(scene, { x, y, variant: 'statue', ...options });
}

export function createColumn(scene, x, y, options = {}) {
  return new Decoration(scene, { x, y, variant: 'column', ...options });
}

export function createUrn(scene, x, y, options = {}) {
  return new Decoration(scene, { x, y, variant: 'urn', ...options });
}

export function createBanner(scene, x, y, options = {}) {
  return new Decoration(scene, { x, y, variant: 'banner', ...options });
}
