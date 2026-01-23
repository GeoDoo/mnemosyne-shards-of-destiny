/**
 * Component - Base class for all LEGO-style modular game components
 * 
 * All components (buildings, props, entities, UI) extend this class
 * to ensure consistent API across the entire codebase.
 * 
 * Usage:
 *   class Tree extends Component {
 *     static Defaults = { variant: 'cypress', scale: 1 };
 *     _build() { ... }
 *   }
 */
export default class Component {
  /**
   * @param {Phaser.Scene} scene - The scene this component belongs to
   * @param {Object} config - Configuration object
   * @param {number} config.x - X position
   * @param {number} config.y - Y position
   */
  constructor(scene, config = {}) {
    this.scene = scene;
    
    // Merge defaults with provided config
    const Defaults = this.constructor.Defaults || {};
    this.config = { x: 0, y: 0, ...Defaults, ...config };
    
    // Create container at position
    this.container = scene.add.container(this.config.x, this.config.y);
    
    // Optional physics collider
    this._collider = null;
    
    // Build the component visuals
    this._build();
  }
  
  /**
   * Override in subclass to build visual elements
   * @protected
   */
  _build() {
    // Override in subclass
  }
  
  // ============================================
  // POSITION & TRANSFORM (Chainable)
  // ============================================
  
  setPosition(x, y) {
    this.container.setPosition(x, y);
    if (this._collider && this._collider.body) {
      this._collider.setPosition(x, y);
    }
    return this;
  }
  
  setScale(scale) {
    this.container.setScale(scale);
    return this;
  }
  
  setRotation(radians) {
    this.container.setRotation(radians);
    return this;
  }
  
  setDepth(depth) {
    this.container.setDepth(depth);
    return this;
  }
  
  setVisible(visible) {
    this.container.setVisible(visible);
    return this;
  }
  
  setAlpha(alpha) {
    this.container.setAlpha(alpha);
    return this;
  }
  
  // ============================================
  // GETTERS
  // ============================================
  
  get x() { return this.container.x; }
  get y() { return this.container.y; }
  get visible() { return this.container.visible; }
  get depth() { return this.container.depth; }
  
  getBounds() {
    return this.container.getBounds();
  }
  
  getCollider() {
    return this._collider;
  }
  
  // ============================================
  // PHYSICS
  // ============================================
  
  /**
   * Create a physics collider for this component
   * @param {number} width - Collider width
   * @param {number} height - Collider height
   * @param {number} [offsetX=0] - X offset from container center
   * @param {number} [offsetY=0] - Y offset from container center
   * @param {boolean} [isStatic=true] - Whether the body is static (immovable)
   */
  _createCollider(width, height, offsetX = 0, offsetY = 0, isStatic = true) {
    const { x, y } = this.config;
    this._collider = this.scene.add.rectangle(
      x + offsetX, 
      y + offsetY, 
      width, 
      height, 
      0x000000, 
      0
    );
    this.scene.physics.add.existing(this._collider, isStatic);
    return this._collider;
  }
  
  /**
   * Enable/disable physics body (for culling off-screen objects)
   */
  setPhysicsEnabled(enabled) {
    if (this._collider && this._collider.body) {
      this._collider.body.enable = enabled;
    }
    return this;
  }
  
  // ============================================
  // LIFECYCLE
  // ============================================
  
  /**
   * Called each frame if component needs updates
   * @param {number} time - Total elapsed time
   * @param {number} delta - Time since last frame
   */
  update(time, delta) {
    // Override in subclass if needed
  }
  
  /**
   * Clean up and remove this component
   */
  destroy() {
    if (this._collider) {
      this._collider.destroy();
      this._collider = null;
    }
    this.container.destroy();
    this.container = null;
    this.scene = null;
  }
  
  // ============================================
  // UTILITY
  // ============================================
  
  /**
   * Add a child game object to this component's container
   */
  add(gameObject) {
    this.container.add(gameObject);
    return this;
  }
  
  /**
   * Get info string for debugging
   */
  toString() {
    return `${this.constructor.name}(${this.x}, ${this.y})`;
  }
}
