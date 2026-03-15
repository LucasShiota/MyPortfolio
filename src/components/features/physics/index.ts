/**
 * ══════════════════════════════════════════════
 *  PHYSICS COMPONENT ENTRY
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Manages the lifecycle of the physics simulation,
 * including configuration, engine initialization, and rendering.
 *
 * CRITICAL RULES:
 * - Centralized knobs and dials should be modified here.
 * - Interaction logic (hover/click) is handled via a11y layer syncing.
 */
import { CustomPhysicsEngine } from "./engines/CustomEngine";
import type { PhysicsEngine, PhysicsBody, Vector2 } from "./types";
import { LINKS } from "../../../config/site.ts";

/**
 * ══════════════════════════════════════════════
 *  PHYSICS CONFIGURATION
 * ══════════════════════════════════════════════
 */
const PHYSICS_CONFIG = {
  // --- CORE SIMULATION ---
  simulation: {
    dt: 1 / 60, // Target delta time
    substeps: 4, // Physics iterations for collision stability
    frictionAir: 0.005, // Global air resistance (0 to 1)
    restitution: 0.85, // Bounciness (0 to 1)
    forceScale: 2000, // Scaling factor for applied forces
    massDensity: 1.0, // 1.0 = standard weight, higher = heavier bodies
  },

  // --- DRIFT BEHAVIOR ---
  drift: {
    force: 0.02, // Subtle nudge force
    maxAngleVariance: Math.PI / 4, // Higher = more chaotic direction changes
    updateFrequencyMs: 200, // How often to change nudge direction
  },

  // --- ROTATION ---
  rotation: {
    maxAngularVelocity: 0.5, // Cap to prevent blurry spinning
    airFriction: 0.98, // How fast objects stop spinning (0 to 1)
    impactFriction: 0.005, // How much collision tangency affects rotation
  },

  // --- INTERACTION ---
  interaction: {
    grabBuffer: 0, // Extra radius for easier grabbing
    springStrength: 0.15, // How "tightly" a grabbed body follows the mouse
    hoverScale: 1.15, // Scale multiplier on hover
    hoverTransitionSpeed: 0.15, // Speed of the scale lerp
  },

  // --- BODIES ---
  bodies: {
    clickable: {
      radius: 80,
      hitboxMultiplier: 1.2,
      category: 0x0001,
    },
    draggable: {
      count: 5,
      minRadius: 40,
      maxRadius: 60,
      category: 0x0002,
    },
  },

  // --- VISUALS ---
  colors: {
    clickable: "#0062F5",
    draggable: "#F5A300",
    hoverGlow: "#00A1F5",
  },
};

let engine: PhysicsEngine | null = null;
let animationFrameId: number | null = null;
let initVersion = 0;

// Shared state for the renderer
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let container: HTMLElement | null = null;
let spriteSheet: HTMLImageElement | null = null;
let a11yLayer: HTMLDivElement | null = null;

let mousePosition: Vector2 = { x: 0, y: 0 };
let canvasRect: DOMRect | null = null;

let isPanelVisible = false;
let isTabVisible = !document.hidden;
let isSimulationRunning = true;

let driftBodies: PhysicsBody[] = [];
let walls: PhysicsBody[] = [];

let lastDriftUpdate = 0;

function preloadSpriteSheet(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = "/svg/spritesheet/contact-icon-spritesheet@x2.png";
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

function handleResize() {
  if (!container || !canvas || !engine) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  canvas.width = width;
  canvas.height = height;
  canvasRect = canvas.getBoundingClientRect();
  if (engine) engine.setSize(width, height);

  const wallThickness = 100;

  // Update wall positions and vertices
  const wallConfigs = [
    { x: width / 2, y: -wallThickness / 2, w: width, h: wallThickness },
    { x: width / 2, y: height + wallThickness / 2, w: width, h: wallThickness },
    { x: -wallThickness / 2, y: height / 2, w: wallThickness, h: height },
    { x: width + wallThickness / 2, y: height / 2, w: wallThickness, h: height },
  ];

  walls.forEach((wall, i) => {
    const config = wallConfigs[i];
    engine!.setPosition(wall, { x: config.x, y: config.y });
    // This is a bit Matter-specific in our current interface, but it's needed for scaling walls
    // For a truly custom engine, we might just re-create them or have a scale method.
    // For now, we'll assume the engine can handle basic vertex updates for static bodies.
    const rectVertices = [
      { x: -config.w / 2, y: -config.h / 2 },
      { x: config.w / 2, y: -config.h / 2 },
      { x: config.w / 2, y: config.h / 2 },
      { x: -config.w / 2, y: config.h / 2 },
    ];
    engine!.setVertices(wall, rectVertices);
  });

  driftBodies.forEach((body) => {
    const r = body.circleRadius || 0;
    const clampedX = Math.max(r, Math.min(width - r, body.position.x));
    const clampedY = Math.max(r, Math.min(height - r, body.position.y));
    engine!.setPosition(body, { x: clampedX, y: clampedY });
  });
}

function updateSimulationState() {
  const shouldRun = isPanelVisible && isTabVisible && !window.__performanceModeEnabled;
  isSimulationRunning = shouldRun;

  if (shouldRun) {
    engine?.resume();
    if (!animationFrameId) render();
  } else {
    engine?.pause();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
}

function render() {
  if (!ctx || !canvas || !engine || !isSimulationRunning) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  driftBodies.forEach((body) => {
    const { x, y } = body.position;
    const angle = body.angle;
    const radius = body.circleRadius || PHYSICS_CONFIG.bodies.clickable.radius;

    if (body.label === "clickable") {
      const img = body.plugin?.image;
      const sprite = body.plugin?.sprite;
      if (!img || !sprite) return;

      const dx = mousePosition.x - x;
      const dy = mousePosition.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const isHovering = distance < radius;

      body.plugin.targetScale = isHovering ? PHYSICS_CONFIG.interaction.hoverScale : 1;
      body.plugin.hoverScale =
        (body.plugin.hoverScale || 1) +
        (body.plugin.targetScale - (body.plugin.hoverScale || 1)) *
          PHYSICS_CONFIG.interaction.hoverTransitionSpeed;
      const scale = body.plugin.hoverScale;

      const linkEl = body.plugin?.linkEl;
      if (linkEl) {
        const hitbox = body.plugin.hitbox;
        linkEl.style.transform = `translate3d(${x - hitbox / 2}px, ${y - hitbox / 2}px, 0) rotate(${angle}rad) scale(${scale})`;
      }

      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(angle);

      // Render Circle Background
      ctx!.beginPath();
      ctx!.arc(0, 0, radius, 0, Math.PI * 2);
      ctx!.fillStyle = PHYSICS_CONFIG.colors.clickable;
      ctx!.fill();

      // Render Icon
      const iconSize = radius * 1.2 * scale;
      if (isHovering && !document.documentElement.classList.contains("perf-eco")) {
        ctx!.shadowColor = PHYSICS_CONFIG.colors.hoverGlow;
        ctx!.shadowBlur = 20;
      }

      ctx!.drawImage(
        img,
        sprite.sx,
        sprite.sy,
        sprite.sw,
        sprite.sh,
        -iconSize / 2,
        -iconSize / 2,
        iconSize,
        iconSize
      );

      ctx!.shadowBlur = 0;
      ctx!.restore();
    } else if (body.label === "draggable-orange") {
      ctx!.save();
      ctx!.translate(x, y);
      ctx!.rotate(angle);

      ctx!.beginPath();
      ctx!.arc(0, 0, radius, 0, Math.PI * 2);
      ctx!.fillStyle = PHYSICS_CONFIG.colors.draggable;
      ctx!.fill();

      ctx!.restore();
    }
  });

  animationFrameId = requestAnimationFrame(render);
}

export function destroyPhysics() {
  initVersion += 1;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);

  if (engine) engine.destroy();
  engine = null;

  if (container) {
    container.innerHTML = "";
  }

  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("beforeunload", onBeforeUnload);

  spriteSheet = null;
  driftBodies = [];
  walls = [];
  container = null;
  canvas = null;
  ctx = null;
  a11yLayer = null;
}

function onVisibilityChange() {
  isTabVisible = !document.hidden;
  updateSimulationState();
}

function onBeforeUnload() {
  destroyPhysics();
}

export async function initPhysics() {
  destroyPhysics();
  const myVersion = ++initVersion;

  container = document.getElementById("matter-container");
  if (!container || window.__performanceModeEnabled) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // 1. Resources
  spriteSheet = await preloadSpriteSheet();
  if (myVersion !== initVersion || window.__performanceModeEnabled) return;

  // 2. Engine Setup
  engine = new CustomPhysicsEngine();
  if (engine) engine.init(width, height, PHYSICS_CONFIG);

  // 3. Canvas Setup
  canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.width = width;
  canvas.height = height;
  container.appendChild(canvas);
  ctx = canvas.getContext("2d");
  canvasRect = canvas.getBoundingClientRect();

  // 4. A11y Layer
  a11yLayer = document.createElement("div");
  a11yLayer.setAttribute("aria-hidden", "false");
  a11yLayer.style.position = "absolute";
  a11yLayer.style.inset = "0";
  a11yLayer.style.pointerEvents = "none";
  a11yLayer.style.zIndex = "2";
  container.appendChild(a11yLayer);

  // 5. Build Bodies
  const BASE_SPRITE_SHEET_WIDTH = 1400;
  const BASE_SPRITE_SHEET_HEIGHT = 256;
  const baseSprites = {
    github: { sx: 42, sy: 30, sw: 196, sh: 191 },
    substack: { sx: 336, sy: 30, sw: 168, sh: 201 },
    linkedin: { sx: 612, sy: 27, sw: 177, sh: 177 },
    itchio: { sx: 881, sy: 39, sw: 198, sh: 178 },
    steam: { sx: 1162, sy: 30, sw: 196, sh: 196 },
  };

  const spriteScaleX = spriteSheet.naturalWidth / BASE_SPRITE_SHEET_WIDTH;
  const spriteScaleY = spriteSheet.naturalHeight / BASE_SPRITE_SHEET_HEIGHT;

  const entries = [
    { name: "GitHub", link: LINKS.github.url, sprite: baseSprites.github },
    { name: "Substack", link: LINKS.substack.url, sprite: baseSprites.substack },
    { name: "LinkedIn", link: LINKS.linkedin.url, sprite: baseSprites.linkedin },
    { name: "Itch.io", link: LINKS.itchio.url, sprite: baseSprites.itchio },
    { name: "Steam", link: LINKS.steam.url, sprite: baseSprites.steam },
  ];

  function findSafePosition(radius: number, bodies: PhysicsBody[]): Vector2 {
    let attempts = 0;
    while (attempts < 50) {
      const x = radius + Math.random() * (width - radius * 2);
      const y = radius + Math.random() * (height - radius * 2);

      let overlap = false;
      for (const b of bodies) {
        const r2 = b.circleRadius || 0;
        const distSq = (x - b.position.x) ** 2 + (y - b.position.y) ** 2;
        if (distSq < (radius + r2 + 10) ** 2) {
          // 10px buffer
          overlap = true;
          break;
        }
      }

      if (!overlap) return { x, y };
      attempts++;
    }
    // Fallback if no spot found
    return { x: Math.random() * width, y: Math.random() * height };
  }

  driftBodies = entries.map((entry) => {
    const radius = PHYSICS_CONFIG.bodies.clickable.radius;
    const pos = findSafePosition(radius, driftBodies);
    const body = engine!.addCircle(pos.x, pos.y, radius, {
      frictionAir: PHYSICS_CONFIG.simulation.frictionAir,
      restitution: PHYSICS_CONFIG.simulation.restitution,
      label: "clickable",
      collisionFilter: { category: PHYSICS_CONFIG.bodies.clickable.category },
    });

    const scaledSprite = {
      sx: Math.round(entry.sprite.sx * spriteScaleX),
      sy: Math.round(entry.sprite.sy * spriteScaleY),
      sw: Math.round(entry.sprite.sw * spriteScaleX),
      sh: Math.round(entry.sprite.sh * spriteScaleY),
    };

    const linkEl = document.createElement("a");
    linkEl.href = entry.link;
    linkEl.target = "_blank";
    linkEl.rel = "noopener noreferrer";
    linkEl.setAttribute("aria-label", `Open ${entry.name}`);
    linkEl.style.position = "absolute";
    linkEl.style.display = "block";
    linkEl.style.borderRadius = "50%";
    linkEl.style.pointerEvents = "auto";
    const hitbox = radius * PHYSICS_CONFIG.bodies.clickable.hitboxMultiplier;
    linkEl.style.width = `${hitbox}px`;
    linkEl.style.height = `${hitbox}px`;
    a11yLayer!.appendChild(linkEl);

    body.plugin = {
      link: entry.link,
      name: entry.name,
      image: spriteSheet,
      sprite: scaledSprite,
      hoverScale: 1,
      targetScale: 1,
      linkEl,
      hitbox,
    };

    const initialVel = {
      x: (Math.random() - 0.5) * 1,
      y: (Math.random() - 0.5) * 1,
    };
    engine!.setVelocity(body, initialVel);
    body.plugin.driftAngle = Math.atan2(initialVel.y, initialVel.x);

    return body;
  });

  // Removed blue draggable bodies

  const orangeCount = PHYSICS_CONFIG.bodies.draggable.count;
  for (let i = 0; i < orangeCount; i++) {
    const radius =
      PHYSICS_CONFIG.bodies.draggable.minRadius +
      Math.random() *
        (PHYSICS_CONFIG.bodies.draggable.maxRadius - PHYSICS_CONFIG.bodies.draggable.minRadius);
    const pos = findSafePosition(radius, driftBodies);
    const body = engine!.addCircle(pos.x, pos.y, radius, {
      frictionAir: PHYSICS_CONFIG.simulation.frictionAir,
      restitution: PHYSICS_CONFIG.simulation.restitution,
      label: "draggable-orange",
      collisionFilter: { category: PHYSICS_CONFIG.bodies.draggable.category },
    });

    const initialVel = {
      x: (Math.random() - 0.5) * 1,
      y: (Math.random() - 0.5) * 1,
    };
    engine!.setVelocity(body, initialVel);
    body.plugin = { driftAngle: Math.atan2(initialVel.y, initialVel.x) };
    driftBodies.push(body);
  }

  // 6. Walls
  const wallThickness = 100;
  const wallConfigs = [
    { x: width / 2, y: -wallThickness / 2, w: width, h: wallThickness },
    { x: width / 2, y: height + wallThickness / 2, w: width, h: wallThickness },
    { x: -wallThickness / 2, y: height / 2, w: wallThickness, h: height },
    { x: width + wallThickness / 2, y: height / 2, w: wallThickness, h: height },
  ];

  walls = wallConfigs.map((config) =>
    engine!.addRectangle(config.x, config.y, config.w, config.h, {
      isStatic: true,
    })
  );

  // 7. Event Listeners
  // Unify mouse mapping for both interactions and movement
  const updateMousePos = (e: MouseEvent) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mousePosition = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };

    if (engine) engine.setMousePosition(mousePosition);
  };

  container.addEventListener("click", (e) => {
    if (!engine) return;
    updateMousePos(e); // Ensure position is synced before query

    const clicked = engine.queryPoint(mousePosition);

    if (clicked.length > 0) {
      const body = clicked[0];
      if (body.label === "clickable" && body.plugin?.link) {
        window.open(body.plugin.link, "_blank", "noopener,noreferrer");
      }
    }
  });

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("beforeunload", onBeforeUnload, { once: true });

  // 7b. Mouse Interaction Listeners
  let isDragging = false;

  container.addEventListener("mousedown", (e) => {
    if (!engine || !isSimulationRunning) return;
    updateMousePos(e);

    const grabbed = engine.grabBody(mousePosition);
    if (grabbed) {
      isDragging = true;
      e.preventDefault();
    }
  });

  window.addEventListener(
    "mousemove",
    (e) => {
      if (!isSimulationRunning) return;
      updateMousePos(e);
    },
    { passive: true }
  );

  window.addEventListener("mouseup", () => {
    if (engine) engine.releaseBody();
    isDragging = false;
  });

  // 8. Drift Logic (Hooked into engine update)
  if (engine) {
    engine.onBeforeUpdate((timestamp) => {
      if (timestamp - lastDriftUpdate < PHYSICS_CONFIG.drift.updateFrequencyMs) return;
      lastDriftUpdate = timestamp;

      driftBodies.forEach((body) => {
        const delta = (Math.random() * 2 - 1) * PHYSICS_CONFIG.drift.maxAngleVariance;
        body.plugin.driftAngle += delta;
        const fx = Math.cos(body.plugin.driftAngle) * PHYSICS_CONFIG.drift.force;
        const fy = Math.sin(body.plugin.driftAngle) * PHYSICS_CONFIG.drift.force;
        if (engine) engine.applyForce(body, body.position, { x: fx, y: fy });
      });
    });
  }

  // 9. Visibility Observer
  const contactsPanel = document.querySelector(".contacts-panel");
  if (contactsPanel) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isPanelVisible = entry.isIntersecting;
          updateSimulationState();
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(contactsPanel);
  }

  // 10. Resize Observer
  let resizeTimeout: ReturnType<typeof setTimeout>;
  const resizer = new ResizeObserver(() => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 100);
  });
  resizer.observe(container);

  // 11. Start Loop
  updateSimulationState();
  render();
}
