/**
 * Crate - Wooden crate prop component
 * Extends Component for consistent LEGO-style API
 */
import Component from '../_base/Component.js';

export default class Crate extends Component {
  static Defaults = {
    size: 22,
    hasCollider: true
  };
  
  _build() {
    const { size } = this.config;
    const halfSize = size / 2;
    
    // Shadow
    this.container.add(
      this.scene.add.rectangle(2, 2, size, size, 0x000000, 0.3)
    );
    
    // Main crate body
    this.container.add(
      this.scene.add.rectangle(0, 0, size, size, 0x8b6914)
    );
    this.container.add(
      this.scene.add.rectangle(0, 0, size - 4, size - 4, 0x9b7924)
    );
    
    // Wood plank details
    const plankOffset = size * 0.27;
    const plankThickness = 2;
    
    // Horizontal planks
    this.container.add(
      this.scene.add.rectangle(0, -plankOffset, size - 4, plankThickness, 0x7b5914)
    );
    this.container.add(
      this.scene.add.rectangle(0, plankOffset, size - 4, plankThickness, 0x7b5914)
    );
    
    // Vertical planks
    this.container.add(
      this.scene.add.rectangle(-plankOffset, 0, plankThickness, size - 4, 0x7b5914)
    );
    this.container.add(
      this.scene.add.rectangle(plankOffset, 0, plankThickness, size - 4, 0x7b5914)
    );
    
    // Collider
    if (this.config.hasCollider) {
      this._createCollider(size + 4, size + 4);
    }
  }
}
