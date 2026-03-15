import type { Vector2 } from "../types";

export const Vec2 = {
  create: (x = 0, y = 0): Vector2 => ({ x, y }),

  add: (v1: Vector2, v2: Vector2): Vector2 => ({
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  }),

  sub: (v1: Vector2, v2: Vector2): Vector2 => ({
    x: v1.x - v2.x,
    y: v1.y - v2.y,
  }),

  mul: (v: Vector2, s: number): Vector2 => ({
    x: v.x * s,
    y: v.y * s,
  }),

  div: (v: Vector2, s: number): Vector2 => ({
    x: v.x / s,
    y: v.y / s,
  }),

  dot: (v1: Vector2, v2: Vector2): number => v1.x * v2.x + v1.y * v2.y,

  magSq: (v: Vector2): number => v.x * v.x + v.y * v.y,

  mag: (v: Vector2): number => Math.sqrt(v.x * v.x + v.y * v.y),

  normalize: (v: Vector2): Vector2 => {
    const m = Math.sqrt(v.x * v.x + v.y * v.y);
    return m > 0 ? { x: v.x / m, y: v.y / m } : { x: 0, y: 0 };
  },

  distSq: (v1: Vector2, v2: Vector2): number => {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return dx * dx + dy * dy;
  },

  dist: (v1: Vector2, v2: Vector2): number => Math.sqrt(Vec2.distSq(v1, v2)),

  copy: (v: Vector2): Vector2 => ({ x: v.x, y: v.y }),
};
