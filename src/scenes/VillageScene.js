import Phaser from 'phaser';
import { House, HouseColors, Tree, NPC, Crate, Barrel, MarketStall, Well } from '../components';

// Performance: Squared distance avoids expensive sqrt() in update loop
const distSq = (x1, y1, x2, y2) => (x2 - x1) ** 2 + (y2 - y1) ** 2;
const INTERACT_DIST_SQ = 6400; // 80^2

export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Load dialogue data
    this.dialogueData = this.registry.get('dialogues')?.village || {};

    // Create the world (larger than screen for exploration)
    this.worldWidth = 2000;
    this.worldHeight = 1500;
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // Create everything in code
    this.createGround();
    this.createBuildings();
    this.createTrees();
    this.createMarket();
    this.createDecorations();
    
    // Create NPCs
    this.npcs = [];
    this.createNPCs();

    // Create player LAST
    this.createPlayer();

    // Camera follows player
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // UI (fixed to camera)
    this.createUI();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,B,G');

    // State
    this.inDialogue = false;
    this.nearestInteractable = null;

    this.cameras.main.fadeIn(500);
  }

  createGround() {
    // Grass base
    this.add.rectangle(this.worldWidth/2, this.worldHeight/2, this.worldWidth, this.worldHeight, 0x4a7a3a);

    // Dirt paths
    this.add.rectangle(this.worldWidth/2, this.worldHeight/2, 150, this.worldHeight, 0x8b7355); // Vertical main
    this.add.rectangle(this.worldWidth/2, this.worldHeight/2, this.worldWidth * 0.6, 120, 0x8b7355); // Horizontal
    
    // Path details (lighter dirt)
    this.add.rectangle(this.worldWidth/2, this.worldHeight/2, 130, this.worldHeight, 0x9a8465);
    this.add.rectangle(this.worldWidth/2, this.worldHeight/2, this.worldWidth * 0.55, 100, 0x9a8465);

    // Village square (center)
    this.add.rectangle(this.worldWidth/2, this.worldHeight/2, 400, 350, 0x9a8465);
    this.add.rectangle(this.worldWidth/2, this.worldHeight/2, 380, 330, 0xa89575);
  }

  createBuildings() {
    this.buildings = this.physics.add.staticGroup();
    this.houses = [];

    // House 1 - Top left (Greek Villa style)
    const house1 = new House(this, {
      x: 300,
      y: 250,
      width: 200,
      height: 150,
      wallColor: HouseColors.wall.stone,
      roofColor: HouseColors.roof.terracotta,
      windows: [
        { side: 'left', hasShutters: true, shutterColor: 0x4466aa },
        { side: 'right', hasShutters: true, shutterColor: 0x4466aa }
      ],
      decorations: ['flowerPot'],
      hasCollider: true
    });
    this.houses.push(house1);
    if (house1.getCollider()) this.buildings.add(house1.getCollider());
    
    // House 2 - Top right (Simple residence)
    const house2 = new House(this, {
      x: 1700,
      y: 250,
      width: 180,
      height: 140,
      wallColor: HouseColors.wall.stucco,
      roofColor: HouseColors.roof.terracotta,
      windows: [{ side: 'left' }, { side: 'right' }],
      decorations: ['amphora'],
      hasCollider: true
    });
    this.houses.push(house2);
    if (house2.getCollider()) this.buildings.add(house2.getCollider());
    
    // Shop - Left side (General Store)
    const shop = new House(this, {
      x: 200,
      y: 700,
      width: 160,
      height: 120,
      wallColor: HouseColors.wall.tan,
      roofColor: HouseColors.roof.brown,
      doorColor: HouseColors.door.oak,
      trim: HouseColors.trim.gold,
      windows: [{ side: 'right', hasShutters: true }],
      decorations: ['amphora', 'flowerPot'],
      hasCollider: true
    });
    this.houses.push(shop);
    if (shop.getCollider()) this.buildings.add(shop.getCollider());
    
    // Tavern - Right side
    const tavern = new House(this, {
      x: 1800,
      y: 700,
      width: 200,
      height: 150,
      wallColor: HouseColors.wall.stucco,
      roofColor: HouseColors.roof.brown,
      doorColor: HouseColors.door.darkWood,
      trim: 0x8b6914,
      windows: [
        { side: 'left', hasShutters: true, shutterColor: 0x6b4c38 },
        { side: 'right', hasShutters: true, shutterColor: 0x6b4c38 }
      ],
      decorations: ['torch', 'hangingPlant'],
      hasCollider: true
    });
    this.houses.push(tavern);
    if (tavern.getCollider()) this.buildings.add(tavern.getCollider());
    
    // Temple entrance (north) - leads to battle
    this.createTempleEntrance(this.worldWidth/2, 80);
    
    // Well in center (using new component)
    this.well = new Well(this, {
      x: this.worldWidth/2,
      y: this.worldHeight/2,
      variant: 'village'
    });
    if (this.well.getCollider()) this.buildings.add(this.well.getCollider());
    this.wellInteractable = this.well.getInteractable();
  }

  createTempleEntrance(x, y) {
    const entrance = this.add.container(x, y);
    
    // Stone steps (3 levels - Greek temple style)
    entrance.add(this.add.rectangle(0, 60, 220, 15, 0x888888));
    entrance.add(this.add.rectangle(0, 45, 200, 15, 0x999999));
    entrance.add(this.add.rectangle(0, 30, 180, 15, 0xaaaaaa));
    
    // Platform
    entrance.add(this.add.rectangle(0, 15, 160, 20, 0xbbbbbb));
    
    // Doric columns (fluted appearance)
    for (let col of [-55, -20, 20, 55]) {
      // Column base
      entrance.add(this.add.rectangle(col, 5, 22, 8, 0xcccccc));
      // Column shaft
      entrance.add(this.add.rectangle(col, -35, 16, 70, 0xdddddd));
      entrance.add(this.add.rectangle(col, -35, 14, 68, 0xeeeeee));
      // Fluting lines
      const flutes = this.add.graphics();
      flutes.lineStyle(1, 0xcccccc);
      flutes.moveTo(col - 4, -68);
      flutes.lineTo(col - 4, 0);
      flutes.moveTo(col + 4, -68);
      flutes.lineTo(col + 4, 0);
      flutes.strokePath();
      entrance.add(flutes);
      // Column capital (Doric)
      entrance.add(this.add.rectangle(col, -72, 24, 6, 0xdddddd));
      entrance.add(this.add.rectangle(col, -78, 28, 6, 0xcccccc));
    }
    
    // Entablature (beam above columns)
    entrance.add(this.add.rectangle(0, -85, 180, 12, 0xccccbb));
    
    // Pediment (triangular gable) using graphics
    const pediment = this.add.graphics();
    pediment.fillStyle(0xddddcc);
    pediment.beginPath();
    pediment.moveTo(-95, -91);
    pediment.lineTo(0, -125);
    pediment.lineTo(95, -91);
    pediment.closePath();
    pediment.fillPath();
    entrance.add(pediment);
    
    // Pediment border
    const pedBorder = this.add.graphics();
    pedBorder.lineStyle(3, 0xbbbbaa);
    pedBorder.beginPath();
    pedBorder.moveTo(-95, -91);
    pedBorder.lineTo(0, -125);
    pedBorder.lineTo(95, -91);
    pedBorder.closePath();
    pedBorder.strokePath();
    entrance.add(pedBorder);
    
    // Temple name in pediment
    entrance.add(this.add.text(0, -105, 'APOLLO', { 
      fontSize: '11px', 
      fill: '#8b7355',
      fontStyle: 'bold'
    }).setOrigin(0.5));
    
    // Dark entrance doorway
    entrance.add(this.add.rectangle(0, -10, 60, 55, 0x1a1a25));
    entrance.add(this.add.rectangle(0, -10, 50, 45, 0x0a0a15));
    
    // Mysterious glow from within
    entrance.add(this.add.rectangle(0, -10, 30, 30, 0x3a3a55, 0.3));
    
    // Collision for columns
    const leftCols = this.add.rectangle(x - 55, y - 20, 30, 90, 0x000000, 0);
    const rightCols = this.add.rectangle(x + 55, y - 20, 30, 90, 0x000000, 0);
    this.physics.add.existing(leftCols, true);
    this.physics.add.existing(rightCols, true);
    this.buildings.add(leftCols);
    this.buildings.add(rightCols);
    
    // Temple zone trigger
    this.templeZone = this.add.rectangle(x, y + 10, 50, 30, 0x000000, 0);
    this.physics.add.existing(this.templeZone, true);
  }

  createTrees() {
    // Store trees and their colliders using the new Tree component
    this.trees = [];
    this.treeColliders = [];
    
    const treePositions = [
      [100, 400], [100, 1000], [100, 1300],
      [1900, 400], [1900, 1000], [1900, 1300],
      [500, 100], [800, 150], [1200, 150], [1500, 100],
      [400, 1400], [700, 1350], [1300, 1350], [1600, 1400],
    ];
    
    treePositions.forEach(([x, y]) => {
      const tree = new Tree(this, { x, y, variant: 'cypress', hasCollider: true });
      this.trees.push(tree);
      if (tree.getCollider()) {
        this.treeColliders.push(tree.getCollider());
      }
    });
  }

  createMarket() {
    this.marketItems = this.physics.add.staticGroup();
    this.props = [];
    this.interactables = this.interactables || [];
    
    // Market stalls (using new components)
    const fruitStall = new MarketStall(this, {
      x: this.worldWidth/2 + 250,
      y: this.worldHeight/2 - 80,
      variant: 'fruit',
      name: 'Fruit Stand'
    });
    this.props.push(fruitStall);
    if (fruitStall.getCollider()) this.marketItems.add(fruitStall.getCollider());
    if (fruitStall.getInteractable()) this.interactables.push(fruitStall.getInteractable());
    
    const potteryStall = new MarketStall(this, {
      x: this.worldWidth/2 + 250,
      y: this.worldHeight/2 + 80,
      variant: 'pottery',
      name: 'Pottery'
    });
    this.props.push(potteryStall);
    if (potteryStall.getCollider()) this.marketItems.add(potteryStall.getCollider());
    if (potteryStall.getInteractable()) this.interactables.push(potteryStall.getInteractable());
    
    // Crates (using new components)
    const crate1 = new Crate(this, { x: this.worldWidth/2 - 280, y: this.worldHeight/2 - 100 });
    const crate2 = new Crate(this, { x: this.worldWidth/2 - 250, y: this.worldHeight/2 - 80 });
    this.props.push(crate1, crate2);
    if (crate1.getCollider()) this.marketItems.add(crate1.getCollider());
    if (crate2.getCollider()) this.marketItems.add(crate2.getCollider());
    
    // Barrels (using new components)
    const barrel1 = new Barrel(this, { x: this.worldWidth/2 - 300, y: this.worldHeight/2 + 50 });
    const barrel2 = new Barrel(this, { x: this.worldWidth/2 - 270, y: this.worldHeight/2 + 80 });
    this.props.push(barrel1, barrel2);
    if (barrel1.getCollider()) this.marketItems.add(barrel1.getCollider());
    if (barrel2.getCollider()) this.marketItems.add(barrel2.getCollider());
  }

  createDecorations() {
    // Flowers scattered around
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(50, this.worldWidth - 50);
      const y = Phaser.Math.Between(50, this.worldHeight - 50);
      const color = Phaser.Utils.Array.GetRandom([0xff6688, 0xffff66, 0x88aaff, 0xffffff]);
      this.add.circle(x, y, 4, color);
    }
    
    // Grass tufts
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(50, this.worldWidth - 50);
      const y = Phaser.Math.Between(50, this.worldHeight - 50);
      this.add.ellipse(x, y, 8, 12, 0x3a6a2a);
    }
  }

  createNPCs() {
    // Epimenides - village elder, near the well
    const epimenides = new NPC(this, {
      x: this.worldWidth/2 - 100,
      y: this.worldHeight/2 + 100,
      name: 'Epimenides',
      variant: 'elder',
      dialogue: this.dialogueData.npcs?.epimenides?.dialogue || [{ speaker: 'Epimenides', text: 'Welcome, traveler.' }]
    });
    this.npcs.push(epimenides.getData());
    
    // Merchant - at fruit stand
    const merchant = new NPC(this, {
      x: this.worldWidth/2 + 180,
      y: this.worldHeight/2 - 80,
      name: 'Merchant',
      variant: 'merchant',
      dialogue: this.dialogueData.npcs?.merchant?.dialogue || [{ speaker: 'Merchant', text: 'Fine goods for sale!' }]
    });
    this.npcs.push(merchant.getData());
  }

  createPlayer() {
    const startX = this.worldWidth/2;
    const startY = this.worldHeight/2 + 200;
    
    // Create physics body as a simple rectangle sprite
    this.player = this.add.rectangle(startX, startY, 24, 36, 0x000000, 0);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    
    // Visual elements stored separately (will follow player in update)
    this.playerVisuals = this.add.container(startX, startY);
    
    // Shadow
    this.playerVisuals.add(this.add.ellipse(0, 18, 20, 8, 0x000000, 0.4));
    
    // Greek chiton (tunic)
    this.playerVisuals.add(this.add.rectangle(0, 5, 16, 28, 0xf0e8d8));
    this.playerVisuals.add(this.add.rectangle(0, 5, 14, 26, 0xf5efe5));
    this.playerVisuals.add(this.add.rectangle(0, 2, 16, 4, 0x4466aa)); // Belt
    
    // Arms
    this.playerVisuals.add(this.add.rectangle(-10, 2, 4, 12, 0xddb896));
    this.playerVisuals.add(this.add.rectangle(10, 2, 4, 12, 0xddb896));
    
    // Head
    this.playerVisuals.add(this.add.circle(0, -14, 10, 0xddb896));
    
    // Hair
    this.playerVisuals.add(this.add.ellipse(0, -22, 14, 8, 0x3a2718));
    this.playerVisuals.add(this.add.ellipse(-6, -16, 5, 6, 0x3a2718));
    this.playerVisuals.add(this.add.ellipse(6, -16, 5, 6, 0x3a2718));
    
    // Eyes (cyan)
    this.playerVisuals.add(this.add.circle(-4, -14, 2, 0x44ddff));
    this.playerVisuals.add(this.add.circle(4, -14, 2, 0x44ddff));
    
    this.playerVisuals.setDepth(100);
    
    // Collisions
    this.physics.add.collider(this.player, this.buildings);
    this.physics.add.collider(this.player, this.marketItems);
    
    // Add collision with each tree collider individually
    this.treeColliders.forEach(tree => {
      this.physics.add.collider(this.player, tree);
    });
  }

  createUI() {
    // Interaction prompt (fixed to camera)
    this.promptText = this.add.text(this.cameras.main.width/2, this.cameras.main.height - 50, '', {
      fontSize: '18px',
      fill: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(100).setVisible(false);

    // Location
    this.add.rectangle(0, 0, this.cameras.main.width, 35, 0x000000, 0.7)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    this.add.text(15, 8, 'Thespiae Village', { fontSize: '18px', fill: '#ffffff' })
      .setScrollFactor(0).setDepth(100);
    this.add.text(this.cameras.main.width - 15, 8, 'SPACE: Interact | B: Temple of Apollo', { fontSize: '12px', fill: '#888888' })
      .setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Dialogue box
    this.createDialogueUI();
  }

  createDialogueUI() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    
    this.dialogueBox = this.add.container(0, 0).setScrollFactor(0).setDepth(200).setVisible(false);
    
    this.dialogueBox.add(this.add.rectangle(w/2, h/2, w, h, 0x000000, 0.5));
    this.dialogueBox.add(this.add.rectangle(w/2, h - 100, w - 40, 150, 0x1a1a2a, 0.95).setStrokeStyle(2, 0x666666));
    
    this.speakerText = this.add.text(40, h - 170, '', { fontSize: '18px', fill: '#ffcc44' }).setScrollFactor(0);
    this.dialogueText = this.add.text(40, h - 140, '', { fontSize: '16px', fill: '#ffffff', wordWrap: { width: w - 80 } }).setScrollFactor(0);
    this.continueHint = this.add.text(w - 50, h - 40, '[SPACE]', { fontSize: '12px', fill: '#666666' }).setScrollFactor(0);
    
    this.dialogueBox.add([this.speakerText, this.dialogueText, this.continueHint]);
  }

  update() {
    if (this.inDialogue) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
        this.advanceDialogue();
      }
      return;
    }

    // Movement - FAST
    const speed = 350;
    let vx = 0, vy = 0;

    if (this.keys.A.isDown || this.cursors.left.isDown) vx = -speed;
    else if (this.keys.D.isDown || this.cursors.right.isDown) vx = speed;
    if (this.keys.W.isDown || this.cursors.up.isDown) vy = -speed;
    else if (this.keys.S.isDown || this.cursors.down.isDown) vy = speed;

    // Normalize diagonal
    if (vx && vy) { vx *= 0.707; vy *= 0.707; }

    this.player.body.setVelocity(vx, vy);
    
    // Update visual position to follow physics body
    this.playerVisuals.setPosition(this.player.x, this.player.y);

    // Check temple zone
    if (this.physics.overlap(this.player, this.templeZone)) {
      this.promptText.setText('SPACE: Enter Temple of Apollo').setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
        this.goToTemple();
        return;
      }
    }
    // Check NPC proximity
    else {
      this.nearestInteractable = null;
      let nearest = null;
      let nearestDistSq = INTERACT_DIST_SQ;

      // Check NPCs - using squared distance (avoids sqrt)
      for (let i = 0; i < this.npcs.length; i++) {
        const npc = this.npcs[i];
        const d = distSq(this.player.x, this.player.y, npc.x, npc.y);
        if (d < nearestDistSq) {
          nearest = npc;
          nearestDistSq = d;
        }
      }
      
      // Check well
      if (this.wellInteractable) {
        const d = distSq(this.player.x, this.player.y, this.wellInteractable.x, this.wellInteractable.y);
        if (d < nearestDistSq) {
          nearest = this.wellInteractable;
        }
      }

      if (nearest) {
        this.nearestInteractable = nearest;
        const action = nearest.type === 'npc' ? 'Talk to' : 'Examine';
        this.promptText.setText(`SPACE: ${action} ${nearest.name}`).setVisible(true);
        
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
          this.startDialogue(nearest);
        }
      } else {
        this.promptText.setVisible(false);
      }
    }

    // B for temple shortcut
    if (Phaser.Input.Keyboard.JustDown(this.keys.B)) {
      this.goToTemple();
    }

    // G for asset gallery (dev tool)
    if (Phaser.Input.Keyboard.JustDown(this.keys.G)) {
      this.scene.start('AssetGalleryScene');
    }

    // Depth sort only when player moved (avoids unnecessary sorting when idle)
    if (vx !== 0 || vy !== 0) {
      this.sortDepth();
    }
  }

  sortDepth() {
    // Performance: Reuse cached array to avoid GC allocation every frame
    if (!this._depthList) this._depthList = [];
    const list = this._depthList;
    list.length = 0;
    
    list.push(this.player);
    for (let i = 0; i < this.npcs.length; i++) {
      list.push(this.npcs[i].container);
    }
    
    list.sort((a, b) => a.y - b.y);
    for (let i = 0; i < list.length; i++) {
      list[i].setDepth(50 + i);
    }
  }

  startDialogue(obj) {
    this.inDialogue = true;
    this.currentDialogue = obj.dialogue;
    this.dialogueIndex = 0;
    this.player.body.setVelocity(0);
    this.showDialogueLine();
    this.dialogueBox.setVisible(true);
    this.promptText.setVisible(false);
  }

  showDialogueLine() {
    const line = this.currentDialogue[this.dialogueIndex];
    this.speakerText.setText(line.speaker || '');
    this.speakerText.setColor(line.speaker === 'Alkmaeon' ? '#44aaff' : '#ffcc44');
    this.dialogueText.setText(line.text);
  }

  advanceDialogue() {
    this.dialogueIndex++;
    if (this.dialogueIndex >= this.currentDialogue.length) {
      this.inDialogue = false;
      this.dialogueBox.setVisible(false);
    } else {
      this.showDialogueLine();
    }
  }

  goToTemple() {
    this.player.body.setVelocity(0);
    this.cameras.main.fadeOut(800);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('BattleScene', {
        enemies: [{ id: 'eidolon', name: 'Eidolon', hp: 55, maxHp: 55, attack: 14, defense: 6, exp: 30, gold: 20 }],
        background: 'bg_temple'
      });
    });
  }
}
