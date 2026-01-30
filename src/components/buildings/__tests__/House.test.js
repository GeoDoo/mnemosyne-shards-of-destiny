import { describe, it, expect } from 'vitest';
import { BuildingPresets, createCottage, createHouse, createVilla } from '../House.js';

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
