import { describe, it, expect } from 'vitest';
import { RockPresets, createSmallRock, createMediumRock, createLargeRock } from '../Rock.js';

describe('Rock presets', () => {
  it('has small preset with compact size', () => {
    expect(RockPresets.small).toBeDefined();
    expect(RockPresets.small.width).toBeLessThanOrEqual(30);
  });

  it('has medium preset with moderate size', () => {
    expect(RockPresets.medium).toBeDefined();
    expect(RockPresets.medium.width).toBeGreaterThan(30);
    expect(RockPresets.medium.width).toBeLessThanOrEqual(60);
  });

  it('has large preset as cluster', () => {
    expect(RockPresets.large).toBeDefined();
    expect(RockPresets.large.width).toBeGreaterThan(60);
    expect(RockPresets.large.isCluster).toBe(true);
  });
});

describe('Rock factory functions', () => {
  it('exports createSmallRock factory', () => {
    expect(typeof createSmallRock).toBe('function');
  });

  it('exports createMediumRock factory', () => {
    expect(typeof createMediumRock).toBe('function');
  });

  it('exports createLargeRock factory', () => {
    expect(typeof createLargeRock).toBe('function');
  });
});
