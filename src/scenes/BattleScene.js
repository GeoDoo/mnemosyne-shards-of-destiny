import Phaser from 'phaser';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
    
    this.battleState = 'INACTIVE'; // INACTIVE, PLAYER_TURN, ENEMY_TURN, EXECUTING, VICTORY, DEFEAT
    this.party = [];
    this.enemies = [];
    this.turnOrder = [];
    this.currentTurnIndex = 0;
    this.selectedAction = null;
    this.selectedTarget = null;
    
    // UI elements
    this.commandMenu = null;
    this.partyStatus = null;
    this.turnIndicator = null;
  }

  init(data) {
    // Receive battle data (enemies, background, etc.)
    this.battleData = data || {
      enemies: [{ id: 'eidolon', name: 'Eidolon', hp: 35, maxHp: 35, attack: 8, defense: 4, speed: 9 }],
      background: 'bg_village'
    };
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    const bgKey = this.battleData.background || 'bg_village';
    if (this.textures.exists(bgKey)) {
      const bg = this.add.image(width / 2, height / 2, bgKey);
      bg.setDisplaySize(width, height);
    } else {
      this.add.rectangle(width / 2, height / 2, width, height, 0x2a2a4a);
    }

    // Initialize party from game state
    this.initializeParty();

    // Initialize enemies
    this.initializeEnemies();

    // Create combatant displays
    this.createCombatantDisplays();

    // Create UI
    this.createBattleUI();

    // Calculate turn order and start battle
    this.calculateTurnOrder();
    this.battleState = 'STARTING';
    
    // Short delay then start first turn
    this.time.delayedCall(500, () => this.startNextTurn());

    // Fade in
    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  initializeParty() {
    const gameState = this.registry.get('gameState');
    this.party = gameState.party.map(member => ({
      ...member,
      isEnemy: false,
      isDefending: false
    }));
  }

  initializeEnemies() {
    this.enemies = this.battleData.enemies.map((enemy, index) => ({
      id: enemy.id,
      name: enemy.name,
      hp: enemy.hp || enemy.maxHp,
      maxHp: enemy.maxHp,
      attack: enemy.attack,
      defense: enemy.defense,
      magic: enemy.magic || 5,
      speed: enemy.speed,
      skills: enemy.skills || ['basic_attack'],
      isEnemy: true,
      index: index
    }));
  }

  createCombatantDisplays() {
    const { width, height } = this.cameras.main;

    // Enemy positions (top area)
    this.enemySprites = [];
    const enemyStartX = width / 2 - ((this.enemies.length - 1) * 80);
    
    this.enemies.forEach((enemy, i) => {
      const x = enemyStartX + i * 160;
      const y = 250;

      const container = this.add.container(x, y);
      
      // Enemy placeholder (red rectangle)
      const sprite = this.add.rectangle(0, 0, 80, 80, 0xaa3333);
      sprite.setStrokeStyle(2, 0xff5555);
      container.add(sprite);

      // Enemy name
      const nameText = this.add.text(0, -60, enemy.name, {
        fontSize: '16px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      });
      nameText.setOrigin(0.5);
      container.add(nameText);

      // HP bar background
      const hpBg = this.add.rectangle(0, 55, 70, 10, 0x333333);
      container.add(hpBg);

      // HP bar
      const hpBar = this.add.rectangle(-30, 55, 60, 8, 0x44aa44);
      hpBar.setOrigin(0, 0.5);
      container.add(hpBar);

      container.enemyData = enemy;
      container.hpBar = hpBar;
      container.sprite = sprite;

      // Make clickable for targeting
      sprite.setInteractive({ useHandCursor: true });
      sprite.on('pointerdown', () => this.selectTarget(enemy));

      this.enemySprites.push(container);
    });

    // Party positions (bottom area)
    this.partySprites = [];
    const partyStartX = width / 2 - ((this.party.length - 1) * 70);
    
    this.party.forEach((member, i) => {
      const x = partyStartX + i * 140;
      const y = height - 300;

      const container = this.add.container(x, y);
      
      // Party member placeholder (blue rectangle)
      const sprite = this.add.rectangle(0, 0, 60, 80, 0x3366aa);
      sprite.setStrokeStyle(2, 0x5588cc);
      container.add(sprite);

      // Name
      const nameText = this.add.text(0, -55, member.name, {
        fontSize: '14px',
        fill: '#ffffff'
      });
      nameText.setOrigin(0.5);
      container.add(nameText);

      container.memberData = member;
      container.sprite = sprite;

      this.partySprites.push(container);
    });
  }

  createBattleUI() {
    const { width, height } = this.cameras.main;

    // Turn indicator
    this.turnIndicator = this.add.text(width / 2, 50, '', {
      fontSize: '24px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.turnIndicator.setOrigin(0.5);

    // Party status panel
    this.createPartyStatusPanel(width, height);

    // Command menu (hidden initially)
    this.createCommandMenu(width, height);

    // Target selection hint
    this.targetHint = this.add.text(width / 2, 180, 'Select a target', {
      fontSize: '20px',
      fill: '#ffdd44',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.targetHint.setOrigin(0.5);
    this.targetHint.setVisible(false);
  }

  createPartyStatusPanel(width, height) {
    const panelY = height - 150;
    
    // Background
    this.add.rectangle(width / 2, panelY + 50, width - 20, 120, 0x1a1a2e, 0.9)
      .setStrokeStyle(2, 0x4a4a6a);

    // Party member stats
    this.partyStatusTexts = [];
    this.party.forEach((member, i) => {
      const x = 30 + i * 170;
      const y = panelY + 20;

      const nameText = this.add.text(x, y, member.name, {
        fontSize: '16px',
        fill: '#d4af37',
        fontStyle: 'bold'
      });

      const hpText = this.add.text(x, y + 25, `HP: ${member.hp}/${member.maxHp}`, {
        fontSize: '14px',
        fill: '#55cc55'
      });

      const mpText = this.add.text(x, y + 45, `MP: ${member.mp}/${member.maxMp}`, {
        fontSize: '14px',
        fill: '#5588ff'
      });

      this.partyStatusTexts.push({ name: nameText, hp: hpText, mp: mpText, member });
    });
  }

  createCommandMenu(width, height) {
    this.commandMenu = this.add.container(width - 130, height - 280);
    this.commandMenu.setVisible(false);

    // Background
    const bg = this.add.rectangle(0, 0, 200, 200, 0x1a1a2e, 0.95);
    bg.setStrokeStyle(2, 0xd4af37);
    this.commandMenu.add(bg);

    // Command buttons
    const commands = ['Attack', 'Skills', 'Defend', 'Items'];
    commands.forEach((cmd, i) => {
      const btn = this.createCommandButton(0, -60 + i * 45, cmd);
      this.commandMenu.add(btn);
    });
  }

  createCommandButton(x, y, text) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 160, 40, 0x2a2a4a);
    bg.setStrokeStyle(1, 0x5a5a7a);
    bg.setInteractive({ useHandCursor: true });

    const label = this.add.text(0, 0, text, {
      fontSize: '18px',
      fill: '#ffffff'
    });
    label.setOrigin(0.5);

    container.add([bg, label]);

    // Hover effect
    bg.on('pointerover', () => {
      bg.setFillStyle(0x3a3a5a);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0x2a2a4a);
    });

    // Click handler
    bg.on('pointerdown', () => {
      this.handleCommand(text);
    });

    return container;
  }

  calculateTurnOrder() {
    const allCombatants = [...this.party, ...this.enemies];
    this.turnOrder = allCombatants
      .filter(c => c.hp > 0)
      .sort((a, b) => b.speed - a.speed);
    this.currentTurnIndex = 0;
  }

  startNextTurn() {
    // Check for battle end
    if (this.checkBattleEnd()) return;

    // Recalculate turn order if needed
    this.turnOrder = this.turnOrder.filter(c => c.hp > 0);
    
    if (this.currentTurnIndex >= this.turnOrder.length) {
      this.currentTurnIndex = 0;
    }

    const current = this.turnOrder[this.currentTurnIndex];
    this.turnIndicator.setText(`${current.name}'s Turn`);

    // Reset defending status
    current.isDefending = false;

    if (current.isEnemy) {
      this.battleState = 'ENEMY_TURN';
      this.commandMenu.setVisible(false);
      // AI action after delay
      this.time.delayedCall(800, () => this.executeEnemyTurn(current));
    } else {
      this.battleState = 'PLAYER_TURN';
      this.commandMenu.setVisible(true);
      this.selectedAction = null;
      this.selectedTarget = null;
      this.currentPartyMember = current;
    }
  }

  handleCommand(command) {
    switch (command) {
      case 'Attack':
        this.selectedAction = 'attack';
        this.commandMenu.setVisible(false);
        this.targetHint.setVisible(true);
        break;
      case 'Skills':
        // TODO: Show skills menu
        console.log('Skills not implemented');
        break;
      case 'Defend':
        this.selectedAction = 'defend';
        this.executePlayerAction();
        break;
      case 'Items':
        // TODO: Show items menu
        console.log('Items not implemented');
        break;
    }
  }

  selectTarget(target) {
    if (this.battleState !== 'PLAYER_TURN' || !this.selectedAction) return;
    if (this.selectedAction === 'defend') return;

    this.selectedTarget = target;
    this.targetHint.setVisible(false);
    this.executePlayerAction();
  }

  executePlayerAction() {
    this.battleState = 'EXECUTING';
    this.commandMenu.setVisible(false);

    const attacker = this.currentPartyMember;

    if (this.selectedAction === 'attack' && this.selectedTarget) {
      const damage = this.calculateDamage(attacker, this.selectedTarget);
      this.applyDamage(this.selectedTarget, damage);
      this.showDamageNumber(this.selectedTarget, damage);
    } else if (this.selectedAction === 'defend') {
      attacker.isDefending = true;
      this.showStatusText(attacker, 'Defending!');
    }

    // Next turn after delay
    this.time.delayedCall(800, () => {
      this.currentTurnIndex++;
      this.startNextTurn();
    });
  }

  executeEnemyTurn(enemy) {
    this.battleState = 'EXECUTING';

    // Simple AI: attack random party member
    const aliveParty = this.party.filter(m => m.hp > 0);
    if (aliveParty.length === 0) return;

    const target = Phaser.Utils.Array.GetRandom(aliveParty);
    const damage = this.calculateDamage(enemy, target);
    this.applyDamage(target, damage);
    this.showDamageNumber(target, damage);

    // Next turn after delay
    this.time.delayedCall(800, () => {
      this.currentTurnIndex++;
      this.startNextTurn();
    });
  }

  calculateDamage(attacker, defender) {
    const baseDamage = attacker.attack;
    const defense = defender.isDefending ? defender.defense * 2 : defender.defense;
    const damage = Math.max(1, baseDamage - defense / 2);
    const variance = 0.9 + Math.random() * 0.2;
    return Math.floor(damage * variance);
  }

  applyDamage(target, damage) {
    target.hp = Math.max(0, target.hp - damage);
    this.updateDisplay(target);

    // Check if defeated
    if (target.hp <= 0) {
      this.handleDefeat(target);
    }
  }

  updateDisplay(combatant) {
    if (combatant.isEnemy) {
      const sprite = this.enemySprites.find(s => s.enemyData === combatant);
      if (sprite) {
        const hpPercent = combatant.hp / combatant.maxHp;
        sprite.hpBar.setScale(hpPercent, 1);
      }
    } else {
      const statusText = this.partyStatusTexts.find(s => s.member === combatant);
      if (statusText) {
        statusText.hp.setText(`HP: ${combatant.hp}/${combatant.maxHp}`);
      }
    }
  }

  showDamageNumber(target, damage) {
    const isEnemy = target.isEnemy;
    let x, y;

    if (isEnemy) {
      const sprite = this.enemySprites.find(s => s.enemyData === target);
      if (sprite) {
        x = sprite.x;
        y = sprite.y - 50;
      }
    } else {
      const sprite = this.partySprites.find(s => s.memberData === target);
      if (sprite) {
        x = sprite.x;
        y = sprite.y - 50;
      }
    }

    const dmgText = this.add.text(x, y, `-${damage}`, {
      fontSize: '28px',
      fill: '#ff4444',
      stroke: '#000000',
      strokeThickness: 3
    });
    dmgText.setOrigin(0.5);

    this.tweens.add({
      targets: dmgText,
      y: y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => dmgText.destroy()
    });
  }

  showStatusText(target, text) {
    const sprite = this.partySprites.find(s => s.memberData === target);
    if (!sprite) return;

    const statusText = this.add.text(sprite.x, sprite.y - 50, text, {
      fontSize: '20px',
      fill: '#44aaff',
      stroke: '#000000',
      strokeThickness: 2
    });
    statusText.setOrigin(0.5);

    this.tweens.add({
      targets: statusText,
      y: sprite.y - 80,
      alpha: 0,
      duration: 1000,
      onComplete: () => statusText.destroy()
    });
  }

  handleDefeat(combatant) {
    if (combatant.isEnemy) {
      const sprite = this.enemySprites.find(s => s.enemyData === combatant);
      if (sprite) {
        this.tweens.add({
          targets: sprite,
          alpha: 0,
          duration: 500
        });
      }
    } else {
      const sprite = this.partySprites.find(s => s.memberData === combatant);
      if (sprite) {
        sprite.sprite.setFillStyle(0x666666);
      }
    }
  }

  checkBattleEnd() {
    const aliveParty = this.party.filter(m => m.hp > 0);
    const aliveEnemies = this.enemies.filter(e => e.hp > 0);

    if (aliveEnemies.length === 0) {
      this.battleState = 'VICTORY';
      this.showVictory();
      return true;
    }

    if (aliveParty.length === 0) {
      this.battleState = 'DEFEAT';
      this.showDefeat();
      return true;
    }

    return false;
  }

  showVictory() {
    const { width, height } = this.cameras.main;

    // Victory screen
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    
    const victoryText = this.add.text(width / 2, height / 2 - 50, 'VICTORY!', {
      fontSize: '48px',
      fill: '#d4af37',
      stroke: '#000000',
      strokeThickness: 4
    });
    victoryText.setOrigin(0.5);

    // Calculate rewards
    const expGained = this.enemies.reduce((sum, e) => sum + (e.exp || 15), 0);
    const goldGained = this.enemies.reduce((sum, e) => sum + (e.gold || 10), 0);

    const rewardText = this.add.text(width / 2, height / 2 + 20, 
      `EXP: +${expGained}\nGold: +${goldGained}`, {
      fontSize: '24px',
      fill: '#ffffff',
      align: 'center'
    });
    rewardText.setOrigin(0.5);

    // Continue button
    const continueBtn = this.add.text(width / 2, height / 2 + 100, 'Continue', {
      fontSize: '28px',
      fill: '#ffffff',
      backgroundColor: '#2a2a4a',
      padding: { x: 30, y: 15 }
    });
    continueBtn.setOrigin(0.5);
    continueBtn.setInteractive({ useHandCursor: true });
    continueBtn.on('pointerdown', () => {
      // Update game state
      const gameState = this.registry.get('gameState');
      gameState.currency += goldGained;
      // TODO: Add exp to party members
      
      this.scene.start('VillageScene');
    });
  }

  showDefeat() {
    const { width, height } = this.cameras.main;

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    
    const defeatText = this.add.text(width / 2, height / 2 - 30, 'GAME OVER', {
      fontSize: '48px',
      fill: '#aa3333',
      stroke: '#000000',
      strokeThickness: 4
    });
    defeatText.setOrigin(0.5);

    const retryBtn = this.add.text(width / 2, height / 2 + 50, 'Return to Menu', {
      fontSize: '24px',
      fill: '#ffffff',
      backgroundColor: '#2a2a4a',
      padding: { x: 20, y: 10 }
    });
    retryBtn.setOrigin(0.5);
    retryBtn.setInteractive({ useHandCursor: true });
    retryBtn.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
