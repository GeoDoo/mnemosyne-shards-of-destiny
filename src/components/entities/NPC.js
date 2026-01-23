/**
 * NPC - Non-player character entity component
 * Extends Component for consistent LEGO-style API
 * 
 * Usage:
 *   const elder = new NPC(scene, {
 *     x: 500, y: 400,
 *     name: 'Epimenides',
 *     variant: 'elder',
 *     dialogue: [{ speaker: 'Epimenides', text: 'Welcome, traveler.' }]
 *   });
 */
import Component from '../_base/Component.js';

// NPC variant configurations
export const NPCPresets = {
  elder: {
    scale: 1.3,
    colors: {
      robe: 0xddd8c8,
      robeHighlight: 0xe8e4d8,
      robeFold: 0xccc8b8,
      trim: 0x663366,
      skin: 0xccb8a0,
      beard: 0xcccccc,
      hair: 0xbbbbbb,
      eyes: 0x334455
    }
  },
  
  merchant: {
    scale: 1.3,
    colors: {
      chiton: 0xc4a882,
      chitonHighlight: 0xd4b892,
      belt: 0x6b4c38,
      skin: 0xddb896,
      hair: 0x2a1a0a,
      beard: 0x3a2a1a,
      eyes: 0x443322
    }
  },
  
  guard: {
    scale: 1.4,
    colors: {
      armor: 0x666666,
      armorHighlight: 0x888888,
      tunic: 0x8b2222,
      skin: 0xddb896,
      hair: 0x3a2a1a,
      eyes: 0x334422
    }
  },
  
  villager: {
    scale: 1.2,
    colors: {
      chiton: 0xaa9977,
      chitonHighlight: 0xbbaa88,
      skin: 0xddbb99,
      hair: 0x443322,
      eyes: 0x332211
    }
  },
  
  priestess: {
    scale: 1.3,
    colors: {
      robe: 0xf0f0f5,
      robeHighlight: 0xffffff,
      sash: 0xccaa44,
      skin: 0xe8d8c8,
      hair: 0x1a1a2a,
      eyes: 0x4466aa
    }
  }
};

export default class NPC extends Component {
  static Defaults = {
    name: 'NPC',
    variant: 'villager',
    dialogue: [],
    interactRadius: 80
  };
  
  constructor(scene, config = {}) {
    super(scene, config);
    
    // Store NPC-specific data
    this.name = this.config.name;
    this.dialogue = this.config.dialogue;
    this.interactRadius = this.config.interactRadius;
    this.variant = this.config.variant;
  }
  
  _build() {
    const { variant } = this.config;
    const preset = NPCPresets[variant] || NPCPresets.villager;
    
    // Draw shadow first (under everything)
    this._drawShadow();
    
    // Draw based on variant
    switch (variant) {
      case 'elder':
        this._drawElder(preset);
        break;
      case 'merchant':
        this._drawMerchant(preset);
        break;
      case 'guard':
        this._drawGuard(preset);
        break;
      case 'priestess':
        this._drawPriestess(preset);
        break;
      default:
        this._drawVillager(preset);
    }
    
    // Apply scale
    this.container.setScale(preset.scale);
    
    // Create physics body (dynamic but immovable)
    this._setupPhysics();
  }
  
  _drawShadow() {
    const shadow = this.scene.add.ellipse(0, 18, 18, 7, 0x000000, 0.4);
    this.container.add(shadow);
  }
  
  _drawElder(preset) {
    const c = preset.colors;
    
    // Greek himation (cloak/robe) - draped style
    this.container.add(this.scene.add.rectangle(0, 6, 18, 28, c.robe));
    this.container.add(this.scene.add.rectangle(0, 6, 16, 26, c.robeHighlight));
    
    // Draped fold detail
    this.container.add(this.scene.add.rectangle(-4, 6, 3, 24, c.robeFold));
    this.container.add(this.scene.add.rectangle(5, 10, 2, 16, c.robeFold));
    
    // Purple trim (sign of wisdom/status)
    this.container.add(this.scene.add.rectangle(0, -6, 16, 2, c.trim));
    
    // Bare arms
    this.container.add(this.scene.add.rectangle(-10, 4, 3, 10, c.skin));
    
    // Head
    this.container.add(this.scene.add.circle(0, -12, 8, c.skin));
    
    // White beard (long, Greek philosopher style)
    this.container.add(this.scene.add.ellipse(0, -4, 12, 12, c.beard));
    this.container.add(this.scene.add.ellipse(0, 2, 10, 8, 0xdddddd));
    this.container.add(this.scene.add.ellipse(0, 8, 6, 6, c.beard));
    
    // Balding with white hair on sides
    this.container.add(this.scene.add.ellipse(-6, -14, 4, 5, c.hair));
    this.container.add(this.scene.add.ellipse(6, -14, 4, 5, c.hair));
    
    // Wise eyes
    this.container.add(this.scene.add.circle(-3, -13, 1.5, c.eyes));
    this.container.add(this.scene.add.circle(3, -13, 1.5, c.eyes));
    
    // Laurel wreath hint
    this.container.add(this.scene.add.ellipse(0, -18, 10, 3, 0x556633));
  }
  
  _drawMerchant(preset) {
    const c = preset.colors;
    
    // Greek chiton
    this.container.add(this.scene.add.rectangle(0, 6, 14, 24, c.chiton));
    this.container.add(this.scene.add.rectangle(0, 6, 12, 22, c.chitonHighlight));
    
    // Leather belt
    this.container.add(this.scene.add.rectangle(0, 0, 14, 3, c.belt));
    
    // Arms
    this.container.add(this.scene.add.rectangle(-8, 3, 3, 12, c.skin));
    this.container.add(this.scene.add.rectangle(8, 3, 3, 12, c.skin));
    
    // Head
    this.container.add(this.scene.add.circle(0, -10, 7, c.skin));
    
    // Dark curly Greek hair
    this.container.add(this.scene.add.ellipse(0, -16, 10, 6, c.hair));
    this.container.add(this.scene.add.circle(-4, -12, 3, c.hair));
    this.container.add(this.scene.add.circle(4, -12, 3, c.hair));
    this.container.add(this.scene.add.circle(-2, -17, 2, c.hair));
    this.container.add(this.scene.add.circle(2, -17, 2, c.hair));
    
    // Short beard
    this.container.add(this.scene.add.ellipse(0, -4, 8, 6, c.beard));
    
    // Eyes
    this.container.add(this.scene.add.circle(-2, -10, 1.5, c.eyes));
    this.container.add(this.scene.add.circle(2, -10, 1.5, c.eyes));
  }
  
  _drawGuard(preset) {
    const c = preset.colors;
    
    // Body armor (lorica)
    this.container.add(this.scene.add.rectangle(0, 4, 16, 22, c.armor));
    this.container.add(this.scene.add.rectangle(0, 4, 14, 20, c.armorHighlight));
    
    // Tunic showing below
    this.container.add(this.scene.add.rectangle(0, 16, 14, 10, c.tunic));
    
    // Pauldrons (shoulder armor)
    this.container.add(this.scene.add.ellipse(-10, -2, 8, 6, c.armor));
    this.container.add(this.scene.add.ellipse(10, -2, 8, 6, c.armor));
    
    // Arms
    this.container.add(this.scene.add.rectangle(-11, 6, 4, 14, c.skin));
    this.container.add(this.scene.add.rectangle(11, 6, 4, 14, c.skin));
    
    // Head
    this.container.add(this.scene.add.circle(0, -10, 8, c.skin));
    
    // Helmet (Corinthian style)
    this.container.add(this.scene.add.ellipse(0, -14, 14, 10, c.armor));
    this.container.add(this.scene.add.rectangle(0, -20, 4, 10, c.tunic)); // Crest
    
    // Eyes through helmet
    this.container.add(this.scene.add.circle(-3, -10, 1.5, c.eyes));
    this.container.add(this.scene.add.circle(3, -10, 1.5, c.eyes));
  }
  
  _drawVillager(preset) {
    const c = preset.colors;
    
    // Simple chiton
    this.container.add(this.scene.add.rectangle(0, 6, 12, 22, c.chiton));
    this.container.add(this.scene.add.rectangle(0, 6, 10, 20, c.chitonHighlight));
    
    // Arms
    this.container.add(this.scene.add.rectangle(-7, 4, 3, 10, c.skin));
    this.container.add(this.scene.add.rectangle(7, 4, 3, 10, c.skin));
    
    // Head
    this.container.add(this.scene.add.circle(0, -9, 6, c.skin));
    
    // Hair
    this.container.add(this.scene.add.ellipse(0, -14, 8, 5, c.hair));
    
    // Eyes
    this.container.add(this.scene.add.circle(-2, -9, 1, c.eyes));
    this.container.add(this.scene.add.circle(2, -9, 1, c.eyes));
  }
  
  _drawPriestess(preset) {
    const c = preset.colors;
    
    // Long flowing robe
    this.container.add(this.scene.add.rectangle(0, 8, 16, 30, c.robe));
    this.container.add(this.scene.add.rectangle(0, 8, 14, 28, c.robeHighlight));
    
    // Golden sash
    this.container.add(this.scene.add.rectangle(0, -2, 16, 3, c.sash));
    this.container.add(this.scene.add.rectangle(-6, 6, 2, 18, c.sash)); // Diagonal drape
    
    // Arms (covered)
    this.container.add(this.scene.add.rectangle(-9, 4, 4, 12, c.robe));
    this.container.add(this.scene.add.rectangle(9, 4, 4, 12, c.robe));
    
    // Head
    this.container.add(this.scene.add.circle(0, -12, 7, c.skin));
    
    // Long dark hair
    this.container.add(this.scene.add.ellipse(0, -10, 14, 14, c.hair));
    this.container.add(this.scene.add.ellipse(-5, -2, 4, 10, c.hair)); // Side hair
    this.container.add(this.scene.add.ellipse(5, -2, 4, 10, c.hair));
    
    // Face (on top of hair)
    this.container.add(this.scene.add.circle(0, -12, 6, c.skin));
    
    // Eyes
    this.container.add(this.scene.add.circle(-2, -12, 1.5, c.eyes));
    this.container.add(this.scene.add.circle(2, -12, 1.5, c.eyes));
    
    // Laurel crown
    this.container.add(this.scene.add.ellipse(0, -18, 8, 3, 0x557733));
  }
  
  _setupPhysics() {
    // Add physics to the container
    this.scene.physics.add.existing(this.container);
    this.container.body.setImmovable(true);
    this.container.body.setSize(24, 38);
  }
  
  /**
   * Check if a point is within interaction range
   */
  isInRange(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return (dx * dx + dy * dy) <= (this.interactRadius * this.interactRadius);
  }
  
  /**
   * Get NPC data object (for compatibility)
   */
  getData() {
    return {
      container: this.container,
      x: this.x,
      y: this.y,
      name: this.name,
      dialogue: this.dialogue,
      type: 'npc'
    };
  }
}

// Factory functions
export function createElder(scene, x, y, name, dialogue, options = {}) {
  return new NPC(scene, { x, y, name, variant: 'elder', dialogue, ...options });
}

export function createMerchant(scene, x, y, name, dialogue, options = {}) {
  return new NPC(scene, { x, y, name, variant: 'merchant', dialogue, ...options });
}

export function createGuard(scene, x, y, name, dialogue, options = {}) {
  return new NPC(scene, { x, y, name, variant: 'guard', dialogue, ...options });
}

export function createVillager(scene, x, y, name, dialogue, options = {}) {
  return new NPC(scene, { x, y, name, variant: 'villager', dialogue, ...options });
}

export function createPriestess(scene, x, y, name, dialogue, options = {}) {
  return new NPC(scene, { x, y, name, variant: 'priestess', dialogue, ...options });
}
