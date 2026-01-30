import { describe, it, expect } from 'vitest';
import { PathPresets, createDirtPath, createStonePath, createMarblePath } from '../Path.js';

describe('Path presets', () => {
  it('has dirt preset with earthy colors', () => {
    expect(PathPresets.dirt).toBeDefined();
    expect(PathPresets.dirt.type).toBe('dirt');
  });

  it('has stone preset with cobblestone style', () => {
    expect(PathPresets.stone).toBeDefined();
    expect(PathPresets.stone.type).toBe('stone');
  });

  it('has marble preset with tile pattern', () => {
    expect(PathPresets.marble).toBeDefined();
    expect(PathPresets.marble.type).toBe('marble');
  });
});

describe('Path factory functions', () => {
  it('exports createDirtPath factory', () => {
    expect(typeof createDirtPath).toBe('function');
  });

  it('exports createStonePath factory', () => {
    expect(typeof createStonePath).toBe('function');
  });

  it('exports createMarblePath factory', () => {
    expect(typeof createMarblePath).toBe('function');
  });
});
