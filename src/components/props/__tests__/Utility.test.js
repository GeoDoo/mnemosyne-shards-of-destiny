import { describe, it, expect } from 'vitest';
import { UtilityPresets, createCampfire, createCookingPot, createWeaponRack, createLadder } from '../Utility.js';

describe('Utility presets', () => {
  it('has campfire preset', () => {
    expect(UtilityPresets.campfire).toBeDefined();
    expect(UtilityPresets.campfire.type).toBe('campfire');
  });

  it('has cookingPot preset', () => {
    expect(UtilityPresets.cookingPot).toBeDefined();
    expect(UtilityPresets.cookingPot.type).toBe('cookingPot');
  });

  it('has weaponRack preset', () => {
    expect(UtilityPresets.weaponRack).toBeDefined();
    expect(UtilityPresets.weaponRack.type).toBe('weaponRack');
  });

  it('has ladder preset', () => {
    expect(UtilityPresets.ladder).toBeDefined();
    expect(UtilityPresets.ladder.type).toBe('ladder');
  });
});

describe('Utility factory functions', () => {
  it('exports createCampfire factory', () => {
    expect(typeof createCampfire).toBe('function');
  });

  it('exports createCookingPot factory', () => {
    expect(typeof createCookingPot).toBe('function');
  });

  it('exports createWeaponRack factory', () => {
    expect(typeof createWeaponRack).toBe('function');
  });

  it('exports createLadder factory', () => {
    expect(typeof createLadder).toBe('function');
  });
});
