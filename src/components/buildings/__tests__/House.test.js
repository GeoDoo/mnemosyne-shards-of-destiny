import { describe, it, expect } from 'vitest';
import { BuildingPresets, createCottage, createHouse, createVilla, createBarracks, createGuardPost, createOracle, createMarketStall, createVendorCart } from '../House.js';

describe('Home variant presets', () => {
  it('has cottage preset with small dimensions', () => {
    expect(BuildingPresets.cottage).toBeDefined();
    expect(BuildingPresets.cottage.width).toBeLessThanOrEqual(150);
    expect(BuildingPresets.cottage.height).toBeLessThanOrEqual(110);
    expect(BuildingPresets.cottage.buildingType).toBe('home');
  });

  it('has house preset with medium dimensions', () => {
    expect(BuildingPresets.house).toBeDefined();
    expect(BuildingPresets.house.width).toBeGreaterThan(150);
    expect(BuildingPresets.house.width).toBeLessThanOrEqual(200);
    expect(BuildingPresets.house.buildingType).toBe('home');
  });

  it('has villa preset with large dimensions', () => {
    expect(BuildingPresets.villa).toBeDefined();
    expect(BuildingPresets.villa.width).toBeGreaterThan(200);
    expect(BuildingPresets.villa.buildingType).toBe('home');
  });
});

describe('Home variant factory functions', () => {
  it('exports createCottage factory', () => {
    expect(typeof createCottage).toBe('function');
  });

  it('exports createHouse factory', () => {
    expect(typeof createHouse).toBe('function');
  });

  it('exports createVilla factory', () => {
    expect(typeof createVilla).toBe('function');
  });
});

describe('Civic building presets', () => {
  it('has barracks preset with military buildingType', () => {
    expect(BuildingPresets.barracks).toBeDefined();
    expect(BuildingPresets.barracks.buildingType).toBe('civic');
    expect(BuildingPresets.barracks.width).toBeGreaterThanOrEqual(200);
  });

  it('has guardPost preset with compact dimensions', () => {
    expect(BuildingPresets.guardPost).toBeDefined();
    expect(BuildingPresets.guardPost.buildingType).toBe('civic');
    expect(BuildingPresets.guardPost.width).toBeLessThanOrEqual(160);
  });

  it('has oracle preset with sacred styling', () => {
    expect(BuildingPresets.oracle).toBeDefined();
    expect(BuildingPresets.oracle.buildingType).toBe('civic');
  });
});

describe('Civic building factory functions', () => {
  it('exports createBarracks factory', () => {
    expect(typeof createBarracks).toBe('function');
  });

  it('exports createGuardPost factory', () => {
    expect(typeof createGuardPost).toBe('function');
  });

  it('exports createOracle factory', () => {
    expect(typeof createOracle).toBe('function');
  });
});

describe('Market presets', () => {
  it('has marketStall preset with market buildingType', () => {
    expect(BuildingPresets.marketStall).toBeDefined();
    expect(BuildingPresets.marketStall.buildingType).toBe('market');
    expect(BuildingPresets.marketStall.width).toBeLessThanOrEqual(160);
  });

  it('has vendorCart preset with compact dimensions', () => {
    expect(BuildingPresets.vendorCart).toBeDefined();
    expect(BuildingPresets.vendorCart.buildingType).toBe('market');
    expect(BuildingPresets.vendorCart.width).toBeLessThanOrEqual(120);
  });
});

describe('Market factory functions', () => {
  it('exports createMarketStall factory', () => {
    expect(typeof createMarketStall).toBe('function');
  });

  it('exports createVendorCart factory', () => {
    expect(typeof createVendorCart).toBe('function');
  });
});
