/**
 * TempleEntrance - Greek temple facade with columns and pediment
 * Extends Component for consistent LEGO-style API
 */
import Component from '../_base/Component.js';

export const TempleEntrancePresets = {
  apollo: {
    name: 'APOLLO',
    stoneColor: 0x888888,
    columnColor: 0xdddddd,
    pedimentColor: 0xddddcc,
    textColor: '#8b7355',
    glowColor: 0x3a3a55
  },
  mnemosyne: {
    name: 'MNEMOSYNE',
    stoneColor: 0x7788aa,
    columnColor: 0xccccee,
    pedimentColor: 0xccccdd,
    textColor: '#6677aa',
    glowColor: 0x4455aa
  },
  hecate: {
    name: 'HECATE',
    stoneColor: 0x555566,
    columnColor: 0x888899,
    pedimentColor: 0x666677,
    textColor: '#996699',
    glowColor: 0x663366
  }
};

export default class TempleEntrance extends Component {
  static Defaults = {
    variant: 'apollo',
    hasCollider: true,
    hasTriggerZone: true
  };
  
  constructor(scene, config = {}) {
    super(scene, config);
    this._columnColliders = [];
    this._triggerZone = null;
  }
  
  _build() {
    const { variant } = this.config;
    const preset = TempleEntrancePresets[variant] || TempleEntrancePresets.apollo;
    
    this._drawSteps(preset);
    this._drawColumns(preset);
    this._drawEntablature(preset);
    this._drawPediment(preset);
    this._drawDoorway(preset);
    
    if (this.config.hasCollider) {
      this._createColumnColliders();
    }
    
    if (this.config.hasTriggerZone) {
      this._createTriggerZone();
    }
  }
  
  _drawSteps(preset) {
    const { stoneColor } = preset;
    
    // Three stone steps (Greek temple style)
    this.container.add(this.scene.add.rectangle(0, 60, 220, 15, stoneColor));
    this.container.add(this.scene.add.rectangle(0, 45, 200, 15, stoneColor + 0x111111));
    this.container.add(this.scene.add.rectangle(0, 30, 180, 15, stoneColor + 0x222222));
    
    // Platform
    this.container.add(this.scene.add.rectangle(0, 15, 160, 20, stoneColor + 0x333333));
  }
  
  _drawColumns(preset) {
    const { columnColor } = preset;
    const columnHighlight = columnColor + 0x111111;
    const capitalColor = columnColor - 0x111111;
    
    // Four Doric columns
    for (const col of [-55, -20, 20, 55]) {
      // Column base
      this.container.add(this.scene.add.rectangle(col, 5, 22, 8, capitalColor));
      
      // Column shaft
      this.container.add(this.scene.add.rectangle(col, -35, 16, 70, columnColor));
      this.container.add(this.scene.add.rectangle(col, -35, 14, 68, columnHighlight));
      
      // Fluting lines
      const flutes = this.scene.add.graphics();
      flutes.lineStyle(1, capitalColor);
      flutes.moveTo(col - 4, -68);
      flutes.lineTo(col - 4, 0);
      flutes.moveTo(col + 4, -68);
      flutes.lineTo(col + 4, 0);
      flutes.strokePath();
      this.container.add(flutes);
      
      // Column capital (Doric style)
      this.container.add(this.scene.add.rectangle(col, -72, 24, 6, columnColor));
      this.container.add(this.scene.add.rectangle(col, -78, 28, 6, capitalColor));
    }
  }
  
  _drawEntablature(preset) {
    const { pedimentColor } = preset;
    
    // Beam above columns
    this.container.add(this.scene.add.rectangle(0, -85, 180, 12, pedimentColor - 0x111111));
  }
  
  _drawPediment(preset) {
    const { pedimentColor, textColor, name } = preset;
    
    // Triangular gable
    const pediment = this.scene.add.graphics();
    pediment.fillStyle(pedimentColor);
    pediment.beginPath();
    pediment.moveTo(-95, -91);
    pediment.lineTo(0, -125);
    pediment.lineTo(95, -91);
    pediment.closePath();
    pediment.fillPath();
    this.container.add(pediment);
    
    // Pediment border
    const border = this.scene.add.graphics();
    border.lineStyle(3, pedimentColor - 0x222222);
    border.beginPath();
    border.moveTo(-95, -91);
    border.lineTo(0, -125);
    border.lineTo(95, -91);
    border.closePath();
    border.strokePath();
    this.container.add(border);
    
    // Temple name
    const nameText = this.scene.add.text(0, -105, name, {
      fontSize: '11px',
      fill: textColor,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.container.add(nameText);
  }
  
  _drawDoorway(preset) {
    const { glowColor } = preset;
    
    // Dark entrance
    this.container.add(this.scene.add.rectangle(0, -10, 60, 55, 0x1a1a25));
    this.container.add(this.scene.add.rectangle(0, -10, 50, 45, 0x0a0a15));
    
    // Mysterious glow from within
    this.container.add(this.scene.add.rectangle(0, -10, 30, 30, glowColor, 0.3));
  }
  
  _createColumnColliders() {
    const { x, y } = this.config;
    
    // Left columns collider
    const leftCols = this.scene.add.rectangle(x - 55, y - 20, 30, 90, 0x000000, 0);
    this.scene.physics.add.existing(leftCols, true);
    this._columnColliders.push(leftCols);
    
    // Right columns collider
    const rightCols = this.scene.add.rectangle(x + 55, y - 20, 30, 90, 0x000000, 0);
    this.scene.physics.add.existing(rightCols, true);
    this._columnColliders.push(rightCols);
  }
  
  _createTriggerZone() {
    const { x, y } = this.config;
    this._triggerZone = this.scene.add.rectangle(x, y + 10, 50, 30, 0x000000, 0);
    this.scene.physics.add.existing(this._triggerZone, true);
  }
  
  /**
   * Get column colliders for physics group
   */
  getColumnColliders() {
    return this._columnColliders;
  }
  
  /**
   * Get trigger zone for overlap detection
   */
  getTriggerZone() {
    return this._triggerZone;
  }
  
  destroy() {
    this._columnColliders.forEach(c => c.destroy());
    this._columnColliders = [];
    if (this._triggerZone) {
      this._triggerZone.destroy();
      this._triggerZone = null;
    }
    super.destroy();
  }
}

// Factory functions
export function createApolloEntrance(scene, x, y, options = {}) {
  return new TempleEntrance(scene, { x, y, variant: 'apollo', ...options });
}

export function createMnemosyneEntrance(scene, x, y, options = {}) {
  return new TempleEntrance(scene, { x, y, variant: 'mnemosyne', ...options });
}

export function createHecateEntrance(scene, x, y, options = {}) {
  return new TempleEntrance(scene, { x, y, variant: 'hecate', ...options });
}
