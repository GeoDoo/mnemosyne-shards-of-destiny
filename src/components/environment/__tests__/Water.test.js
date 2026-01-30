import { describe, it, expect } from 'vitest';
import { WaterPresets, createFountain, createPond, createStreamEdge } from '../Water.js';

describe('Water presets', () => {
  it('has fountain preset with animated type', () => {
    expect(WaterPresets.fountain).toBeDefined();
    expect(WaterPresets.fountain.type).toBe('fountain');
  });

  it('has pond preset with still water', () => {
    expect(WaterPresets.pond).toBeDefined();
    expect(WaterPresets.pond.type).toBe('pond');
  });

  it('has streamEdge preset for riverbanks', () => {
    expect(WaterPresets.streamEdge).toBeDefined();
    expect(WaterPresets.streamEdge.type).toBe('stream');
  });
});

describe('Water factory functions', () => {
  it('exports createFountain factory', () => {
    expect(typeof createFountain).toBe('function');
  });

  it('exports createPond factory', () => {
    expect(typeof createPond).toBe('function');
  });

  it('exports createStreamEdge factory', () => {
    expect(typeof createStreamEdge).toBe('function');
  });
});
