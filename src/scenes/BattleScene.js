import Phaser from 'phaser';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data) {
    this.battleData = data || {
      enemies: [{ id: 'eidolon', name: 'Eidolon', hp: 50, maxHp: 50, attack: 12, defense: 5 }],
      background: 'bg_temple'
    };
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    if (this.textures.exists(this.battleData.background)) {
      this.add.image(width / 2, height / 2, this.battleData.background).setDisplaySize(width, height);
    } else {
      this.add.rectangle(width / 2, height / 2, width, height, 0x2a3344);
    }

    // Darken bottom for UI
    this.add.rectangle(width / 2, height - 90, width, 180, 0x000000, 0.7);

    // Get party
    const gameState = this.registry.get('gameState');
    this.party = gameState.party.map(m => ({ ...m, isDefending: false }));
    this.enemies = this.battleData.enemies.map(e => ({ ...e }));

    // Create combatants
    this.createCombatants(width, height);

    // Create UI
    this.createUI(width, height);

    // State
    this.battleState = 'PLAYER_TURN';

    this.cameras.main.fadeIn(300);
    
    // Battle intro sequence
    this.showMessage('An Eidolon appears!');
    this.time.delayedCall(1500, () => {
      this.showMessage('A spirit of the forgotten...');
      this.time.delayedCall(1500, () => {
        this.messageBox.setVisible(false);
        this.commandMenu.setVisible(true);
      });
    });
  }

  createCombatants(width, height) {
    // Player - left side
    const px = width * 0.25;
    const py = height * 0.45;
    
    this.party[0].sprite = this.add.container(px, py);
    const pShadow = this.add.ellipse(0, 30, 35, 12, 0x000000, 0.4);
    const pBody = this.add.graphics();
    pBody.fillStyle(0x3355aa);
    pBody.fillRoundedRect(-15, -10, 30, 45, 6);
    const pHead = this.add.graphics();
    pHead.fillStyle(0xddb896);
    pHead.fillCircle(0, -28, 14);
    const pHair = this.add.graphics();
    pHair.fillStyle(0x4a3728);
    pHair.fillEllipse(0, -38, 20, 10);
    this.party[0].sprite.add([pShadow, pBody, pHead, pHair]);
    this.party[0].baseX = px;

    // Enemy - right side  
    const ex = width * 0.72;
    const ey = height * 0.38;
    
    this.enemies[0].sprite = this.add.container(ex, ey);
    const eShadow = this.add.ellipse(0, 40, 45, 15, 0x000000, 0.4);
    const eBody = this.add.graphics();
    eBody.fillStyle(0x443366);
    eBody.fillRoundedRect(-20, -15, 40, 60, 8);
    const eHead = this.add.graphics();
    eHead.fillStyle(0x554477);
    eHead.fillCircle(0, -40, 18);
    const eEye1 = this.add.circle(-7, -43, 4, 0xff3333);
    const eEye2 = this.add.circle(7, -43, 4, 0xff3333);
    this.enemies[0].sprite.add([eShadow, eBody, eHead, eEye1, eEye2]);
    this.enemies[0].baseX = ex;

    // Enemy HP bar
    const enemy = this.enemies[0];
    this.add.text(ex, ey - 85, enemy.name, { fontSize: '18px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.rectangle(ex, ey - 65, 82, 14, 0x333333).setStrokeStyle(1, 0x666666);
    enemy.hpBar = this.add.rectangle(ex - 38, ey - 65, 76, 10, 0xcc3333).setOrigin(0, 0.5);
  }

  createUI(width, height) {
    // Party status
    const member = this.party[0];
    this.add.text(30, height - 160, member.name, { fontSize: '20px', fill: '#ffffff' });
    
    // HP bar
    this.add.text(30, height - 130, 'HP', { fontSize: '14px', fill: '#888888' });
    this.add.rectangle(110, height - 123, 102, 16, 0x333333).setStrokeStyle(1, 0x555555);
    this.hpFill = this.add.rectangle(60, height - 123, 100 * (member.hp / member.maxHp), 12, 0x44aa44).setOrigin(0, 0.5);
    this.hpText = this.add.text(170, height - 130, `${member.hp}/${member.maxHp}`, { fontSize: '14px', fill: '#88ff88' });

    // MP bar
    this.add.text(30, height - 100, 'MP', { fontSize: '14px', fill: '#888888' });
    this.add.rectangle(110, height - 93, 102, 16, 0x333333).setStrokeStyle(1, 0x555555);
    this.mpFill = this.add.rectangle(60, height - 93, 100 * (member.mp / member.maxMp), 12, 0x4466cc).setOrigin(0, 0.5);
    this.mpText = this.add.text(170, height - 100, `${member.mp}/${member.maxMp}`, { fontSize: '14px', fill: '#88aaff' });

    // Command menu
    this.commandMenu = this.add.container(width - 110, height - 115).setVisible(false);
    const menuBg = this.add.rectangle(0, 0, 160, 150, 0x111111, 0.9).setStrokeStyle(1, 0x666666);
    this.commandMenu.add(menuBg);

    ['Attack', 'Skill', 'Defend', 'Flee'].forEach((cmd, i) => {
      const btn = this.add.text(0, -55 + i * 35, cmd, { fontSize: '18px', fill: '#cccccc' }).setOrigin(0.5);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setColor('#ffcc00'));
      btn.on('pointerout', () => btn.setColor('#cccccc'));
      btn.on('pointerdown', () => this.doAction(cmd.toLowerCase()));
      this.commandMenu.add(btn);
    });

    // Message box
    this.messageBox = this.add.container(width / 2, height / 2 - 50).setVisible(false);
    const msgBg = this.add.rectangle(0, 0, 300, 60, 0x000000, 0.85).setStrokeStyle(1, 0x888888);
    this.messageText = this.add.text(0, 0, '', { fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);
    this.messageBox.add([msgBg, this.messageText]);
  }

  showMessage(text) {
    this.messageText.setText(text);
    this.messageBox.setVisible(true);
  }

  doAction(action) {
    if (this.battleState !== 'PLAYER_TURN') return;
    this.battleState = 'EXECUTING';
    this.commandMenu.setVisible(false);

    const player = this.party[0];
    const enemy = this.enemies[0];

    if (action === 'attack') {
      const dmg = Math.max(1, player.attack + Phaser.Math.Between(-2, 4) - Math.floor(enemy.defense / 2));
      this.tweens.add({
        targets: player.sprite,
        x: player.sprite.x + 120,
        duration: 100,
        yoyo: true,
        onYoyo: () => this.damageEnemy(enemy, dmg),
        onComplete: () => this.afterPlayerTurn()
      });
    } else if (action === 'skill') {
      if (player.mp < 10) {
        this.showMessage('No MP!');
        this.time.delayedCall(800, () => { this.messageBox.setVisible(false); this.battleState = 'PLAYER_TURN'; this.commandMenu.setVisible(true); });
        return;
      }
      player.mp -= 10;
      const heal = Math.floor(player.magic * 2 + 15);
      player.hp = Math.min(player.maxHp, player.hp + heal);
      this.updatePlayerUI();
      this.showDamage(player.sprite.x, player.sprite.y - 50, '+' + heal, '#44ff44');
      this.showMessage('Healed!');
      this.time.delayedCall(1000, () => this.afterPlayerTurn());
    } else if (action === 'defend') {
      player.isDefending = true;
      this.showMessage('Defending');
      this.time.delayedCall(800, () => this.afterPlayerTurn());
    } else if (action === 'flee') {
      if (Phaser.Math.Between(0, 1)) {
        this.showMessage('Escaped!');
        this.time.delayedCall(800, () => { this.cameras.main.fadeOut(300); this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('VillageScene')); });
      } else {
        this.showMessage('Failed!');
        this.time.delayedCall(800, () => this.afterPlayerTurn());
      }
    }
  }

  damageEnemy(enemy, dmg) {
    enemy.hp = Math.max(0, enemy.hp - dmg);
    this.tweens.add({ targets: enemy.hpBar, scaleX: enemy.hp / enemy.maxHp, duration: 150 });
    this.showDamage(enemy.sprite.x, enemy.sprite.y - 70, '-' + dmg, '#ffff44');
    if (enemy.hp <= 0) {
      this.tweens.add({ targets: enemy.sprite, alpha: 0, duration: 400 });
    }
  }

  updatePlayerUI() {
    const p = this.party[0];
    this.tweens.add({ targets: this.hpFill, width: 100 * (p.hp / p.maxHp), duration: 150 });
    this.tweens.add({ targets: this.mpFill, width: 100 * (p.mp / p.maxMp), duration: 150 });
    this.hpText.setText(`${p.hp}/${p.maxHp}`);
    this.mpText.setText(`${p.mp}/${p.maxMp}`);
  }

  showDamage(x, y, text, color) {
    const t = this.add.text(x, y, text, { fontSize: '28px', fill: color, stroke: '#000', strokeThickness: 3 }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 30, alpha: 0, duration: 600, onComplete: () => t.destroy() });
  }

  afterPlayerTurn() {
    this.messageBox.setVisible(false);
    if (this.enemies[0].hp <= 0) { this.victory(); return; }
    this.enemyTurn();
  }

  enemyTurn() {
    this.battleState = 'ENEMY_TURN';
    const enemy = this.enemies[0];
    const player = this.party[0];

    this.time.delayedCall(500, () => {
      let dmg = Math.max(1, enemy.attack + Phaser.Math.Between(-2, 3) - Math.floor(player.defense / 2));
      if (player.isDefending) { dmg = Math.floor(dmg / 2); player.isDefending = false; }

      this.tweens.add({
        targets: enemy.sprite,
        x: enemy.sprite.x - 100,
        duration: 100,
        yoyo: true,
        onYoyo: () => {
          player.hp = Math.max(0, player.hp - dmg);
          this.updatePlayerUI();
          this.showDamage(player.sprite.x, player.sprite.y - 50, '-' + dmg, '#ff4444');
        },
        onComplete: () => {
          if (player.hp <= 0) { this.defeat(); return; }
          this.battleState = 'PLAYER_TURN';
          this.commandMenu.setVisible(true);
        }
      });
    });
  }

  victory() {
    this.battleState = 'DONE';
    const { width, height } = this.cameras.main;
    this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.7);
    this.add.text(width/2, height/2 - 40, 'VICTORY', { fontSize: '48px', fill: '#ffcc00' }).setOrigin(0.5);
    const exp = this.battleData.enemies[0].exp || 20;
    const gold = this.battleData.enemies[0].gold || 10;
    this.add.text(width/2, height/2 + 10, `EXP +${exp}  Gold +${gold}`, { fontSize: '22px', fill: '#ffffff' }).setOrigin(0.5);
    const btn = this.add.text(width/2, height/2 + 60, '[ Continue ]', { fontSize: '22px', fill: '#888888' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerdown', () => {
      const gs = this.registry.get('gameState');
      gs.currency += gold;
      gs.party[0].hp = Math.min(gs.party[0].maxHp, gs.party[0].hp + 30);
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('VillageScene'));
    });
  }

  defeat() {
    this.battleState = 'DONE';
    const { width, height } = this.cameras.main;
    this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.85);
    this.add.text(width/2, height/2 - 20, 'GAME OVER', { fontSize: '48px', fill: '#cc2222' }).setOrigin(0.5);
    const btn = this.add.text(width/2, height/2 + 40, '[ Title ]', { fontSize: '22px', fill: '#666666' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerdown', () => { this.cameras.main.fadeOut(400); this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('MainMenuScene')); });
  }
}
