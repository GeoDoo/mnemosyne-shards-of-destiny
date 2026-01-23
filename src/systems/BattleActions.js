/**
 * BattleActions - Command pattern for battle actions
 * Each action is a self-contained handler
 */
import { BATTLE, calculateDamage, calculateHeal } from '../config/battle.js';

/**
 * Execute attack action
 */
export function executeAttack(scene) {
  const player = scene.party[0];
  const enemy = scene.enemies[0];
  const { TIMING, COMBAT } = BATTLE;
  
  const dmg = calculateDamage(player.attack, enemy.defense, () => 
    Phaser.Math.FloatBetween(0, 1)
  );
  
  scene.tweens.add({
    targets: player.sprite,
    x: player.sprite.x + COMBAT.ATTACK_LUNGE_DISTANCE,
    duration: TIMING.ATTACK_LUNGE,
    yoyo: true,
    onYoyo: () => scene.damageEnemy(enemy, dmg),
    onComplete: () => scene.afterPlayerTurn()
  });
}

/**
 * Execute skill (heal) action
 */
export function executeSkill(scene) {
  const player = scene.party[0];
  const { TIMING, SKILLS, UI } = BATTLE;
  
  if (player.mp < SKILLS.HEAL.MP_COST) {
    scene.showMessage('No MP!');
    scene.time.delayedCall(TIMING.MESSAGE_DELAY, () => {
      scene.messageBox.setVisible(false);
      scene.battleState = 'PLAYER_TURN';
      scene.commandMenu.setVisible(true);
    });
    return;
  }
  
  player.mp -= SKILLS.HEAL.MP_COST;
  const heal = calculateHeal(player.magic);
  player.hp = Math.min(player.maxHp, player.hp + heal);
  
  scene.updatePlayerUI();
  scene.showDamage(player.sprite.x, player.sprite.y + UI.DAMAGE_OFFSET_Y, '+' + heal, '#44ff44');
  scene.showMessage('Healed!');
  scene.time.delayedCall(TIMING.SKILL_DELAY, () => scene.afterPlayerTurn());
}

/**
 * Execute defend action
 */
export function executeDefend(scene) {
  const player = scene.party[0];
  const { TIMING } = BATTLE;
  
  player.isDefending = true;
  scene.showMessage('Defending');
  scene.time.delayedCall(TIMING.MESSAGE_DELAY, () => scene.afterPlayerTurn());
}

/**
 * Execute flee action
 */
export function executeFlee(scene) {
  const { TIMING, COMBAT } = BATTLE;
  
  const escaped = Math.random() < COMBAT.FLEE_CHANCE;
  
  if (escaped) {
    scene.showMessage('Escaped!');
    scene.time.delayedCall(TIMING.MESSAGE_DELAY, () => {
      scene.cameras.main.fadeOut(TIMING.SCENE_FADE);
      scene.cameras.main.once('camerafadeoutcomplete', () => {
        scene.scene.start('VillageScene');
      });
    });
  } else {
    scene.showMessage('Failed!');
    scene.time.delayedCall(TIMING.MESSAGE_DELAY, () => scene.afterPlayerTurn());
  }
}

/**
 * Action registry - maps action names to handlers
 */
export const ACTIONS = {
  attack: executeAttack,
  skill: executeSkill,
  defend: executeDefend,
  flee: executeFlee
};

/**
 * Execute an action by name
 * @param {string} actionName - Name of the action
 * @param {Phaser.Scene} scene - Battle scene instance
 */
export function executeAction(actionName, scene) {
  const handler = ACTIONS[actionName];
  if (handler) {
    handler(scene);
  } else {
    console.warn(`Unknown action: ${actionName}`);
  }
}

export default ACTIONS;
