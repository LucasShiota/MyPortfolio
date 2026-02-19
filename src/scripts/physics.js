import Matter from "matter-js";
import { LINKS } from "../config/links.ts";

const {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint,
  Events,
  Body,
  Query
} = Matter;

function preloadSpriteSheet() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = "/web-ui-icon-svg-reformatting.png";
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export async function initMatter() {
  const container = document.getElementById("matter-container");
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // --------------------------------
  // ENTRY DATA (Clickable Circles)
  // --------------------------------

  const sprites = {
    github: { sx: 42, sy: 30, sw: 196, sh: 191 },
    substack: { sx: 336, sy: 30, sw: 168, sh: 201 },
    linkedin: { sx: 612, sy: 27, sw: 177, sh: 177 },
    itchio: { sx: 881, sy: 39, sw: 198, sh: 178 },
    steam: { sx: 1162, sy: 30, sw: 196, sh: 196 }
  };

  const entries = [
    {
      name: "GitHub",
      link: LINKS.github,
      sprite: sprites.github
    },
    {
      name: "Substack",
      link: LINKS.substack,
      sprite: sprites.substack
    },
    {
      name: "LinkedIn",
      link: LINKS.linkedin,
      sprite: sprites.linkedin
    },
    {
      name: "Itch.io",
      link: LINKS.itchio,
      sprite: sprites.itchio
    },
    {
      name: "Steam",
      link: LINKS.steam,
      sprite: sprites.steam
    }
  ];
  const spriteSheet = await preloadSpriteSheet();
  // --------------------------------
  // ENGINE
  // --------------------------------

  const engine = Engine.create({
    enableSleeping: false,
    gravity: { x: 0, y: 0 },
    positionIterations: 4,
    velocityIterations: 3,
    constraintIterations: 2
  });

  // --------------------------------
  // RENDERER
  // --------------------------------

  const render = Render.create({
    element: container,
    engine,
    options: {
      width: Math.floor(width),
      height: Math.floor(height),
      wireframes: false,
      background: "transparent",
      pixelRatio: 1
    }
  });

  render.canvas.style.position = "absolute";
  render.canvas.style.top = "0";
  render.canvas.style.left = "0";

  // --------------------------------
  // BODY STORAGE
  // --------------------------------

  const driftBodies = [];        // all bodies that drift
  const draggableBodies = [];    // drag enabled only

  // --------------------------------
  // CLICKABLE CIRCLES (SVG + Link)
  // --------------------------------

  entries.forEach(entry => {
    const radius = 80;

    const circle = Bodies.circle(
      Math.random() * width,
      Math.random() * height,
      radius,
      {
        frictionAir: 0.005,
        restitution: 1,
        label: "clickable",
        collisionFilter: {
          category: 0x0001 /* Clickable category for interaction */
        },
        render: {
          fillStyle: "#0062F5"
        }
      }
    );

    circle.plugin = {
      link: entry.link,
      image: spriteSheet,
      sprite: entry.sprite,
      hoverScale: 1,      // animated scale value
      targetScale: 1 
    };

    Body.setVelocity(circle, {
      x: (Math.random() - 0.5) * 1,
      y: (Math.random() - 0.5) * 1
    });

    driftBodies.push(circle);
  });

  // --------------------------------
  // DRAGGABLE CIRCLES (Plain Color)
  // --------------------------------

  const draggableCount = 5;

  for (let i = 0; i < draggableCount; i++) {
    const radius = 40 + Math.random() * 25;

    const circle = Bodies.circle(
      Math.random() * width,
      Math.random() * height,
      radius,
      {
        frictionAir: 0.005,
        restitution: 1,
        label: "draggable",
        collisionFilter: {
          category: 0x0002 /* Draggable category for mouse interaction */
        },
        render: {
          fillStyle: "#F5A300"
        }
      }
    );

    Body.setVelocity(circle, {
      x: (Math.random() - 0.5) * 1,
      y: (Math.random() - 0.5) * 1
    });

    driftBodies.push(circle);
    draggableBodies.push(circle);
  }

  // --------------------------------
  // WALLS
  // --------------------------------

  const wallThickness = 100;

  let walls = [
    Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, render: { visible: false }}),
    Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, render: { visible: false }}),
    Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { visible: false }}),
    Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { visible: false }})
  ];

  Composite.add(engine.world, [...driftBodies, ...walls]);

  // --------------------------------
  // MOUSE
  // --------------------------------

  const mouse = Mouse.create(render.canvas);

  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    },
    collisionFilter: {
      mask: 0x0002
    }
  });

  Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  let mousePosition = { x: 0, y: 0 };

  render.canvas.addEventListener("mousemove", (event) => {
    const rect = render.canvas.getBoundingClientRect();

    mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  });

  // --------------------------------
  // CLICK HANDLER (for clickable only)
  // --------------------------------

  render.canvas.addEventListener("click", event => {
    const rect = render.canvas.getBoundingClientRect();

    const mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    const bodies = Composite.allBodies(engine.world);
    const clicked = Query.point(bodies, mousePosition);

    if (clicked.length > 0) {
      const body = clicked[0];

      if (body.label === "clickable" && body.plugin?.link) {
          window.open(body.plugin.link, "_blank", "noopener,noreferrer");
      }
    }
  });

  // --------------------------------
  // SUBTLE DRIFT
  // --------------------------------

  // CONFIGURABLE DRIFT SETTINGS
  const DRIFT_INTERVAL_MS = 200;       // Interval between drift nudges
  const DRIFT_FORCE = 0.0005;         // Magnitude of the applied force
  const DRIFT_MAX_ANGLE = Math.PI / 12; // Max random angle change (radians, PI/12 ≈ 15°)

  // INITIALIZE DRIFT ANGLES
  driftBodies.forEach(body => {
    const vel = body.velocity;
    body.plugin.driftAngle = Math.atan2(vel.y, vel.x); // initial angle
  });

  // DRIFT FUNCTION

  function applyBoundedDrift(body) {
    // Pick random delta angle within [-DRIFT_MAX_ANGLE, +DRIFT_MAX_ANGLE]
    const delta = (Math.random() * 2 - 1) * DRIFT_MAX_ANGLE;

    // Update body drift angle
    body.plugin.driftAngle += delta;

    // Compute force vector
    const fx = Math.cos(body.plugin.driftAngle) * DRIFT_FORCE;
    const fy = Math.sin(body.plugin.driftAngle) * DRIFT_FORCE;

    // Apply the force to the body
    Body.applyForce(body, body.position, { x: fx, y: fy });
  }

  // APPLY DRIFT ON INTERVAL
  setInterval(() => {
    driftBodies.forEach(body => {
      applyBoundedDrift(body);
    });
  }, DRIFT_INTERVAL_MS);


  // --------------------------------
  // RUN
  // --------------------------------

  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);
  let isPanelVisible = false;
  let isTabVisible = !document.hidden;
  let isSimulationRunning = true;

  function updateSimulationState() {
    const shouldRun = isPanelVisible && isTabVisible;
    if (shouldRun === isSimulationRunning) return;

    if (shouldRun) {
      Runner.run(runner, engine);
      Render.run(render);
    } else {
      Runner.stop(runner);
      Render.stop(render);
    }

    isSimulationRunning = shouldRun;
  }

  Events.on(render, "afterRender", () => {
    const ctx = render.context;

    driftBodies.forEach(body => {
      if (body.label !== "clickable") return;

      const { x, y } = body.position;
      const angle = body.angle;
      const radius = body.circleRadius;

      const image = body.plugin?.image;
      if (!image) return;
      const sprite = body.plugin?.sprite;
      if (!sprite) return;

      // --------------------------------
      // HOVER DETECTION
      // --------------------------------

      const dx = mousePosition.x - x;
      const dy = mousePosition.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const isHovering = distance < radius;

      body.plugin.targetScale = isHovering ? 1.15 : 1;

      // Smooth lerp animation
      body.plugin.hoverScale +=
        (body.plugin.targetScale - body.plugin.hoverScale) * 0.15;

      const scale = body.plugin.hoverScale;

      // --------------------------------
      // DRAW ICON
      // --------------------------------

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const iconSize = radius * 1.2 * scale;

      if (isHovering) {
        ctx.shadowColor = "#00A1F5";
        ctx.shadowBlur = 20;
      }

      ctx.drawImage(
        image,
        sprite.sx,
        sprite.sy,
        sprite.sw,
        sprite.sh,
        -iconSize / 2,
        -iconSize / 2,
        iconSize,
        iconSize
      );
      ctx.shadowBlur = 0;
      ctx.restore();
    });
  });



  // --------------------------------
  // INTERSECTION OBSERVER
  // --------------------------------

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      isPanelVisible = entry.isIntersecting;
      updateSimulationState();
    });
  }, { threshold: 0.1 });

  observer.observe(document.querySelector(".contacts-panel"));
  updateSimulationState();

  function handleVisibilityChange() {
    isTabVisible = !document.hidden;
    updateSimulationState();
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("beforeunload", () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    observer.disconnect();
  }, { once: true });
  
  function handleResize() {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;

  // ------------------------
  // 1️⃣ Resize Canvas
  // ------------------------

  render.options.width = newWidth;
  render.options.height = newHeight;

  render.canvas.width = newWidth;
  render.canvas.height = newHeight;

  // ------------------------
  // 2️⃣ Reposition Walls
  // ------------------------

  const wallThickness = 100;

  // Top
  Body.setPosition(walls[0], { x: newWidth / 2, y: -wallThickness / 2 });
  Body.setVertices(
    walls[0],
    Bodies.rectangle(newWidth / 2, -wallThickness / 2, newWidth, wallThickness).vertices
  );

  // Bottom
  Body.setPosition(walls[1], { x: newWidth / 2, y: newHeight + wallThickness / 2 });
  Body.setVertices(
    walls[1],
    Bodies.rectangle(newWidth / 2, newHeight + wallThickness / 2, newWidth, wallThickness).vertices
  );

  // Left
  Body.setPosition(walls[2], { x: -wallThickness / 2, y: newHeight / 2 });
  Body.setVertices(
    walls[2],
    Bodies.rectangle(-wallThickness / 2, newHeight / 2, wallThickness, newHeight).vertices
  );

  // Right
  Body.setPosition(walls[3], { x: newWidth + wallThickness / 2, y: newHeight / 2 });
  Body.setVertices(
    walls[3],
    Bodies.rectangle(newWidth + wallThickness / 2, newHeight / 2, wallThickness, newHeight).vertices
  );

  // ------------------------
  // 3️⃣ Clamp Bodies Inside
  // ------------------------

  driftBodies.forEach(body => {
    const r = body.circleRadius;

    const clampedX = Math.max(r, Math.min(newWidth - r, body.position.x));
    const clampedY = Math.max(r, Math.min(newHeight - r, body.position.y));

    Body.setPosition(body, { x: clampedX, y: clampedY });
  });
}
let resizeTimeout;

const resizeObserver = new ResizeObserver(() => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    handleResize();
  }, 100); // wait 100ms after resize stops
});

resizeObserver.observe(container);
}

