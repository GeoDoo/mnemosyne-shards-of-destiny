import { describe, it, expect } from 'vitest';
import { StoragePresets, createBarrel, createCrate, createChest, createSack } from '../Storage.js';

describe('Storage presets', () => {
  it('has barrel preset', () => {
    expect(StoragePresets.barrel).toBeDefined();
    expect(StoragePresets.barrel.type).toBe('barrel');
  });

  it('has crate preset', () => {
    expect(StoragePresets.crate).toBeDefined();
    expect(StoragePresets.crate.type).toBe('crate');
  });

  it('has chest preset', () => {
    expect(StoragePresets.chest).toBeDefined();
    expect(StoragePresets.chest.type).toBe('chest');
  });

  it('has sack preset', () => {
    expect(StoragePresets.sack).toBeDefined();
    expect(StoragePresets.sack.type).toBe('sack');
  });
});

describe('Storage factory functions', () => {
  it('exports createBarrel factory', () => {
    expect(typeof createBarrel).toBe('function');
  });

  it('exports createCrate factory', () => {
    expect(typeof createCrate).toBe('function');
  });

  it('exports createChest factory', () => {
    expect(typeof createChest).toBe('function');
  });

  it('exports createSack factory', () => {
    expect(typeof createSack).toBe('function');
  });
});
