/**
 * MarketStall - Market stall prop component with variants
 * Extends Component for consistent LEGO-style API
 */
import Component from '../_base/Component.js';

export const StallPresets = {
  fruit: {
    awningColor: 0xcc8855,
    items: 'fruit',
    dialogue: 'Fresh pomegranates, figs, grapes, and olives. The bounty of Greece.'
  },
  pottery: {
    awningColor: 0x7788aa,
    items: 'pottery',
    dialogue: 'Traditional amphorae and pottery, crafted by local artisans.'
  }
};

export default class MarketStall extends Component {
  static Defaults = {
    variant: 'fruit',
    name: 'Market Stall',
    hasCollider: true,
    isInteractable: true
  };
  
  _build() {
    const { variant, name } = this.config;
    const preset = StallPresets[variant] || StallPresets.fruit;
    
    this._drawShadow();
    this._drawTable();
    this._drawAwning(preset.awningColor);
    this._drawItems(preset.items);
    
    if (this.config.hasCollider) {
      this._createCollider(90, 55);
    }
    
    // Store interactable data
    if (this.config.isInteractable) {
      this.interactable = {
        x: this.config.x,
        y: this.config.y,
        name,
        type: 'examine',
        dialogue: [{ speaker: '', text: preset.dialogue }]
      };
    }
  }
  
  _drawShadow() {
    this.container.add(
      this.scene.add.ellipse(3, 25, 90, 30, 0x000000, 0.25)
    );
  }
  
  _drawTable() {
    // Table legs
    this.container.add(this.scene.add.rectangle(-35, 18, 5, 22, 0x6b4c38));
    this.container.add(this.scene.add.rectangle(35, 18, 5, 22, 0x6b4c38));
    
    // Table top
    this.container.add(this.scene.add.rectangle(0, 5, 80, 10, 0x7b5c48));
    this.container.add(this.scene.add.rectangle(0, 3, 76, 6, 0x8b6c58));
    
    // Awning poles
    this.container.add(this.scene.add.rectangle(-38, -18, 4, 48, 0x6b4c38));
    this.container.add(this.scene.add.rectangle(38, -18, 4, 48, 0x6b4c38));
  }
  
  _drawAwning(color) {
    // Main awning
    this.container.add(this.scene.add.rectangle(0, -40, 95, 16, color));
    this.container.add(this.scene.add.rectangle(0, -38, 90, 12, color + 0x111111));
    
    // Drape shadows at edges
    this.container.add(this.scene.add.rectangle(-40, -34, 12, 4, color - 0x222222));
    this.container.add(this.scene.add.rectangle(40, -34, 12, 4, color - 0x222222));
    
    // Center drape
    this.container.add(this.scene.add.rectangle(0, -32, 30, 6, color - 0x111111));
  }
  
  _drawItems(type) {
    if (type === 'fruit') {
      this._drawFruitItems();
    } else {
      this._drawPotteryItems();
    }
  }
  
  _drawFruitItems() {
    // Pomegranates
    this.container.add(this.scene.add.circle(-28, -3, 5, 0xaa2233));
    this.container.add(this.scene.add.circle(-20, -2, 5, 0xbb3344));
    
    // Figs
    this.container.add(this.scene.add.ellipse(-8, -3, 4, 5, 0x553366));
    this.container.add(this.scene.add.ellipse(-2, -2, 4, 5, 0x664477));
    
    // Grapes cluster
    this.container.add(this.scene.add.circle(10, -3, 3, 0x443366));
    this.container.add(this.scene.add.circle(13, -1, 3, 0x443366));
    this.container.add(this.scene.add.circle(16, -3, 3, 0x443366));
    this.container.add(this.scene.add.circle(12, -5, 3, 0x554477));
    
    // Olives in bowl
    this.container.add(this.scene.add.ellipse(28, -2, 10, 6, 0xaa9988));
    this.container.add(this.scene.add.circle(26, -4, 2, 0x334422));
    this.container.add(this.scene.add.circle(30, -4, 2, 0x334422));
  }
  
  _drawPotteryItems() {
    // Small amphora
    this.container.add(this.scene.add.ellipse(-25, -8, 8, 14, 0xb86b4a));
    this.container.add(this.scene.add.ellipse(-25, -16, 5, 3, 0xa05a3a));
    this.container.add(this.scene.add.rectangle(-25, -20, 2, 6, 0xa05a3a));
    
    // Medium pot
    this.container.add(this.scene.add.ellipse(0, -6, 7, 12, 0xc97a55));
    this.container.add(this.scene.add.ellipse(0, -13, 4, 2, 0xb86b4a));
    
    // Large amphora with band
    this.container.add(this.scene.add.ellipse(22, -10, 10, 16, 0xb86b4a));
    this.container.add(this.scene.add.ellipse(22, -20, 6, 3, 0xa05a3a));
    this.container.add(this.scene.add.rectangle(22, -8, 16, 3, 0x222222));
  }
  
  /**
   * Get interactable data for scene integration
   */
  getInteractable() {
    return this.interactable;
  }
}

// Factory functions
export function createFruitStall(scene, x, y, options = {}) {
  return new MarketStall(scene, { x, y, variant: 'fruit', name: 'Fruit Stand', ...options });
}

export function createPotteryStall(scene, x, y, options = {}) {
  return new MarketStall(scene, { x, y, variant: 'pottery', name: 'Pottery', ...options });
}
