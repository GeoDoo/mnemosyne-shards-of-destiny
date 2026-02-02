/**
 * Utility - Functional props (campfire, cooking pot, weapon rack, ladder)
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const fire = new Utility(scene, { x: 300, y: 400, variant: 'campfire' });
 */
import Component from '../_base/Component.js';

// Utility variant configurations
export const UtilityPresets = {
  campfire: {
    type: 'campfire',
    width: 35,
    height: 30,
    colors: {
      log: 0x5c4033,
      logLight: 0x6b4c38,
      ember: 0xcc3300,
      flame: 0xff6600,
      flameLight: 0xffaa00,
      ash: 0x444444
    }
  },
  
  cookingPot: {
    type: 'cookingPot',
    width: 30,
    height: 35,
    colors: {
      pot: 0x333333,
      potLight: 0x444444,
      rim: 0x222222,
      tripod: 0x4a4a4a,
      steam: 0xcccccc
    }
  },
  
  weaponRack: {
    type: 'weaponRack',
    width: 40,
    height: 50,
    colors: {
      wood: 0x6b4c38,
      woodLight: 0x7b5c48,
      metal: 0x888888,
      metalLight: 0xaaaaaa,
      blade: 0xcccccc
    }
  },
  
  ladder: {
    type: 'ladder',
    width: 20,
    height: 60,
    colors: {
      wood: 0x7b5c48,
      woodDark: 0x5c4033,
      rung: 0x6b4c38
    }
  }
};

export default class Utility extends Component {
  static Defaults = {
    variant: 'campfire',
    hasCollider: true
  };
  
  _build() {
    const { variant } = this.config;
    const preset = UtilityPresets[variant] || UtilityPresets.campfire;
    
    if (preset.type === 'campfire') {
      this._drawCampfire(preset);
    } else if (preset.type === 'cookingPot') {
      this._drawCookingPot(preset);
    } else if (preset.type === 'weaponRack') {
      this._drawWeaponRack(preset);
    } else if (preset.type === 'ladder') {
      this._drawLadder(preset);
    }
    
    if (this.config.hasCollider) {
      this._createCollider(preset.width * 0.7, preset.height * 0.4, 0, preset.height * 0.25);
    }
  }
  
  _drawCampfire(preset) {
    const { colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Light glow on ground
    this.container.add(
      this.scene.add.ellipse(0, 8, 40, 16, 0xff6600, 0.2)
    );
    
    // Ash base
    gfx.fillStyle(colors.ash);
    gfx.fillEllipse(0, 8, 30, 10);
    
    // Logs
    gfx.fillStyle(colors.log);
    gfx.fillRect(-15, 2, 30, 6);
    gfx.fillStyle(colors.logLight);
    gfx.fillRect(-12, 3, 24, 4);
    
    gfx.fillStyle(colors.log);
    gfx.fillRect(-10, -2, 20, 5);
    
    // Embers
    gfx.fillStyle(colors.ember);
    gfx.fillCircle(-5, 6, 4);
    gfx.fillCircle(6, 5, 3);
    gfx.fillCircle(0, 8, 3);
    
    // Flames
    gfx.fillStyle(colors.flame);
    gfx.fillTriangle(0, 0, -8, -20, 8, -20);
    gfx.fillTriangle(-5, 2, -12, -12, 2, -12);
    gfx.fillTriangle(5, 2, -2, -15, 12, -15);
    
    gfx.fillStyle(colors.flameLight);
    gfx.fillTriangle(0, -2, -4, -14, 4, -14);
    gfx.fillTriangle(-3, 0, -7, -8, 1, -8);
    gfx.fillTriangle(3, 0, -1, -10, 7, -10);
    
    this.container.add(gfx);
  }
  
  _drawCookingPot(preset) {
    const { colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Shadow
    this.container.add(
      this.scene.add.ellipse(2, 12, 28, 10, 0x000000, 0.25)
    );
    
    // Tripod legs
    gfx.fillStyle(colors.tripod);
    gfx.fillRect(-14, -15, 3, 30);
    gfx.fillRect(11, -15, 3, 30);
    gfx.fillRect(-2, -20, 3, 8);
    
    // Crossbar
    gfx.fillRect(-12, -18, 24, 3);
    
    // Pot body
    gfx.fillStyle(colors.pot);
    gfx.fillEllipse(0, 2, 26, 20);
    gfx.fillStyle(colors.potLight);
    gfx.fillEllipse(-2, 0, 20, 14);
    
    // Rim
    gfx.fillStyle(colors.rim);
    gfx.fillEllipse(0, -6, 24, 8);
    gfx.fillStyle(colors.pot);
    gfx.fillEllipse(0, -6, 20, 5);
    
    // Steam
    gfx.fillStyle(colors.steam, 0.4);
    gfx.fillEllipse(-4, -16, 6, 8);
    gfx.fillEllipse(3, -20, 5, 6);
    gfx.fillEllipse(-2, -24, 4, 5);
    
    this.container.add(gfx);
  }
  
  _drawWeaponRack(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Shadow
    this.container.add(
      this.scene.add.ellipse(2, height / 3, width * 0.6, 8, 0x000000, 0.25)
    );
    
    // Vertical posts
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-width / 2, -height / 2, 6, height);
    gfx.fillRect(width / 2 - 6, -height / 2, 6, height);
    gfx.fillStyle(colors.woodLight);
    gfx.fillRect(-width / 2 + 1, -height / 2 + 2, 4, height - 4);
    gfx.fillRect(width / 2 - 5, -height / 2 + 2, 4, height - 4);
    
    // Horizontal bars
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-width / 2, -height / 3, width, 5);
    gfx.fillRect(-width / 2, height / 6, width, 5);
    
    // Sword
    gfx.fillStyle(colors.metal);
    gfx.fillRect(-8, -height / 2 + 8, 4, height * 0.6);
    gfx.fillStyle(colors.blade);
    gfx.fillRect(-7, -height / 2 + 10, 2, height * 0.5);
    // Hilt
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-12, -height / 2 + 4, 12, 6);
    
    // Spear
    gfx.fillStyle(colors.woodLight);
    gfx.fillRect(6, -height / 2 + 5, 3, height * 0.7);
    gfx.fillStyle(colors.metal);
    gfx.fillTriangle(7.5, -height / 2 + 5, 4, -height / 2 - 8, 11, -height / 2 - 8);
    
    this.container.add(gfx);
  }
  
  _drawLadder(preset) {
    const { width, height, colors } = preset;
    const gfx = this.scene.add.graphics();
    
    // Shadow
    this.container.add(
      this.scene.add.ellipse(2, height / 2 - 5, width * 0.8, 8, 0x000000, 0.25)
    );
    
    // Side rails
    gfx.fillStyle(colors.wood);
    gfx.fillRect(-width / 2, -height / 2, 4, height);
    gfx.fillRect(width / 2 - 4, -height / 2, 4, height);
    gfx.fillStyle(colors.woodDark);
    gfx.fillRect(-width / 2 + 1, -height / 2 + 2, 2, height - 4);
    gfx.fillRect(width / 2 - 3, -height / 2 + 2, 2, height - 4);
    
    // Rungs
    const rungCount = 5;
    const rungSpacing = height / (rungCount + 1);
    
    for (let i = 1; i <= rungCount; i++) {
      const y = -height / 2 + i * rungSpacing;
      gfx.fillStyle(colors.rung);
      gfx.fillRect(-width / 2 + 3, y - 2, width - 6, 4);
      gfx.fillStyle(colors.wood);
      gfx.fillRect(-width / 2 + 4, y - 1, width - 8, 2);
    }
    
    this.container.add(gfx);
  }
}

// Factory functions
export function createCampfire(scene, x, y, options = {}) {
  return new Utility(scene, { x, y, variant: 'campfire', ...options });
}

export function createCookingPot(scene, x, y, options = {}) {
  return new Utility(scene, { x, y, variant: 'cookingPot', ...options });
}

export function createWeaponRack(scene, x, y, options = {}) {
  return new Utility(scene, { x, y, variant: 'weaponRack', ...options });
}

export function createLadder(scene, x, y, options = {}) {
  return new Utility(scene, { x, y, variant: 'ladder', ...options });
}
