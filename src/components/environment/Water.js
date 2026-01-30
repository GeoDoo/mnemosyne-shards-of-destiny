/**
 * Water - Decorative water feature component with variants
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const fountain = new Water(scene, { x: 300, y: 400, variant: 'fountain' });
 */
import Component from '../_base/Component.js';

// Water variant configurations
export const WaterPresets = {
  fountain: {
    type: 'fountain',
    width: 60,
    height: 80,
    colors: {
      basin: 0x888888,
      basinHighlight: 0xaaaaaa,
      water: 0x4488cc,
      waterHighlight: 0x66aaee,
      spray: 0xaaddff
    }
  },
  
  pond: {
    type: 'pond',
    width: 100,
    height: 60,
    colors: {
      water: 0x3366aa,
      waterMid: 0x4477bb,
      waterLight: 0x5588cc,
      edge: 0x6b8b5a
    }
  },
  
  streamEdge: {
    type: 'stream',
    width: 120,
    height: 40,
    colors: {
      water: 0x4488bb,
      waterLight: 0x66aadd,
      foam: 0xcceeff,
      bank: 0x8b7355
    }
  }
};

export default class Water extends Component {
  static Defaults = {
    variant: 'fountain',
    hasCollider: true
  };
  
  _build() {
    const { variant } = this.config;
    const preset = WaterPresets[variant] || WaterPresets.fountain;
    
    if (preset.type === 'fountain') {
      this._drawFountain(preset);
    } else if (preset.type === 'pond') {
      this._drawPond(preset);
    } else if (preset.type === 'stream') {
      this._drawStreamEdge(preset);
    }
    
    if (this.config.hasCollider) {
      this._createCollider(preset.width * 0.8, preset.height * 0.5, 0, preset.height * 0.2);
    }
  }
  
  _drawFountain(preset) {
    const { colors } = preset;
    
    // Shadow
    this.container.add(this.scene.add.ellipse(3, 35, 55, 20, 0x000000, 0.25));
    
    // Basin (bottom)
    this.container.add(this.scene.add.ellipse(0, 30, 60, 24, colors.basin));
    this.container.add(this.scene.add.ellipse(0, 28, 52, 18, colors.basinHighlight));
    
    // Water in basin
    this.container.add(this.scene.add.ellipse(0, 28, 44, 14, colors.water, 0.8));
    
    // Center pillar
    this.container.add(this.scene.add.rectangle(0, 5, 14, 45, colors.basin));
    this.container.add(this.scene.add.rectangle(-2, 5, 10, 43, colors.basinHighlight));
    
    // Top basin
    this.container.add(this.scene.add.ellipse(0, -18, 30, 12, colors.basin));
    this.container.add(this.scene.add.ellipse(0, -20, 24, 8, colors.water, 0.8));
    
    // Water spray (static representation)
    const spray = this.scene.add.graphics();
    spray.fillStyle(colors.spray, 0.6);
    spray.fillTriangle(0, -20, -8, -45, 8, -45);
    spray.fillCircle(-4, -48, 4);
    spray.fillCircle(4, -46, 3);
    spray.fillCircle(0, -52, 3);
    this.container.add(spray);
  }
  
  _drawPond(preset) {
    const { width, height, colors } = preset;
    
    // Grassy edge
    this.container.add(this.scene.add.ellipse(0, 0, width + 12, height + 8, colors.edge));
    
    // Water layers (darker in center)
    this.container.add(this.scene.add.ellipse(0, 0, width, height, colors.water));
    this.container.add(this.scene.add.ellipse(-5, -3, width * 0.7, height * 0.6, colors.waterMid));
    
    // Light reflection
    this.container.add(this.scene.add.ellipse(-width * 0.2, -height * 0.15, width * 0.25, height * 0.2, colors.waterLight, 0.5));
    
    // Lily pads (optional decoration)
    const lilies = this.scene.add.graphics();
    lilies.fillStyle(0x4a8a4a);
    lilies.fillCircle(15, 8, 8);
    lilies.fillCircle(25, -5, 6);
    lilies.fillStyle(0x5a9a5a);
    lilies.fillCircle(15, 8, 5);
    lilies.fillCircle(25, -5, 4);
    this.container.add(lilies);
  }
  
  _drawStreamEdge(preset) {
    const { width, height, colors } = preset;
    
    // Bank/shore
    this.container.add(this.scene.add.rectangle(0, -height * 0.3, width, height * 0.4, colors.bank));
    
    // Water
    this.container.add(this.scene.add.rectangle(0, height * 0.2, width, height * 0.7, colors.water));
    
    // Water highlights (flow lines)
    const flow = this.scene.add.graphics();
    flow.fillStyle(colors.waterLight, 0.4);
    flow.fillRect(-width * 0.4, height * 0.1, width * 0.25, 4);
    flow.fillRect(-width * 0.1, height * 0.25, width * 0.3, 3);
    flow.fillRect(width * 0.2, height * 0.15, width * 0.2, 4);
    this.container.add(flow);
    
    // Foam at edge
    const foam = this.scene.add.graphics();
    foam.fillStyle(colors.foam, 0.6);
    foam.fillEllipse(-width * 0.3, -height * 0.1, 12, 5);
    foam.fillEllipse(0, -height * 0.08, 15, 6);
    foam.fillEllipse(width * 0.25, -height * 0.12, 10, 4);
    this.container.add(foam);
  }
}

// Factory functions
export function createFountain(scene, x, y, options = {}) {
  return new Water(scene, { x, y, variant: 'fountain', ...options });
}

export function createPond(scene, x, y, options = {}) {
  return new Water(scene, { x, y, variant: 'pond', ...options });
}

export function createStreamEdge(scene, x, y, options = {}) {
  return new Water(scene, { x, y, variant: 'streamEdge', ...options });
}
