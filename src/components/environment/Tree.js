/**
 * Tree - Decorative tree component with variants
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const tree = new Tree(scene, { x: 500, y: 400, variant: 'cypress' });
 */
import Component from '../_base/Component.js';

// Tree variant configurations
export const TreePresets = {
  // Tall, narrow cypress - classic Greek/Mediterranean
  cypress: {
    trunkWidth: 14,
    trunkHeight: 40,
    foliageStyle: 'tall',
    colors: {
      trunk: 0x5c4033,
      trunkHighlight: 0x6b4c38,
      foliageDark: 0x2d5a27,
      foliageMid: 0x3a6b32,
      foliageLight: 0x4a8a4a
    }
  },
  
  // Wide, spreading olive tree
  olive: {
    trunkWidth: 16,
    trunkHeight: 35,
    foliageStyle: 'wide',
    colors: {
      trunk: 0x5a4535,
      trunkHighlight: 0x6a5545,
      foliageDark: 0x4a6a3a,
      foliageMid: 0x5a7a4a,
      foliageLight: 0x6a8a5a
    }
  },
  
  // Round oak-style tree
  oak: {
    trunkWidth: 18,
    trunkHeight: 38,
    foliageStyle: 'round',
    colors: {
      trunk: 0x4a3020,
      trunkHighlight: 0x5a4030,
      foliageDark: 0x2a5020,
      foliageMid: 0x3a6030,
      foliageLight: 0x4a7040
    }
  },
  
  // Dead/bare tree
  dead: {
    trunkWidth: 12,
    trunkHeight: 45,
    foliageStyle: 'bare',
    colors: {
      trunk: 0x4a4040,
      trunkHighlight: 0x5a5050,
      foliageDark: null,
      foliageMid: null,
      foliageLight: null
    }
  }
};

export default class Tree extends Component {
  static Defaults = {
    variant: 'cypress',
    scale: 1,
    hasCollider: true
  };
  
  _build() {
    const { variant, scale } = this.config;
    const preset = TreePresets[variant] || TreePresets.cypress;
    
    this._drawShadow(preset);
    this._drawTrunk(preset);
    this._drawFoliage(preset);
    
    if (this.config.hasCollider) {
      this._createCollider(30 * scale, 50 * scale, 0, 15 * scale);
    }
    
    if (scale !== 1) {
      this.container.setScale(scale);
    }
  }
  
  _drawShadow(preset) {
    const shadow = this.scene.add.ellipse(4, 30, 40, 16, 0x000000, 0.3);
    this.container.add(shadow);
  }
  
  _drawTrunk(preset) {
    const { trunkWidth, trunkHeight, colors } = preset;
    
    // Main trunk
    const trunk = this.scene.add.rectangle(0, 18, trunkWidth, trunkHeight, colors.trunk);
    this.container.add(trunk);
    
    // Trunk highlight
    const trunkHighlight = this.scene.add.rectangle(0, 18, trunkWidth - 4, trunkHeight - 4, colors.trunkHighlight);
    this.container.add(trunkHighlight);
    
    // Add some bark texture for non-dead trees
    if (preset.foliageStyle !== 'bare') {
      const bark = this.scene.add.graphics();
      bark.lineStyle(1, colors.trunk, 0.5);
      for (let i = 0; i < 3; i++) {
        const y = 5 + i * 12;
        bark.moveTo(-trunkWidth/2 + 3, y);
        bark.lineTo(trunkWidth/2 - 3, y);
      }
      bark.strokePath();
      this.container.add(bark);
    }
  }
  
  _drawFoliage(preset) {
    const { foliageStyle, colors } = preset;
    
    if (foliageStyle === 'bare') {
      // Draw bare branches
      this._drawBranches();
      return;
    }
    
    if (foliageStyle === 'tall') {
      // Cypress - tall and narrow
      this._drawCypressFoliage(colors);
    } else if (foliageStyle === 'wide') {
      // Olive - wide and spreading
      this._drawWideFoliage(colors);
    } else {
      // Oak - round and full
      this._drawRoundFoliage(colors);
    }
  }
  
  _drawCypressFoliage(colors) {
    // Layered circles for cypress (tall, narrow)
    this.container.add(this.scene.add.circle(-12, -15, 22, colors.foliageDark));
    this.container.add(this.scene.add.circle(12, -15, 22, colors.foliageDark));
    this.container.add(this.scene.add.circle(0, -25, 26, colors.foliageMid));
    this.container.add(this.scene.add.circle(-8, -20, 18, colors.foliageLight));
    this.container.add(this.scene.add.circle(8, -22, 20, colors.foliageLight));
    this.container.add(this.scene.add.circle(0, -32, 18, colors.foliageLight));
  }
  
  _drawWideFoliage(colors) {
    // Wide spreading canopy for olive
    this.container.add(this.scene.add.ellipse(-20, -10, 35, 25, colors.foliageDark));
    this.container.add(this.scene.add.ellipse(20, -10, 35, 25, colors.foliageDark));
    this.container.add(this.scene.add.ellipse(0, -15, 40, 30, colors.foliageMid));
    this.container.add(this.scene.add.ellipse(-10, -20, 25, 20, colors.foliageLight));
    this.container.add(this.scene.add.ellipse(10, -18, 25, 20, colors.foliageLight));
  }
  
  _drawRoundFoliage(colors) {
    // Round full canopy for oak
    this.container.add(this.scene.add.circle(-15, -12, 24, colors.foliageDark));
    this.container.add(this.scene.add.circle(15, -12, 24, colors.foliageDark));
    this.container.add(this.scene.add.circle(0, -20, 30, colors.foliageMid));
    this.container.add(this.scene.add.circle(-5, -25, 22, colors.foliageLight));
    this.container.add(this.scene.add.circle(5, -28, 20, colors.foliageLight));
  }
  
  _drawBranches() {
    // Dead tree branches
    const branches = this.scene.add.graphics();
    branches.lineStyle(3, 0x4a4040);
    
    // Left branch
    branches.moveTo(0, -5);
    branches.lineTo(-20, -25);
    branches.lineTo(-30, -35);
    
    // Right branch
    branches.moveTo(0, -10);
    branches.lineTo(15, -30);
    branches.lineTo(25, -40);
    
    // Top
    branches.moveTo(0, 0);
    branches.lineTo(0, -45);
    branches.lineTo(-5, -55);
    
    branches.strokePath();
    this.container.add(branches);
  }
}

// Factory functions for quick creation
export function createCypress(scene, x, y, options = {}) {
  return new Tree(scene, { x, y, variant: 'cypress', ...options });
}

export function createOlive(scene, x, y, options = {}) {
  return new Tree(scene, { x, y, variant: 'olive', ...options });
}

export function createOak(scene, x, y, options = {}) {
  return new Tree(scene, { x, y, variant: 'oak', ...options });
}

export function createDeadTree(scene, x, y, options = {}) {
  return new Tree(scene, { x, y, variant: 'dead', ...options });
}
