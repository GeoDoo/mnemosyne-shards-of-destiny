/**
 * Barrel - Wooden barrel prop component
 * Extends Component for consistent LEGO-style API
 */
import Component from '../_base/Component.js';

export default class Barrel extends Component {
  static Defaults = {
    width: 20,
    height: 28,
    hasCollider: true
  };
  
  _build() {
    const { width, height } = this.config;
    
    // Shadow
    this.container.add(
      this.scene.add.ellipse(2, 3, width + 2, 10, 0x000000, 0.3)
    );
    
    // Main barrel body
    this.container.add(
      this.scene.add.ellipse(0, 0, width, height, 0x6b4c38)
    );
    this.container.add(
      this.scene.add.ellipse(0, 0, width - 2, height - 2, 0x7b5c48)
    );
    
    // Top rim
    this.container.add(
      this.scene.add.ellipse(0, -height * 0.36, width - 2, 8, 0x5c4033)
    );
    this.container.add(
      this.scene.add.ellipse(0, -height * 0.36, width - 6, 5, 0x4a3525)
    );
    
    // Metal bands
    const band1 = this.scene.add.ellipse(0, -height * 0.14, width, 8, 0x444444, 0);
    band1.setStrokeStyle(2, 0x555555);
    this.container.add(band1);
    
    const band2 = this.scene.add.ellipse(0, height * 0.21, width, 8, 0x444444, 0);
    band2.setStrokeStyle(2, 0x555555);
    this.container.add(band2);
    
    // Collider
    if (this.config.hasCollider) {
      this._createCollider(width, height, 0, 0);
    }
  }
}
