/**
 * ══════════════════════════════════════════════
 *  CUSTOM PHYSICS ENGINE
 * ══════════════════════════════════════════════
 *
 * PURPOSE: A lightweight Verlet-based physics solver optimized for UI elements.
 * Supports mass-based collisions, torque, and bounciness.
 *
 * CRITICAL RULES:
 * - Uses Position-based Dynamics (PBD) via Verlet Integration.
 * - Velocity is derived (Pos - PrevPos), not stored as primary state.
 */
import type { PhysicsEngine, PhysicsBody, BodyOptions, Vector2 } from "../types";
import { Vec2 } from "./Vector2";

class CustomBody implements PhysicsBody {
  id: number;
  position: Vector2;
  prevPosition: Vector2;
  acceleration: Vector2;
  velocity: Vector2; // Derived or explicit
  angle: number = 0;
  prevAngle: number = 0;
  angularVelocity: number = 0;
  angularAcceleration: number = 0;
  config: any;
  circleRadius?: number;
  width?: number;
  height?: number;

  isStatic: boolean;
  frictionAir: number;
  restitution: number;
  label: string;
  plugin: any;
  collisionFilter: { category: number; mask: number };
  mass: number;
  inverseMass: number;

  constructor(
    id: number,
    x: number,
    y: number,
    options: BodyOptions = {},
    config: any,
    dimensions?: { radius?: number; width?: number; height?: number }
  ) {
    this.id = id;
    this.config = config;
    this.circleRadius = dimensions?.radius;
    this.width = dimensions?.width;
    this.height = dimensions?.height;
    this.position = Vec2.create(x, y);
    this.prevPosition = Vec2.create(x, y);
    this.acceleration = Vec2.create(0, 0);
    this.velocity = Vec2.create(0, 0);
    this.angularAcceleration = 0;

    this.isStatic = options.isStatic ?? false;
    this.frictionAir = options.frictionAir ?? this.config.simulation.frictionAir;
    this.restitution = options.restitution ?? this.config.simulation.restitution;
    this.label = options.label ?? "body";
    this.plugin = options.plugin ?? {};
    this.collisionFilter = {
      category: options.collisionFilter?.category ?? 0x0001,
      mask: options.collisionFilter?.mask ?? 0xffff,
    };

    // Calculate Mass
    if (this.isStatic) {
      this.mass = Infinity;
      this.inverseMass = 0;
    } else {
      // Base mass on area, normalized so a radius 50 circle is approx mass 1
      const area = this.circleRadius
        ? Math.PI * this.circleRadius * this.circleRadius
        : (this.width || 1) * (this.height || 1);

      this.mass = (area / 7850) * (this.config.simulation.massDensity || 1.0);
      this.inverseMass = 1 / this.mass;
    }
  }

  update(dt: number) {
    if (this.isStatic) return;

    // Verlet Integration
    const velocity = Vec2.sub(this.position, this.prevPosition);
    // Apply friction
    const friction = 1 - this.frictionAir;
    const nextVelocity = Vec2.add(
      Vec2.mul(velocity, friction),
      Vec2.mul(this.acceleration, dt * dt)
    );

    this.prevPosition = Vec2.copy(this.position);
    this.position = Vec2.add(this.position, nextVelocity);

    // Derived velocity for API compatibility
    this.velocity = Vec2.div(nextVelocity, dt);

    // Reset acceleration
    this.acceleration = Vec2.create(0, 0);

    // Rotation Integration (Verlet-style with proper Torque integration)
    const angularFriction = this.config.rotation.airFriction;
    let nextAngleVel =
      (this.angle - this.prevAngle) * angularFriction + this.angularAcceleration * dt * dt;

    // Cap rotation speed
    const maxRot = this.config.rotation.maxAngularVelocity;
    nextAngleVel = Math.max(-maxRot, Math.min(maxRot, nextAngleVel));

    this.prevAngle = this.angle;
    this.angle += nextAngleVel;

    // Reset acceleration
    this.angularAcceleration = 0;
  }
}

export class CustomPhysicsEngine implements PhysicsEngine {
  private bodies: CustomBody[] = [];
  private nextId = 0;
  private width = 0;
  private height = 0;
  private beforeUpdateCallbacks: ((timestamp: number) => void)[] = [];
  private lastUpdate = 0;
  private isRunning = false;

  private config: any;

  private mousePos = Vec2.create(0, 0);
  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  init(width: number, height: number, config: any): void {
    this.width = width;
    this.height = height;
    this.config = config;
    this.lastUpdate = performance.now();
    this.isRunning = true;
    this.runLoop();
  }

  private runLoop = () => {
    if (!this.isRunning) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastUpdate) / 1000, 0.032); // Cap dt to 2 frames
    this.lastUpdate = now;

    this.update(dt);
    requestAnimationFrame(this.runLoop);
  };

  update(dt: number): void {
    const timestamp = performance.now();
    this.beforeUpdateCallbacks.forEach((cb) => cb(timestamp));

    // 1. Integration
    for (const body of this.bodies) {
      if (body === this.grabbedBody) {
        const targetPos = Vec2.add(this.mousePos, this.mouseOffset);

        // Clamp grabbed body to world bounds to prevent clipping
        const r = body.circleRadius || 0;
        const clampedX = Math.max(r, Math.min(this.width - r, targetPos.x));
        const clampedY = Math.max(r, Math.min(this.height - r, targetPos.y));

        body.prevPosition = Vec2.copy(body.position);
        body.position = { x: clampedX, y: clampedY };
      } else {
        body.update(dt);
      }
    }

    // 2. Collision Resolution (Iterative for stability)
    const iterations = this.config.simulation.substeps;
    for (let i = 0; i < iterations; i++) {
      this.resolveCollisions();
    }
  }

  private resolveCollisions() {
    for (let i = 0; i < this.bodies.length; i++) {
      const b1 = this.bodies[i];

      // World Bounds Fallback (Global Clamp)
      this.resolveWorldBounds(b1);

      // Circle vs Wall (Rectangles)
      if (b1.circleRadius) {
        // Check against every other body
        for (let j = 0; j < this.bodies.length; j++) {
          if (i === j) continue;
          const b2 = this.bodies[j];

          if (b2.isStatic && b2.width && b2.height) {
            this.resolveCircleRect(b1, b2);
          }
        }
      }

      // Circle vs Circle
      for (let j = i + 1; j < this.bodies.length; j++) {
        const b2 = this.bodies[j];

        if (
          !(b1.collisionFilter.mask & b2.collisionFilter.category) ||
          !(b2.collisionFilter.mask & b1.collisionFilter.category)
        ) {
          continue;
        }

        if (b1.circleRadius && b2.circleRadius) {
          this.resolveCircleCircle(b1, b2);
        }
      }
    }
  }

  private resolveWorldBounds(b: CustomBody) {
    if (b.isStatic || b === this.grabbedBody) return;
    const r = b.circleRadius || 0;
    const e = this.config.simulation.restitution;

    // Left/Right
    if (b.position.x < r) {
      b.position.x = r;
      const vx = b.position.x - b.prevPosition.x;
      if (vx < 0) b.prevPosition.x = b.position.x + vx * e;
    } else if (b.position.x > this.width - r) {
      b.position.x = this.width - r;
      const vx = b.position.x - b.prevPosition.x;
      if (vx > 0) b.prevPosition.x = b.position.x + vx * e;
    }

    // Top/Bottom
    if (b.position.y < r) {
      b.position.y = r;
      const vy = b.position.y - b.prevPosition.y;
      if (vy < 0) b.prevPosition.y = b.position.y + vy * e;
    } else if (b.position.y > this.height - r) {
      b.position.y = this.height - r;
      const vy = b.position.y - b.prevPosition.y;
      if (vy > 0) b.prevPosition.y = b.position.y + vy * e;
    }
  }

  private resolveCircleWall(b: CustomBody) {
    // Wall resolution is now handled by static rectangle bodies added in index.ts
    // This allows for better synchronization with the visual container.
  }

  private resolveCircleCircle(b1: CustomBody, b2: CustomBody) {
    const distSq = Vec2.distSq(b1.position, b2.position);
    const r1 = b1.circleRadius || 0;
    const r2 = b2.circleRadius || 0;
    const minDist = r1 + r2;

    if (distSq < minDist * minDist) {
      const dist = Math.sqrt(distSq);
      const overlap = minDist - dist;
      const normal = dist > 0 ? Vec2.div(Vec2.sub(b2.position, b1.position), dist) : { x: 1, y: 0 };

      const totalInverseMass = b1.inverseMass + b2.inverseMass;
      if (totalInverseMass === 0) return;

      const impulse = overlap / totalInverseMass;
      const move1 = Vec2.mul(normal, impulse * b1.inverseMass);
      const move2 = Vec2.mul(normal, impulse * b2.inverseMass);

      if (!b1.isStatic) b1.position = Vec2.sub(b1.position, move1);
      if (!b2.isStatic) b2.position = Vec2.add(b2.position, move2);

      // Simple rotation response to collision (tangential friction)
      const relativeVelocity = Vec2.sub(
        Vec2.sub(b2.position, b2.prevPosition),
        Vec2.sub(b1.position, b1.prevPosition)
      );
      const tangent = { x: -normal.y, y: normal.x };
      const tangentVel = Vec2.dot(relativeVelocity, tangent);

      const frictionImpact = this.config.rotation.impactFriction;

      // Calculate angular change based on radius (larger = less spin)
      const rot1 = (tangentVel / (r1 || 1)) * frictionImpact;
      const rot2 = (tangentVel / (r2 || 1)) * frictionImpact;

      b1.angle += rot1;
      b2.angle -= rot2;
    }
  }

  private resolveCircleRect(circle: CustomBody, rect: CustomBody) {
    if (!rect.width || !rect.height) return;

    // Find closest point on rect to circle center
    const cx = circle.position.x;
    const cy = circle.position.y;
    const rx = rect.position.x - rect.width / 2;
    const ry = rect.position.y - rect.height / 2;

    const closestX = Math.max(rx, Math.min(cx, rx + rect.width));
    const closestY = Math.max(ry, Math.min(cy, ry + rect.height));

    const distSq = Vec2.distSq(circle.position, { x: closestX, y: closestY });
    const r = circle.circleRadius || 0;

    if (distSq < r * r) {
      const dist = Math.sqrt(distSq);
      const overlap = r - dist;
      const normal =
        dist > 0
          ? Vec2.div(Vec2.sub(circle.position, { x: closestX, y: closestY }), dist)
          : { x: 0, y: -1 };

      circle.position = Vec2.add(circle.position, Vec2.mul(normal, overlap));

      // Bounce
      const dot = Vec2.dot(Vec2.sub(circle.position, circle.prevPosition), normal);
      if (dot < 0) {
        const reflect = Vec2.mul(normal, dot * (1 + circle.restitution));
        circle.prevPosition = Vec2.add(circle.prevPosition, reflect);
      }
    }
  }

  addCircle(x: number, y: number, radius: number, options?: BodyOptions): PhysicsBody {
    const body = new CustomBody(this.nextId++, x, y, options, this.config, { radius });
    this.bodies.push(body);
    return body;
  }

  addRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    options?: BodyOptions
  ): PhysicsBody {
    const body = new CustomBody(this.nextId++, x, y, options, this.config, { width, height });
    this.bodies.push(body);
    return body;
  }

  removeBody(body: PhysicsBody): void {
    this.bodies = this.bodies.filter((b) => b.id !== body.id);
  }

  applyForce(body: PhysicsBody, position: Vector2, force: Vector2): void {
    const b = body as CustomBody;
    if (b.isStatic) return;

    const forceScale = this.config.simulation.forceScale;
    const scaledForce = Vec2.mul(force, forceScale);

    // 1. Linear Acceleration (F = ma => a = F/m)
    b.acceleration = Vec2.add(b.acceleration, Vec2.mul(scaledForce, b.inverseMass));

    // 2. Torque (τ = r × F)
    // Vector from center to impact point
    const r = Vec2.sub(position, b.position);
    const crossProduct = r.x * scaledForce.y - r.y * scaledForce.x;

    // Moment of Inertia for a disk: I = 0.5 * m * R^2
    const radius = b.circleRadius || (b.width ? b.width / 2 : 1);
    const I = 0.5 * b.mass * (radius * radius);

    // α = τ / I
    if (I > 0) {
      b.angularAcceleration += crossProduct / I;
    }
  }

  setPosition(body: PhysicsBody, position: Vector2): void {
    const b = body as CustomBody;
    const diff = Vec2.sub(position, b.position);
    b.position = Vec2.copy(position);
    b.prevPosition = Vec2.add(b.prevPosition, diff);
  }

  setVelocity(body: PhysicsBody, velocity: Vector2): void {
    const b = body as CustomBody;
    // In Verlet, velocity is pos - prevPos. To set it, we move prevPos.
    // Assuming dt = 1 unit for simplified setting, or use actual dt if known.
    // We'll approximate for now.
    const dt = 1 / 60;
    b.prevPosition = Vec2.sub(b.position, Vec2.mul(velocity, dt));
  }

  setVertices(body: PhysicsBody, vertices: Vector2[]): void {
    // For our AABB rectangles, we'll just re-calculate width/height from vertices if needed,
    // but the engine uses x/y/w/h.
    // Since handleResize sends rectangle vertices, we can infer w/h.
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const v of vertices) {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
      if (v.y < minY) minY = v.y;
      if (v.y > maxY) maxY = v.y;
    }
    const b = body as CustomBody;
    b.width = maxX - minX;
    b.height = maxY - minY;
  }

  getBodies(): PhysicsBody[] {
    return this.bodies;
  }

  pause(): void {
    this.isRunning = false;
  }

  resume(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastUpdate = performance.now();
      this.runLoop();
    }
  }

  destroy(): void {
    this.isRunning = false;
    this.bodies = [];
    this.beforeUpdateCallbacks = [];
    this.lastUpdate = 0;
  }

  private grabbedBody: CustomBody | null = null;
  private mouseOffset = Vec2.create(0, 0);

  setMousePosition(pos: Vector2): void {
    this.mousePos = Vec2.copy(pos);
  }

  grabBody(pos: Vector2): PhysicsBody | null {
    // 1. Sync current mouse position immediately
    this.mousePos = Vec2.copy(pos);

    // 2. Find anything physically under the cursor
    const bodiesUnderMouse = this.bodies.filter((b) => {
      if (b.circleRadius) {
        const d = Vec2.dist(b.position, pos);
        return d <= b.circleRadius; // Pixel-perfect boundary
      }
      return false;
    });

    // 3. Exclusively target orange draggables
    const orangeBody = bodiesUnderMouse.find((b) => b.label === "draggable-orange") as CustomBody;

    if (orangeBody) {
      this.grabbedBody = orangeBody;
      // Store the exact delta from cursor to center to prevent "snapping"
      this.mouseOffset = Vec2.sub(orangeBody.position, pos);
      return orangeBody;
    }
    return null;
  }

  releaseBody(): void {
    this.grabbedBody = null;
  }

  queryPoint(pos: Vector2): PhysicsBody[] {
    return this.bodies.filter((b) => {
      if (b.circleRadius) {
        return Vec2.distSq(b.position, pos) < b.circleRadius * b.circleRadius;
      }
      if (b.width && b.height) {
        const xmin = b.position.x - b.width / 2;
        const xmax = b.position.x + b.width / 2;
        const ymin = b.position.y - b.height / 2;
        const ymax = b.position.y + b.height / 2;
        return pos.x >= xmin && pos.x <= xmax && pos.y >= ymin && pos.y <= ymax;
      }
      return false;
    });
  }

  onBeforeUpdate(callback: (timestamp: number) => void): void {
    this.beforeUpdateCallbacks.push(callback);
  }
}
