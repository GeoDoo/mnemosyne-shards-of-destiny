import { describe, it, expect } from 'vitest';
import { BarrierPresets, createFence, createWall, createGate, createBridge } from '../Barrier.js';

describe('Barrier presets', () => {
  it('has fence preset', () => {
    expect(BarrierPresets.fence).toBeDefined();
    expect(BarrierPresets.fence.type).toBe('fence');
  });

  it('has wall preset', () => {
    expect(BarrierPresets.wall).toBeDefined();
    expect(BarrierPresets.wall.type).toBe('wall');
  });

  it('has gate preset', () => {
    expect(BarrierPresets.gate).toBeDefined();
    expect(BarrierPresets.gate.type).toBe('gate');
  });

  it('has bridge preset', () => {
    expect(BarrierPresets.bridge).toBeDefined();
    expect(BarrierPresets.bridge.type).toBe('bridge');
  });
});

describe('Barrier factory functions', () => {
  it('exports createFence factory', () => {
    expect(typeof createFence).toBe('function');
  });

  it('exports createWall factory', () => {
    expect(typeof createWall).toBe('function');
  });

  it('exports createGate factory', () => {
    expect(typeof createGate).toBe('function');
  });

  it('exports createBridge factory', () => {
    expect(typeof createBridge).toBe('function');
  });
});
