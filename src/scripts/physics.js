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

function preloadImages(entries) {
  return Promise.all(
    entries.map(entry => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = entry.svg;

        img.onload = () => {
          entry.image = img;   // ← STORE IMAGE
          resolve();
        };
      });
    })
  );
}

export async function initMatter() {
  const container = document.getElementById("matter-container");
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // --------------------------------
  // ENTRY DATA (Clickable Circles)
  // --------------------------------

  const entries = [
    {
      name: "GitHub",
      svg: "/svg/github.svg",   // real file path (NOT data URI)
      link: LINKS.github
    },
    {
      name: "LinkedIn",
      svg: "/svg/linkedin.svg",
      link: LINKS.linkedin
    },
    {
      name: "Steam",
      svg: "/svg/steam.svg",
      link: LINKS.steam
    },
    {
      name: "Substack",
      svg: "/svg/substack.svg",
      link: LINKS.substack
    },
    {
      name: "BlueSky",
      svg: "/svg/bluesky.svg",
      link: LINKS.bluesky
    }
  ];
  await preloadImages(entries);
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
          fillStyle: "#4545ee"
        }
      }
    );

    circle.plugin = {
      link: entry.link,
      image: entry.image,
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
          fillStyle: "#FFD60A"
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

  const walls = [
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

  Events.on(render, "afterRender", () => {
    const ctx = render.context;

    driftBodies.forEach(body => {
      if (body.label !== "clickable") return;

      const { x, y } = body.position;
      const angle = body.angle;
      const radius = body.circleRadius;

      const image = body.plugin?.image;
      if (!image) return;

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
        ctx.shadowColor = "#FFD60A";
        ctx.shadowBlur = 20;
      }

      ctx.drawImage(
        image,
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
      if (entry.isIntersecting) {
        Runner.run(runner, engine);
      } else {
        Runner.stop(runner);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(document.querySelector(".contacts-panel"));
}
