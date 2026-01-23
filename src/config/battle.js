/**
 * Battle system configuration constants
 * Centralizes all magic numbers for easy balancing
 */

export const BATTLE = {
  // Combat timing (ms)
  TIMING: {
    ATTACK_LUNGE: 100,
    DAMAGE_FLOAT: 600,
    MESSAGE_DELAY: 800,
    SKILL_DELAY: 1000,
    ENEMY_TURN_DELAY: 500,
    HP_BAR_TWEEN: 150,
    DEATH_FADE: 400,
    SCENE_FADE: 300,
    SCENE_FADE_LONG: 400
  },
  
  // Combat mechanics
  COMBAT: {
    ATTACK_LUNGE_DISTANCE: 120,
    ENEMY_LUNGE_DISTANCE: 100,
    DEFENSE_MULTIPLIER: 0.5,
    DAMAGE_VARIANCE: { min: -2, max: 4 },
    ENEMY_DAMAGE_VARIANCE: { min: -2, max: 3 },
    MIN_DAMAGE: 1,
    FLEE_CHANCE: 0.5
  },
  
  // Skills
  SKILLS: {
    HEAL: {
      MP_COST: 10,
      BASE_HEAL: 15,
      MAGIC_MULTIPLIER: 2
    }
  },
  
  // UI positioning (relative to screen dimensions)
  UI: {
    PLAYER_X_RATIO: 0.25,
    PLAYER_Y_RATIO: 0.45,
    ENEMY_X_RATIO: 0.72,
    ENEMY_Y_RATIO: 0.38,
    HP_BAR_WIDTH: 100,
    ENEMY_HP_BAR_WIDTH: 76,
    DAMAGE_OFFSET_Y: -50,
    ENEMY_DAMAGE_OFFSET_Y: -70
  },
  
  // Recovery after battle
  VICTORY: {
    HP_RESTORE: 30
  }
};

/**
 * Calculate attack damage
 * @param {number} attack - Attacker's attack stat
 * @param {number} defense - Defender's defense stat
 * @param {Function} randomFn - Random function (for testing)
 */
export function calculateDamage(attack, defense, randomFn = Math.random) {
  const { DAMAGE_VARIANCE, MIN_DAMAGE, DEFENSE_MULTIPLIER } = BATTLE.COMBAT;
  const variance = Math.floor(randomFn() * (DAMAGE_VARIANCE.max - DAMAGE_VARIANCE.min + 1)) + DAMAGE_VARIANCE.min;
  const damage = attack + variance - Math.floor(defense * DEFENSE_MULTIPLIER);
  return Math.max(MIN_DAMAGE, damage);
}

/**
 * Calculate heal amount
 * @param {number} magic - Caster's magic stat
 */
export function calculateHeal(magic) {
  const { BASE_HEAL, MAGIC_MULTIPLIER } = BATTLE.SKILLS.HEAL;
  return Math.floor(magic * MAGIC_MULTIPLIER + BASE_HEAL);
}

export default BATTLE;
