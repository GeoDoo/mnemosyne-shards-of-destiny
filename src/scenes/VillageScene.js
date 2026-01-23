import Phaser from 'phaser';
import DialogueSystem from '../systems/DialogueSystem.js';

export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
    this.player = null;
    this.cursors = null;
    this.npcs = [];
    this.dialogueSystem = null;
    this.moveSpeed = 200;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create background layers
    this.createBackground(width, height);

    // Create player
    this.createPlayer(width, height);

    // Create NPCs
    this.createNPCs();

    // Create dialogue system
    this.dialogueSystem = new DialogueSystem(this);

    // Create UI
    this.createUI(width);

    // Setup input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });

    // Touch/click to move
    this.input.on('pointerdown', (pointer) => {
      if (!this.dialogueSystem.isActive()) {
        this.movePlayerTo(pointer.worldX, pointer.worldY);
      }
    });

    // Interact key
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  createBackground(width, height) {
    // Sky
    this.add.rectangle(width / 2, 200, width, 400, 0x87ceeb);

    // Mountains in background
    this.add.rectangle(90, 300, 180, 150, 0x6b7c8f);
    this.add.rectangle(235, 280, 230, 200, 0x7a8c9f);
    this.add.rectangle(410, 320, 260, 120, 0x606d7a);

    // Temple on hill (distant)
    this.add.rectangle(435, 200, 100, 80, 0x5a6a5a);
    this.add.rectangle(435, 160, 80, 50, 0xd5d0c5).setStrokeStyle(1, 0x8a8275);

    // Ground
    this.add.rectangle(width / 2, 650, width, 500, 0x5a8f4a);

    // Path
    this.add.rectangle(width / 2, 650, 140, 500, 0x9a8565);

    // Houses
    this.createHouse(100, 470, 0x8b6b4a);
    this.createHouse(440, 520, 0x8b6b4a);

    // Temple direction sign
    const signText = this.add.text(width / 2, 420, '↑ Temple', {
      fontSize: '24px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    signText.setOrigin(0.5);
  }

  createHouse(x, y, color) {
    // House body
    this.add.rectangle(x, y, 100, 100, color);
    // Roof
    this.add.triangle(x, y - 70, 0, 40, 60, -20, 120, 40, 0x654321);
  }

  createPlayer(width, height) {
    // Create player sprite (simple rectangle for now, can replace with sprite later)
    this.player = this.add.container(width / 2, height * 0.75);
    
    // Player body (simple colored shapes as placeholder)
    const body = this.add.rectangle(0, 0, 40, 60, 0x4a7ab0);
    const head = this.add.circle(0, -40, 15, 0xe8c4a0);
    const hair = this.add.ellipse(0, -50, 32, 20, 0x3d2817);

    this.player.add([body, head, hair]);
    
    // Add physics
    this.physics.world.enable(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(40, 60);

    // Player state
    this.player.isMoving = false;
    this.player.targetX = null;
    this.player.targetY = null;
  }

  createNPCs() {
    // Epimenides - Village Elder
    const epimenides = this.createNPC(120, 580, 'Epimenides', {
      portrait: 'portrait_epimenides',
      dialogue: [
        { speaker: 'Epimenides', text: 'Welcome, young Alkmaeon.' },
        { speaker: 'Epimenides', text: 'The temple on the hill... it calls to you, does it not?' },
        { speaker: 'Epimenides', text: 'I have seen that look before. Go, but be careful.' }
      ]
    });
    this.npcs.push(epimenides);
  }

  createNPC(x, y, name, data) {
    const npc = this.add.container(x, y);
    
    // NPC body (placeholder shapes)
    const body = this.add.rectangle(0, 0, 48, 70, 0x7a6a5a);
    const head = this.add.circle(0, -45, 14, 0xd5c0a5);
    const beard = this.add.ellipse(0, -35, 20, 15, 0xaaaaaa);

    npc.add([body, head, beard]);

    // Name label
    const nameLabel = this.add.text(0, -80, name, {
      fontSize: '14px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });
    nameLabel.setOrigin(0.5);
    npc.add(nameLabel);

    // Store NPC data
    npc.npcData = {
      name: name,
      ...data
    };

    // Make interactive
    const hitArea = this.add.rectangle(0, 0, 60, 90, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });
    npc.add(hitArea);

    hitArea.on('pointerdown', () => {
      this.interactWithNPC(npc);
    });

    return npc;
  }

  createUI(width) {
    // Location label
    const locationBg = this.add.rectangle(width / 2, 40, width, 60, 0x1a1a2e, 0.8);
    const locationText = this.add.text(20, 25, 'Thespiae', {
      fontSize: '28px',
      fill: '#ffffff',
      fontFamily: 'Georgia, serif'
    });

    // Instructions
    const instructions = this.add.text(width / 2, 920, 'Tap to move • Walk to Elder to talk', {
      fontSize: '16px',
      fill: '#ffffff',
      alpha: 0.7
    });
    instructions.setOrigin(0.5);
  }

  update() {
    if (this.dialogueSystem.isActive()) {
      this.player.body.setVelocity(0);
      return;
    }

    // Keyboard movement
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -this.moveSpeed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = this.moveSpeed;

    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -this.moveSpeed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = this.moveSpeed;

    // If keyboard input, cancel tap-to-move
    if (vx !== 0 || vy !== 0) {
      this.player.targetX = null;
      this.player.targetY = null;
      this.player.body.setVelocity(vx, vy);
    }
    // Tap-to-move
    else if (this.player.targetX !== null) {
      const dx = this.player.targetX - this.player.x;
      const dy = this.player.targetY - this.player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 10) {
        this.player.body.setVelocity(0);
        this.player.targetX = null;
        this.player.targetY = null;
      } else {
        const angle = Math.atan2(dy, dx);
        this.player.body.setVelocity(
          Math.cos(angle) * this.moveSpeed,
          Math.sin(angle) * this.moveSpeed
        );
      }
    } else {
      this.player.body.setVelocity(0);
    }

    // Check for NPC proximity for auto-highlight
    this.checkNPCProximity();
  }

  movePlayerTo(x, y) {
    this.player.targetX = x;
    this.player.targetY = y;
  }

  checkNPCProximity() {
    const interactDistance = 80;
    
    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        npc.x, npc.y
      );
      
      // Visual feedback when near NPC
      if (dist < interactDistance) {
        npc.setScale(1.05);
      } else {
        npc.setScale(1);
      }
    }
  }

  tryInteract() {
    const interactDistance = 80;
    
    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        npc.x, npc.y
      );
      
      if (dist < interactDistance) {
        this.interactWithNPC(npc);
        return;
      }
    }
  }

  interactWithNPC(npc) {
    if (this.dialogueSystem.isActive()) return;
    
    // Stop player movement
    this.player.body.setVelocity(0);
    this.player.targetX = null;
    this.player.targetY = null;

    // Start dialogue
    this.dialogueSystem.startDialogue(npc.npcData.dialogue, npc.npcData.portrait);
  }
}
