import { describe, it, expect } from 'vitest';
import { TreePresets, createCypress, createOlive, createOak, createDeadTree } from '../Tree.js';

describe('Tree presets', () => {
  it('has cypress preset with tall foliage style', () => {
    expect(TreePresets.cypress).toBeDefined();
    expect(TreePresets.cypress.foliageStyle).toBe('tall');
  });

  it('has olive preset with wide foliage style', () => {
    expect(TreePresets.olive).toBeDefined();
    expect(TreePresets.olive.foliageStyle).toBe('wide');
  });

  it('has oak preset with round foliage style', () => {
    expect(TreePresets.oak).toBeDefined();
    expect(TreePresets.oak.foliageStyle).toBe('round');
  });

  it('has dead preset with bare foliage style', () => {
    expect(TreePresets.dead).toBeDefined();
    expect(TreePresets.dead.foliageStyle).toBe('bare');
  });
});

describe('Tree factory functions', () => {
  it('exports createCypress factory', () => {
    expect(typeof createCypress).toBe('function');
  });

  it('exports createOlive factory', () => {
    expect(typeof createOlive).toBe('function');
  });

  it('exports createOak factory', () => {
    expect(typeof createOak).toBe('function');
  });

  it('exports createDeadTree factory', () => {
    expect(typeof createDeadTree).toBe('function');
  });
});
