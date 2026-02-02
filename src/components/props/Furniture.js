/**
 * Furniture - Seating and sleeping props
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const bed = new Furniture(scene, { x: 300, y: 400, variant: 'bed' });
 */
import Component from '../_base/Component.js';

// Furniture variant configurations
export const FurniturePresets = {
  bench: {
    type: 'bench',
    width: 50,
    height: 20,
    colors: {
      wood: 0x6b4c38,
      woodLight: 0x7b5c48,
      leg: 0x5c4033
    }
  },
  
  table: {
    type: 'table',
    width: 45,
    height: 35,
    colors: {
      top: 0x8b6b4a,
      topLight: 0x9b7b5a,
      leg: 0x6b4c38
    }
  },
  
  chair: {
    type: 'chair',
    width: 22,
    height: 35,
    colors: {
      wood: 0x7b5c48,
      woodLight: 0x8b6c58,
      seat: 0x6b4c38
    }
  },
  
  bed: {
    type: 'bed',
    width: 55,
    height: 40,
    colors: {
      frame: 0x6b4c38,
      frameLight: 0x7b5c48,
      mattress: 0xd4c4b0,
      mattressLight: 0xe4d4c0,
      pillow: 0xeee8dd,
      blanket: 0x8b4444
    }
  }
};

export default class Furniture extends Component {
  static Defaults = {
    variant: 'chair',
    hasCollider: true
  };
  
  _build() {
    const { variant } = this.config;
    const preset = FurniturePresets[variant] || FurniturePresets.chair;
    
    this._drawShadow(preset);
    
    if (preset.type === 'bench') {
      this._drawBench(preset);
    } else if (preset.type === 'table') {
      this._drawTable(preset);
    } else if (preset.type === 'chair') {
      this._drawChair(preset);
    } else if (preset.type === 'bed') {
      this._drawBed(preset);
    }
    
    if (this.config.hasCollider) {
      this._createCollider(preset.width, preset.height * 0.5, 0, preset.height * 0.2);
    }
  }
  
  _drawShadow(preset) {
    const { width } = preset;
    this.container.add(
      this.scene.add.ellipse(2, 4, width * 0.8, 8, 0x000000, 0.25)
    );
  }
  
  _drawBench(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Legs
    gfx.fillStyle(colors.leg);
    gfx.fillRect(-width / 2 + 4, 0, 6, height / 2);
    gfx.fillRect(width / 2 - 10, 0, 6, height / 2);
    
    // Seat
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-width / 2, -height / 3, width, 10);
    gfx.fillStyle(colors.woodLight);
    gfx.fillRect(-width / 2 + 2, -height / 3 + 2, width - 4, 6);
    
    // Plank lines
    gfx.lineStyle(1, colors.leg, 0.5);
    gfx.moveTo(-width / 6, -height / 3 + 2);
    gfx.lineTo(-width / 6, -height / 3 + 8);
    gfx.moveTo(width / 6, -height / 3 + 2);
    gfx.lineTo(width / 6, -height / 3 + 8);
    gfx.strokePath();
    
    this.container.add(gfx);
  }
  
  _drawTable(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Legs
    gfx.fillStyle(colors.leg);
    gfx.fillRect(-width / 2 + 3, -height / 4, 5, height * 0.6);
    gfx.fillRect(width / 2 - 8, -height / 4, 5, height * 0.6);
    
    // Table top
    gfx.fillStyle(colors.top);
    gfx.fillRect(-width / 2, -height / 2, width, 12);
    gfx.fillStyle(colors.topLight);
    gfx.fillRect(-width / 2 + 2, -height / 2 + 2, width - 4, 8);
    
    // Edge detail
    gfx.fillStyle(colors.leg);
    gfx.fillRect(-width / 2, -height / 2 + 10, width, 3);
    
    this.container.add(gfx);
  }
  
  _drawChair(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Back legs
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-width / 2 + 2, -height / 2, 4, height);
    gfx.fillRect(width / 2 - 6, -height / 2, 4, height);
    
    // Front legs
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-width / 2 + 2, 0, 4, height / 2);
    gfx.fillRect(width / 2 - 6, 0, 4, height / 2);
    
    // Seat
    gfx.fillStyle(colors.seat);
    gfx.fillRect(-width / 2, -2, width, 8);
    gfx.fillStyle(colors.woodLight);
    gfx.fillRect(-width / 2 + 2, 0, width - 4, 4);
    
    // Backrest
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-width / 2 + 1, -height / 2, width - 2, 6);
    gfx.fillStyle(colors.woodLight);
    gfx.fillRect(-width / 2 + 3, -height / 2 + 1, width - 6, 4);
    
    // Backrest slats
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-width / 4, -height / 2 + 6, 3, height / 3);
    gfx.fillRect(width / 4 - 3, -height / 2 + 6, 3, height / 3);
    
    this.container.add(gfx);
  }
  
  _drawBed(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Legs
    gfx.fillStyle(colors.frame);
    gfx.fillRect(-width / 2 + 2, height / 3, 5, 8);
    gfx.fillRect(width / 2 - 7, height / 3, 5, 8);
    
    // Frame
    gfx.fillStyle(colors.frame);
    gfx.fillRect(-width / 2, 0, width, height / 2);
    gfx.fillStyle(colors.frameLight);
    gfx.fillRect(-width / 2 + 2, 2, width - 4, height / 2 - 6);
    
    // Headboard
    gfx.fillStyle(colors.frame);
    gfx.fillRect(-width / 2, -height / 2, width, height / 3);
    gfx.fillStyle(colors.frameLight);
    gfx.fillRect(-width / 2 + 3, -height / 2 + 3, width - 6, height / 3 - 6);
    
    // Mattress
    gfx.fillStyle(colors.mattress);
    gfx.fillRect(-width / 2 + 4, -height / 6, width - 8, height / 2);
    gfx.fillStyle(colors.mattressLight);
    gfx.fillRect(-width / 2 + 6, -height / 6 + 2, width - 12, height / 2 - 6);
    
    // Pillow
    gfx.fillStyle(colors.pillow);
    gfx.fillRoundedRect(-width / 2 + 6, -height / 6 - 6, width / 3, 12, 3);
    
    // Blanket
    gfx.fillStyle(colors.blanket);
    gfx.fillRect(-width / 2 + 6, height / 6, width - 12, height / 4);
    gfx.fillStyle(colors.blanket + 0x111111);
    gfx.fillRect(-width / 2 + 8, height / 6 + 2, width - 16, height / 4 - 6);
    
    this.container.add(gfx);
  }
}

// Factory functions
export function createBench(scene, x, y, options = {}) {
  return new Furniture(scene, { x, y, variant: 'bench', ...options });
}

export function createTable(scene, x, y, options = {}) {
  return new Furniture(scene, { x, y, variant: 'table', ...options });
}

export function createChair(scene, x, y, options = {}) {
  return new Furniture(scene, { x, y, variant: 'chair', ...options });
}

export function createBed(scene, x, y, options = {}) {
  return new Furniture(scene, { x, y, variant: 'bed', ...options });
}
