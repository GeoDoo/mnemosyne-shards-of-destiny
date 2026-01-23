/**
 * Well - Greek-style stone well with pillars and bucket
 * Extends Component for consistent LEGO-style API
 */
import Component from '../_base/Component.js';

export const WellPresets = {
  // Standard village well
  village: {
    stoneColor: 0x888888,
    stoneHighlight: 0x999999,
    waterColor: 0x1a2a3a,
    pillarColor: 0xaaaaaa,
    beamColor: 0xdddddd,
    dialogue: [
      { speaker: '', text: 'A stone well built in the traditional Greek style.' },
      { speaker: '', text: 'The cool water comes from deep underground springs.' }
    ]
  },
  
  // Sacred well (Mnemosyne)
  sacred: {
    stoneColor: 0x7788aa,
    stoneHighlight: 0x8899bb,
    waterColor: 0x2244aa,
    pillarColor: 0x9999bb,
    beamColor: 0xccccee,
    dialogue: [
      { speaker: '', text: 'A sacred well dedicated to Mnemosyne, keeper of memory.' },
      { speaker: '', text: 'The water shimmers with an otherworldly light.' }
    ]
  },
  
  // Dry/ruined well
  ruined: {
    stoneColor: 0x666655,
    stoneHighlight: 0x777766,
    waterColor: 0x222222,
    pillarColor: 0x888877,
    beamColor: 0xaaaaaa,
    dialogue: [
      { speaker: '', text: 'A ruined well, long since dried up.' },
      { speaker: '', text: 'Only dust and shadows remain.' }
    ]
  }
};

export default class Well extends Component {
  static Defaults = {
    variant: 'village',
    name: 'Well',
    hasCollider: true,
    isInteractable: true,
    colliderRadius: 35
  };
  
  _build() {
    const { variant, name } = this.config;
    const preset = WellPresets[variant] || WellPresets.village;
    
    this._drawShadow();
    this._drawBase(preset);
    this._drawPillars(preset);
    this._drawBeam(preset);
    this._drawBucket();
    
    if (this.config.hasCollider) {
      this._createWellCollider();
    }
    
    // Store interactable data
    if (this.config.isInteractable) {
      this.interactable = {
        x: this.config.x,
        y: this.config.y,
        name,
        type: 'examine',
        dialogue: preset.dialogue
      };
    }
  }
  
  _drawShadow() {
    this.container.add(
      this.scene.add.ellipse(3, 3, 55, 40, 0x000000, 0.3)
    );
  }
  
  _drawBase(preset) {
    const { stoneColor, stoneHighlight, waterColor } = preset;
    
    // Outer stone ring
    this.container.add(this.scene.add.circle(0, 0, 30, stoneColor));
    this.container.add(this.scene.add.circle(0, 0, 27, stoneHighlight));
    
    // Inner wall
    this.container.add(this.scene.add.circle(0, 0, 22, stoneColor - 0x111111));
    
    // Water
    this.container.add(this.scene.add.circle(0, 0, 17, waterColor));
    
    // Water reflection
    this.container.add(this.scene.add.circle(-4, -4, 5, waterColor + 0x101010, 0.4));
    
    // Stone rim detail
    const rim = this.scene.add.graphics();
    rim.lineStyle(2, stoneColor - 0x222222);
    rim.strokeCircle(0, 0, 28);
    this.container.add(rim);
  }
  
  _drawPillars(preset) {
    const { pillarColor } = preset;
    const pillarHighlight = pillarColor + 0x111111;
    
    // Left pillar
    this.container.add(this.scene.add.rectangle(-22, -30, 8, 50, pillarColor));
    this.container.add(this.scene.add.rectangle(-22, -30, 6, 48, pillarHighlight));
    
    // Right pillar
    this.container.add(this.scene.add.rectangle(22, -30, 8, 50, pillarColor));
    this.container.add(this.scene.add.rectangle(22, -30, 6, 48, pillarHighlight));
    
    // Pillar capitals
    const capitalColor = pillarHighlight + 0x111111;
    this.container.add(this.scene.add.rectangle(-22, -56, 12, 5, capitalColor));
    this.container.add(this.scene.add.rectangle(22, -56, 12, 5, capitalColor));
  }
  
  _drawBeam(preset) {
    const { beamColor } = preset;
    const beamHighlight = beamColor + 0x111111;
    
    // Cross beam
    this.container.add(this.scene.add.rectangle(0, -60, 55, 6, beamColor));
    this.container.add(this.scene.add.rectangle(0, -60, 52, 4, beamHighlight));
    
    // Pulley wheel (bronze/terracotta)
    this.container.add(this.scene.add.circle(0, -60, 8, 0x8b6b4a));
    this.container.add(this.scene.add.circle(0, -60, 5, 0x9b7b5a));
    
    // Rope
    this.container.add(this.scene.add.rectangle(0, -40, 2, 35, 0x8b7355));
  }
  
  _drawBucket() {
    const bucket = this.scene.add.graphics();
    
    // Terracotta amphora-style bucket
    bucket.fillStyle(0xb86b4a);
    bucket.fillEllipse(0, -18, 10, 14);
    
    // Handle
    bucket.fillStyle(0xa05a3a);
    bucket.fillRect(-1, -26, 2, 6);
    
    this.container.add(bucket);
  }
  
  _createWellCollider() {
    const { colliderRadius } = this.config;
    // Circular collider for the well
    const collider = this.scene.add.circle(this.config.x, this.config.y, colliderRadius, 0x000000, 0);
    this.scene.physics.add.existing(collider, true);
    this._collider = collider;
  }
  
  /**
   * Get interactable data for scene integration
   */
  getInteractable() {
    return this.interactable;
  }
}

// Factory functions
export function createVillageWell(scene, x, y, options = {}) {
  return new Well(scene, { x, y, variant: 'village', name: 'Well', ...options });
}

export function createSacredWell(scene, x, y, options = {}) {
  return new Well(scene, { x, y, variant: 'sacred', name: 'Well of Mnemosyne', ...options });
}

export function createRuinedWell(scene, x, y, options = {}) {
  return new Well(scene, { x, y, variant: 'ruined', name: 'Ruined Well', ...options });
}
