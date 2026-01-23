/**
 * Asset Components - LEGO-style modular game objects
 * 
 * Import individual assets:
 *   import House, { createInn, createShop } from './assets/House.js';
 * 
 * Or import everything:
 *   import { House, HouseColors, createInn, createShop, createSmith, createTemple } from './assets';
 */

export { 
  default as House, 
  HouseColors, 
  BuildingPresets,
  createInn,
  createShop,
  createSmith,
  createTemple
} from './House.js';

// Future exports:
// export { default as Tree } from './Tree.js';
// export { default as Well } from './Well.js';
// export { default as MarketStall } from './MarketStall.js';
// export { default as NPC } from './NPC.js';
