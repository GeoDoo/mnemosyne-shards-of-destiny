/**
 * Rock - Decorative rock/boulder component with variants
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const rock = new Rock(scene, { x: 300, y: 400, variant: 'medium' });
 */
import Component from '../_base/Component.js';

// Rock variant configurations
export const RockPresets = {
  small: {
    width: 24,
    height: 18,
    isCluster: false,
    colors: {
      dark: 0x555555,
      mid: 0x777777,
      light: 0x999999
    }
  },
  
  medium: {
    width: 45,
    height: 32,
    isCluster: false,
    colors: {
      dark: 0x4a4a4a,
      mid: 0x6a6a6a,
      light: 0x8a8a8a
    }
  },
  
  large: {
    width: 90,
    height: 50,
    isCluster: true,
    colors: {
      dark: 0x404040,
      mid: 0x606060,
      light: 0x808080
    }
  }
};

export default class Rock extends Component {
  static Defaults = {
    variant: 'medium',
    hasCollider: true
  };
  
  _build() {
    const { variant } = this.config;
    const preset = RockPresets[variant] || RockPresets.medium;
    
    this._drawShadow(preset);
    
    if (preset.isCluster) {
      this._drawCluster(preset);
    } else {
      this._drawSingleRock(preset);
    }
    
    if (this.config.hasCollider) {
      this._createCollider(preset.width, preset.height * 0.6, 0, preset.height * 0.2);
    }
  }
  
  _drawShadow(preset) {
    const { width, height } = preset;
    const shadow = this.scene.add.ellipse(3, height / 2, width * 0.9, height * 0.4, 0x000000, 0.25);
    this.container.add(shadow);
  }
  
  _drawSingleRock(preset) {
    const { width, height, colors } = preset;
    
    // Main rock body
    const rock = this.scene.add.graphics();
    
    // Base shape (darker)
    rock.fillStyle(colors.dark);
    rock.fillEllipse(0, 0, width, height);
    
    // Mid tone
    rock.fillStyle(colors.mid);
    rock.fillEllipse(-2, -2, width * 0.85, height * 0.8);
    
    // Highlight
    rock.fillStyle(colors.light);
    rock.fillEllipse(-width * 0.15, -height * 0.15, width * 0.4, height * 0.35);
    
    this.container.add(rock);
  }
  
  _drawCluster(preset) {
    const { colors } = preset;
    
    // Draw multiple rocks as a cluster
    const positions = [
      { x: -25, y: 8, w: 40, h: 28 },
      { x: 20, y: 5, w: 35, h: 25 },
      { x: 0, y: -5, w: 50, h: 35 },
      { x: -15, y: 15, w: 25, h: 18 },
      { x: 30, y: 12, w: 22, h: 16 }
    ];
    
    positions.forEach(pos => {
      const rock = this.scene.add.graphics();
      
      rock.fillStyle(colors.dark);
      rock.fillEllipse(pos.x, pos.y, pos.w, pos.h);
      
      rock.fillStyle(colors.mid);
      rock.fillEllipse(pos.x - 2, pos.y - 2, pos.w * 0.85, pos.h * 0.8);
      
      rock.fillStyle(colors.light);
      rock.fillEllipse(pos.x - pos.w * 0.15, pos.y - pos.h * 0.15, pos.w * 0.35, pos.h * 0.3);
      
      this.container.add(rock);
    });
  }
}

// Factory functions
export function createSmallRock(scene, x, y, options = {}) {
  return new Rock(scene, { x, y, variant: 'small', ...options });
}

export function createMediumRock(scene, x, y, options = {}) {
  return new Rock(scene, { x, y, variant: 'medium', ...options });
}

export function createLargeRock(scene, x, y, options = {}) {
  return new Rock(scene, { x, y, variant: 'large', ...options });
}
