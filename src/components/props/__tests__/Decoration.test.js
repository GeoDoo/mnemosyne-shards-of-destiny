import { describe, it, expect } from 'vitest';
import { DecorationPresets, createStatue, createColumn, createUrn, createBanner } from '../Decoration.js';

describe('Decoration presets', () => {
  it('has statue preset', () => {
    expect(DecorationPresets.statue).toBeDefined();
    expect(DecorationPresets.statue.type).toBe('statue');
  });

  it('has column preset', () => {
    expect(DecorationPresets.column).toBeDefined();
    expect(DecorationPresets.column.type).toBe('column');
  });

  it('has urn preset', () => {
    expect(DecorationPresets.urn).toBeDefined();
    expect(DecorationPresets.urn.type).toBe('urn');
  });

  it('has banner preset', () => {
    expect(DecorationPresets.banner).toBeDefined();
    expect(DecorationPresets.banner.type).toBe('banner');
  });
});

describe('Decoration factory functions', () => {
  it('exports createStatue factory', () => {
    expect(typeof createStatue).toBe('function');
  });

  it('exports createColumn factory', () => {
    expect(typeof createColumn).toBe('function');
  });

  it('exports createUrn factory', () => {
    expect(typeof createUrn).toBe('function');
  });

  it('exports createBanner factory', () => {
    expect(typeof createBanner).toBe('function');
  });
});
