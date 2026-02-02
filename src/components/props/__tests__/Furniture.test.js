import { describe, it, expect } from 'vitest';
import { FurniturePresets, createBench, createTable, createChair, createBed } from '../Furniture.js';

describe('Furniture presets', () => {
  it('has bench preset', () => {
    expect(FurniturePresets.bench).toBeDefined();
    expect(FurniturePresets.bench.type).toBe('bench');
  });

  it('has table preset', () => {
    expect(FurniturePresets.table).toBeDefined();
    expect(FurniturePresets.table.type).toBe('table');
  });

  it('has chair preset', () => {
    expect(FurniturePresets.chair).toBeDefined();
    expect(FurniturePresets.chair.type).toBe('chair');
  });

  it('has bed preset', () => {
    expect(FurniturePresets.bed).toBeDefined();
    expect(FurniturePresets.bed.type).toBe('bed');
  });
});

describe('Furniture factory functions', () => {
  it('exports createBench factory', () => {
    expect(typeof createBench).toBe('function');
  });

  it('exports createTable factory', () => {
    expect(typeof createTable).toBe('function');
  });

  it('exports createChair factory', () => {
    expect(typeof createChair).toBe('function');
  });

  it('exports createBed factory', () => {
    expect(typeof createBed).toBe('function');
  });
});
