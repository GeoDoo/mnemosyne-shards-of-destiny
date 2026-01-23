/**
 * Master export for all LEGO-style modular components
 * 
 * Usage:
 *   import { House, Tree, NPC, Crate, Barrel } from '../components';
 */

// Base
export { default as Component } from './_base/Component.js';

// Buildings
export { 
  House, 
  HouseColors, 
  BuildingPresets, 
  createInn, 
  createShop, 
  createSmith, 
  createTemple 
} from './buildings/index.js';

// Environment
export { 
  Tree, 
  TreePresets, 
  createCypress, 
  createOlive, 
  createOak, 
  createDeadTree 
} from './environment/index.js';

// Entities
export { 
  NPC, 
  NPCPresets, 
  createElder, 
  createMerchant, 
  createGuard, 
  createVillager, 
  createPriestess 
} from './entities/index.js';

// Props
export {
  Crate,
  Barrel,
  MarketStall,
  StallPresets,
  createFruitStall,
  createPotteryStall
} from './props/index.js';
