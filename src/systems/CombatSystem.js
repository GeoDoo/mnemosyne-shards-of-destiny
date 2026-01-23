/**
 * CombatSystem - Handles combat calculations and mechanics
 * This module can be expanded to handle more complex combat logic
 */

export default class CombatSystem {
  constructor() {
    this.elements = {
      FIRE: 'fire',
      WATER: 'water',
      EARTH: 'earth',
      WIND: 'wind',
      LIGHT: 'light',
      DARK: 'dark',
      NEUTRAL: 'neutral'
    };

    // Element effectiveness chart
    this.elementChart = {
      fire: { strong: ['wind', 'earth'], weak: ['water'] },
      water: { strong: ['fire'], weak: ['earth', 'wind'] },
      earth: { strong: ['water', 'light'], weak: ['fire', 'wind'] },
      wind: { strong: ['earth', 'water'], weak: ['fire'] },
      light: { strong: ['dark'], weak: ['earth'] },
      dark: { strong: ['light'], weak: ['light'] }
    };
  }

  /**
   * Calculate physical damage
   */
  calculatePhysicalDamage(attacker, defender, skill = null) {
    const basePower = skill ? skill.power : 10;
    const attackStat = attacker.attack;
    const defenseStat = defender.isDefending ? defender.defense * 2 : defender.defense;

    let damage = (attackStat * basePower / 10) - (defenseStat / 2);
    damage = Math.max(1, damage);

    // Variance (90% - 110%)
    const variance = 0.9 + Math.random() * 0.2;
    damage = Math.floor(damage * variance);

    // Critical hit (10% chance, 1.5x damage)
    const isCrit = Math.random() < 0.1;
    if (isCrit) {
      damage = Math.floor(damage * 1.5);
    }

    return { damage, isCrit };
  }

  /**
   * Calculate magical damage
   */
  calculateMagicalDamage(attacker, defender, skill) {
    const basePower = skill.power || 20;
    const magicStat = attacker.magic;
    const resistance = defender.magic / 2;

    let damage = (magicStat * basePower / 10) - resistance;
    damage = Math.max(1, damage);

    // Element effectiveness
    if (skill.element && defender.element) {
      const multiplier = this.getElementMultiplier(skill.element, defender.element);
      damage = Math.floor(damage * multiplier);
    }

    // Variance
    const variance = 0.9 + Math.random() * 0.2;
    damage = Math.floor(damage * variance);

    return { damage, isCrit: false };
  }

  /**
   * Get element effectiveness multiplier
   */
  getElementMultiplier(attackElement, defenseElement) {
    const chart = this.elementChart[attackElement];
    if (!chart) return 1;

    if (chart.strong && chart.strong.includes(defenseElement)) {
      return 1.5; // Super effective
    }
    if (chart.weak && chart.weak.includes(defenseElement)) {
      return 0.5; // Not very effective
    }
    return 1; // Normal
  }

  /**
   * Calculate healing amount
   */
  calculateHealing(caster, skill) {
    const basePower = skill.power || 30;
    const magicStat = caster.magic;

    let healing = (magicStat * basePower / 10);
    
    // Variance
    const variance = 0.9 + Math.random() * 0.2;
    healing = Math.floor(healing * variance);

    return healing;
  }

  /**
   * Check if status effect applies
   */
  checkStatusApplication(skill, target) {
    if (!skill.statusEffect) return false;

    const baseChance = skill.statusChance || 0.3;
    const resistance = (target.luck || 5) / 100;
    const finalChance = baseChance - resistance;

    return Math.random() < finalChance;
  }

  /**
   * Calculate turn order based on speed
   */
  calculateTurnOrder(combatants) {
    return [...combatants]
      .filter(c => c.hp > 0)
      .sort((a, b) => {
        // Speed comparison with small random factor
        const aSpeed = a.speed + Math.random() * 5;
        const bSpeed = b.speed + Math.random() * 5;
        return bSpeed - aSpeed;
      });
  }

  /**
   * Calculate experience gained from enemies
   */
  calculateExperience(enemies) {
    return enemies.reduce((total, enemy) => {
      const baseExp = enemy.level * 10;
      return total + baseExp;
    }, 0);
  }

  /**
   * Check if level up occurs
   */
  checkLevelUp(character) {
    const expNeeded = this.getExpForLevel(character.level + 1);
    return character.experience >= expNeeded;
  }

  /**
   * Get experience required for a level
   */
  getExpForLevel(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
  }
}
