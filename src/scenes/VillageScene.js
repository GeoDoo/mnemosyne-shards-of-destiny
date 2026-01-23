import Phaser from 'phaser';
import House, { HouseColors } from '../assets/House.js';

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
    
    // Well in center
    this.createWell(this.worldWidth/2, this.worldHeight/2);
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

  createWell(x, y) {
    const well = this.add.container(x, y);
    
    // Shadow
    well.add(this.add.ellipse(3, 3, 55, 40, 0x000000, 0.3));
    
    // Stone base - Greek style circular well
    well.add(this.add.circle(0, 0, 30, 0x888888)); // Outer stone
    well.add(this.add.circle(0, 0, 27, 0x999999));
    well.add(this.add.circle(0, 0, 22, 0x777777)); // Inner wall
    well.add(this.add.circle(0, 0, 17, 0x1a2a3a)); // Water (dark)
    well.add(this.add.circle(-4, -4, 5, 0x2a3a4a, 0.4)); // Water reflection
    
    // Stone rim details
    const rimDetails = this.add.graphics();
    rimDetails.lineStyle(2, 0x666666);
    rimDetails.strokeCircle(0, 0, 28);
    well.add(rimDetails);
    
    // Two stone pillars (Greek style)
    well.add(this.add.rectangle(-22, -30, 8, 50, 0xaaaaaa));
    well.add(this.add.rectangle(-22, -30, 6, 48, 0xbbbbbb));
    well.add(this.add.rectangle(22, -30, 8, 50, 0xaaaaaa));
    well.add(this.add.rectangle(22, -30, 6, 48, 0xbbbbbb));
    
    // Pillar capitals
    well.add(this.add.rectangle(-22, -56, 12, 5, 0xcccccc));
    well.add(this.add.rectangle(22, -56, 12, 5, 0xcccccc));
    
    // Cross beam (marble/stone)
    well.add(this.add.rectangle(0, -60, 55, 6, 0xdddddd));
    well.add(this.add.rectangle(0, -60, 52, 4, 0xeeeeee));
    
    // Bronze/terracotta pulley wheel
    well.add(this.add.circle(0, -60, 8, 0x8b6b4a));
    well.add(this.add.circle(0, -60, 5, 0x9b7b5a));
    
    // Rope
    well.add(this.add.rectangle(0, -40, 2, 35, 0x8b7355));
    
    // Amphora-style bucket (Greek)
    const bucket = this.add.graphics();
    bucket.fillStyle(0xb86b4a); // Terracotta
    bucket.fillEllipse(0, -18, 10, 14);
    bucket.fillStyle(0xa05a3a);
    bucket.fillRect(-1, -26, 2, 6); // Handle
    well.add(bucket);
    
    // Collision
    const collider = this.add.circle(x, y, 35, 0x000000, 0);
    this.physics.add.existing(collider, true);
    this.buildings.add(collider);
    
    this.wellInteractable = { x, y, name: 'Well', type: 'examine', dialogue: [
      { speaker: '', text: 'A stone well built in the traditional Greek style.' },
      { speaker: '', text: 'The cool water comes from deep underground springs.' }
    ]};
  }

  createTrees() {
    // Store tree colliders in array for manual collision
    this.treeColliders = [];
    
    const treePositions = [
      [100, 400], [100, 1000], [100, 1300],
      [1900, 400], [1900, 1000], [1900, 1300],
      [500, 100], [800, 150], [1200, 150], [1500, 100],
      [400, 1400], [700, 1350], [1300, 1350], [1600, 1400],
    ];
    
    treePositions.forEach(([x, y]) => this.createTree(x, y));
  }

  createTree(x, y) {
    // Shadow
    this.add.ellipse(x + 4, y + 30, 40, 16, 0x000000, 0.3);
    
    // Trunk
    this.add.rectangle(x, y + 18, 14, 40, 0x5c4033);
    this.add.rectangle(x, y + 18, 10, 36, 0x6b4c38);
    
    // Foliage - layered for depth
    this.add.circle(x - 12, y - 15, 22, 0x2d5a27);
    this.add.circle(x + 12, y - 15, 22, 0x2d5a27);
    this.add.circle(x, y - 25, 26, 0x3a6b32);
    this.add.circle(x - 8, y - 20, 18, 0x4a8a4a);
    this.add.circle(x + 8, y - 22, 20, 0x4a8a4a);
    this.add.circle(x, y - 32, 18, 0x5a9a5a);
    
    // Collision - create static body directly
    const collider = this.add.rectangle(x, y + 15, 30, 50, 0x000000, 0);
    this.physics.add.existing(collider, true);
    this.treeColliders.push(collider);
  }

  createMarket() {
    this.marketItems = this.physics.add.staticGroup();
    
    // Market stalls on the right side of square
    this.createMarketStall(this.worldWidth/2 + 250, this.worldHeight/2 - 80, 'Fruit Stand');
    this.createMarketStall(this.worldWidth/2 + 250, this.worldHeight/2 + 80, 'Pottery');
    
    // Crates and barrels
    this.createCrate(this.worldWidth/2 - 280, this.worldHeight/2 - 100);
    this.createCrate(this.worldWidth/2 - 250, this.worldHeight/2 - 80);
    this.createBarrel(this.worldWidth/2 - 300, this.worldHeight/2 + 50);
    this.createBarrel(this.worldWidth/2 - 270, this.worldHeight/2 + 80);
  }

  createMarketStall(x, y, name) {
    const stall = this.add.container(x, y);
    
    // Shadow
    stall.add(this.add.ellipse(3, 25, 90, 30, 0x000000, 0.25));
    
    // Wooden table/counter
    stall.add(this.add.rectangle(-35, 18, 5, 22, 0x6b4c38));
    stall.add(this.add.rectangle(35, 18, 5, 22, 0x6b4c38));
    stall.add(this.add.rectangle(0, 5, 80, 10, 0x7b5c48));
    stall.add(this.add.rectangle(0, 3, 76, 6, 0x8b6c58));
    
    // Wooden poles for awning
    stall.add(this.add.rectangle(-38, -18, 4, 48, 0x6b4c38));
    stall.add(this.add.rectangle(38, -18, 4, 48, 0x6b4c38));
    
    // Linen awning (draped fabric - Greek style)
    const awningColor = name === 'Fruit Stand' ? 0xcc8855 : 0x7788aa;
    // Simple rectangular awning with slight drape effect
    stall.add(this.add.rectangle(0, -40, 95, 16, awningColor));
    stall.add(this.add.rectangle(0, -38, 90, 12, awningColor + 0x111111));
    // Drape shadows at edges
    stall.add(this.add.rectangle(-40, -34, 12, 4, awningColor - 0x222222));
    stall.add(this.add.rectangle(40, -34, 12, 4, awningColor - 0x222222));
    // Center drape
    stall.add(this.add.rectangle(0, -32, 30, 6, awningColor - 0x111111));
    
    // Items on table
    if (name === 'Fruit Stand') {
      // Pomegranates (Greek!)
      stall.add(this.add.circle(-28, -3, 5, 0xaa2233));
      stall.add(this.add.circle(-20, -2, 5, 0xbb3344));
      // Figs
      stall.add(this.add.ellipse(-8, -3, 4, 5, 0x553366));
      stall.add(this.add.ellipse(-2, -2, 4, 5, 0x664477));
      // Grapes
      stall.add(this.add.circle(10, -3, 3, 0x443366));
      stall.add(this.add.circle(13, -1, 3, 0x443366));
      stall.add(this.add.circle(16, -3, 3, 0x443366));
      stall.add(this.add.circle(12, -5, 3, 0x554477));
      // Olives in bowl
      stall.add(this.add.ellipse(28, -2, 10, 6, 0xaa9988));
      stall.add(this.add.circle(26, -4, 2, 0x334422));
      stall.add(this.add.circle(30, -4, 2, 0x334422));
    } else {
      // Greek amphorae and pottery
      stall.add(this.add.ellipse(-25, -8, 8, 14, 0xb86b4a));
      stall.add(this.add.ellipse(-25, -16, 5, 3, 0xa05a3a));
      stall.add(this.add.rectangle(-25, -20, 2, 6, 0xa05a3a)); // Handle
      
      stall.add(this.add.ellipse(0, -6, 7, 12, 0xc97a55));
      stall.add(this.add.ellipse(0, -13, 4, 2, 0xb86b4a));
      
      stall.add(this.add.ellipse(22, -10, 10, 16, 0xb86b4a));
      stall.add(this.add.ellipse(22, -20, 6, 3, 0xa05a3a));
      // Decorative band
      stall.add(this.add.rectangle(22, -8, 16, 3, 0x222222));
    }
    
    // Collision
    const collider = this.add.rectangle(x, y, 90, 55, 0x000000, 0);
    this.physics.add.existing(collider, true);
    this.marketItems.add(collider);
    
    // Interactable
    stall.interactable = { x, y, name, type: 'examine', dialogue: [
      { speaker: '', text: name === 'Fruit Stand' 
        ? 'Fresh pomegranates, figs, grapes, and olives. The bounty of Greece.' 
        : 'Traditional amphorae and pottery, crafted by local artisans.' }
    ]};
    this.interactables = this.interactables || [];
    this.interactables.push(stall.interactable);
  }

  createCrate(x, y) {
    const crate = this.add.container(x, y);
    // Shadow
    crate.add(this.add.rectangle(2, 2, 22, 22, 0x000000, 0.3));
    // Main crate
    crate.add(this.add.rectangle(0, 0, 22, 22, 0x8b6914));
    crate.add(this.add.rectangle(0, 0, 18, 18, 0x9b7924));
    // Wood planks
    crate.add(this.add.rectangle(0, -6, 18, 2, 0x7b5914));
    crate.add(this.add.rectangle(0, 6, 18, 2, 0x7b5914));
    crate.add(this.add.rectangle(-6, 0, 2, 18, 0x7b5914));
    crate.add(this.add.rectangle(6, 0, 2, 18, 0x7b5914));
    
    const collider = this.add.rectangle(x, y, 26, 26, 0x000000, 0);
    this.physics.add.existing(collider, true);
    this.marketItems.add(collider);
  }

  createBarrel(x, y) {
    const barrel = this.add.container(x, y);
    // Shadow
    barrel.add(this.add.ellipse(2, 3, 22, 10, 0x000000, 0.3));
    // Main barrel body
    barrel.add(this.add.ellipse(0, 0, 20, 28, 0x6b4c38));
    barrel.add(this.add.ellipse(0, 0, 18, 26, 0x7b5c48));
    // Top
    barrel.add(this.add.ellipse(0, -10, 18, 8, 0x5c4033));
    barrel.add(this.add.ellipse(0, -10, 14, 5, 0x4a3525));
    // Metal bands
    barrel.add(this.add.ellipse(0, -4, 20, 8, 0x444444, 0).setStrokeStyle(2, 0x555555));
    barrel.add(this.add.ellipse(0, 6, 20, 8, 0x444444, 0).setStrokeStyle(2, 0x555555));
    
    const collider = this.add.circle(x, y, 14, 0x000000, 0);
    this.physics.add.existing(collider, true);
    this.marketItems.add(collider);
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
    this.createNPC(this.worldWidth/2 - 100, this.worldHeight/2 + 100, 'Epimenides', 'elder',
      this.dialogueData.npcs?.epimenides?.dialogue || [{ speaker: 'Epimenides', text: 'Welcome, traveler.' }]
    );
    
    // Merchant - at fruit stand
    this.createNPC(this.worldWidth/2 + 180, this.worldHeight/2 - 80, 'Merchant', 'merchant',
      this.dialogueData.npcs?.merchant?.dialogue || [{ speaker: 'Merchant', text: 'Fine goods for sale!' }]
    );
  }

  createNPC(x, y, name, type, dialogue) {
    const npc = this.add.container(x, y);
    
    // Shadow
    npc.add(this.add.ellipse(0, 18, 18, 7, 0x000000, 0.4));
    
    if (type === 'elder') {
      // Greek himation (cloak/robe) - draped style
      npc.add(this.add.rectangle(0, 6, 18, 28, 0xddd8c8)); // Off-white robe
      npc.add(this.add.rectangle(0, 6, 16, 26, 0xe8e4d8));
      // Draped fold detail
      npc.add(this.add.rectangle(-4, 6, 3, 24, 0xccc8b8));
      npc.add(this.add.rectangle(5, 10, 2, 16, 0xccc8b8));
      // Purple trim (sign of wisdom/status)
      npc.add(this.add.rectangle(0, -6, 16, 2, 0x663366));
      
      // Bare arms (Greek elders)
      npc.add(this.add.rectangle(-10, 4, 3, 10, 0xccb8a0));
      
      // Head
      npc.add(this.add.circle(0, -12, 8, 0xccb8a0)); // Weathered skin
      
      // White beard (long, Greek philosopher style)
      npc.add(this.add.ellipse(0, -4, 12, 12, 0xcccccc));
      npc.add(this.add.ellipse(0, 2, 10, 8, 0xdddddd));
      npc.add(this.add.ellipse(0, 8, 6, 6, 0xcccccc)); // Beard tip
      
      // Balding with white hair on sides
      npc.add(this.add.ellipse(-6, -14, 4, 5, 0xbbbbbb));
      npc.add(this.add.ellipse(6, -14, 4, 5, 0xbbbbbb));
      
      // Wise eyes
      npc.add(this.add.circle(-3, -13, 1.5, 0x334455));
      npc.add(this.add.circle(3, -13, 1.5, 0x334455));
      
      // Laurel wreath hint
      npc.add(this.add.ellipse(0, -18, 10, 3, 0x556633));
      
    } else {
      // Greek merchant - simple chiton
      npc.add(this.add.rectangle(0, 6, 14, 24, 0xc4a882)); // Brown/tan chiton
      npc.add(this.add.rectangle(0, 6, 12, 22, 0xd4b892));
      // Leather belt
      npc.add(this.add.rectangle(0, 0, 14, 3, 0x6b4c38));
      
      // Arms
      npc.add(this.add.rectangle(-8, 3, 3, 12, 0xddb896));
      npc.add(this.add.rectangle(8, 3, 3, 12, 0xddb896));
      
      // Head
      npc.add(this.add.circle(0, -10, 7, 0xddb896));
      
      // Dark curly Greek hair
      npc.add(this.add.ellipse(0, -16, 10, 6, 0x2a1a0a));
      npc.add(this.add.circle(-4, -12, 3, 0x2a1a0a));
      npc.add(this.add.circle(4, -12, 3, 0x2a1a0a));
      npc.add(this.add.circle(-2, -17, 2, 0x2a1a0a));
      npc.add(this.add.circle(2, -17, 2, 0x2a1a0a));
      
      // Short beard
      npc.add(this.add.ellipse(0, -4, 8, 6, 0x3a2a1a));
      
      // Eyes
      npc.add(this.add.circle(-2, -10, 1.5, 0x443322));
      npc.add(this.add.circle(2, -10, 1.5, 0x443322));
    }
    
    npc.setScale(1.3);
    
    // Physics
    this.physics.add.existing(npc);
    npc.body.setImmovable(true);
    npc.body.setSize(24, 38);
    
    this.npcs.push({
      container: npc,
      x, y, name, dialogue,
      type: 'npc'
    });
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

    // Depth sort NPCs and player
    this.sortDepth();
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
