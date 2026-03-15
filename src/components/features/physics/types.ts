/**
 * ══════════════════════════════════════════════
 *  PHYSICS TYPES & INTERFACES
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Defines the standard interfaces for physics bodies and engines.
 * Ensures compatibility between different engine implementations.
 */
export interface Vector2 {
  x: number;
  y: number;
}

export interface BodyOptions {
  frictionAir?: number;
  restitution?: number;
  isStatic?: boolean;
  label?: string;
  collisionFilter?: {
    category?: number;
    mask?: number;
  };
  plugin?: any;
}

export interface PhysicsBody {
  id: any;
  position: Vector2;
  angle: number;
  velocity: Vector2;
  circleRadius?: number;
  label: string;
  plugin: any;
  mass: number;
  inverseMass: number;
}

export interface PhysicsEngine {
  setSize(width: number, height: number): void;
  init(width: number, height: number, config: any): void;
  update(delta: number): void;
  addCircle(x: number, y: number, radius: number, options?: BodyOptions): PhysicsBody;
  addRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    options?: BodyOptions
  ): PhysicsBody;
  removeBody(body: PhysicsBody): void;
  applyForce(body: PhysicsBody, position: Vector2, force: Vector2): void;
  setPosition(body: PhysicsBody, position: Vector2): void;
  setVelocity(body: PhysicsBody, velocity: Vector2): void;
  setVertices(body: PhysicsBody, vertices: Vector2[]): void; // Needed for wall resizing
  getBodies(): PhysicsBody[];
  pause(): void;
  resume(): void;
  destroy(): void;

  // Interactions
  setMousePosition(pos: Vector2): void;
  queryPoint(pos: Vector2): PhysicsBody[];
  grabBody(pos: Vector2): PhysicsBody | null;
  releaseBody(): void;

  // Events
  onBeforeUpdate(callback: (timestamp: number) => void): void;
}
