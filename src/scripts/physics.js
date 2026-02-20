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

let matterRuntime = null;
let initVersion = 0;

function preloadSpriteSheet() {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = "/web-ui-icon-svg-reformatting.png";
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export function destroyMatter() {
  initVersion += 1;
  if (!matterRuntime) return;

  const {
    engine,
    render,
    runner,
    container,
    driftIntervalId,
    onMouseMove,
    onCanvasClick,
    onVisibilityChange,
    onBeforeUnload,
    intersectionObserver,
    resizeObserver
  } = matterRuntime;

  if (driftIntervalId) {
    clearInterval(driftIntervalId);
  }

  if (container && onMouseMove) {
    container.removeEventListener("mousemove", onMouseMove);
  }

  if (container && onCanvasClick) {
    container.removeEventListener("click", onCanvasClick);
  }

  if (onVisibilityChange) {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }

  if (onBeforeUnload) {
    window.removeEventListener("beforeunload", onBeforeUnload);
  }

  intersectionObserver?.disconnect();
  resizeObserver?.disconnect();

  Runner.stop(runner);
  Render.stop(render);
  Composite.clear(engine.world, false, true);
  Engine.clear(engine);

  if (render?.canvas?.parentNode) {
    render.canvas.parentNode.removeChild(render.canvas);
  }

  if (render?.textures) {
    render.textures = {};
  }

  if (container) {
    container.innerHTML = "";
  }

  matterRuntime = null;
}

export async function initMatter() {
  destroyMatter();

  const myVersion = ++initVersion;
  const container = document.getElementById("matter-container");
  if (!container || window.__simpleModeEnabled) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  const sprites = {
    github: { sx: 42, sy: 30, sw: 196, sh: 191 },
    substack: { sx: 336, sy: 30, sw: 168, sh: 201 },
    linkedin: { sx: 612, sy: 27, sw: 177, sh: 177 },
    itchio: { sx: 881, sy: 39, sw: 198, sh: 178 },
    steam: { sx: 1162, sy: 30, sw: 196, sh: 196 }
  };

  const entries = [
    { name: "GitHub", link: LINKS.github, sprite: sprites.github },
    { name: "Substack", link: LINKS.substack, sprite: sprites.substack },
    { name: "LinkedIn", link: LINKS.linkedin, sprite: sprites.linkedin },
    { name: "Itch.io", link: LINKS.itchio, sprite: sprites.itchio },
    { name: "Steam", link: LINKS.steam, sprite: sprites.steam }
  ];

  const spriteSheet = await preloadSpriteSheet();
  if (myVersion !== initVersion || window.__simpleModeEnabled) return;

  container.style.position = "relative";

  const engine = Engine.create({
    enableSleeping: false,
    gravity: { x: 0, y: 0 },
    positionIterations: 4,
    velocityIterations: 3,
    constraintIterations: 2
  });

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
  render.canvas.style.pointerEvents = "none";

  const a11yLayer = document.createElement("div");
  a11yLayer.setAttribute("aria-hidden", "false");
  a11yLayer.style.position = "absolute";
  a11yLayer.style.inset = "0";
  a11yLayer.style.pointerEvents = "none";
  a11yLayer.style.zIndex = "2";
  container.appendChild(a11yLayer);

  const driftBodies = [];
  const draggableBodies = [];

  entries.forEach((entry) => {
    const radius = 80;
    const circle = Bodies.circle(
      Math.random() * width,
      Math.random() * height,
      radius,
      {
        frictionAir: 0.005,
        restitution: 1,
        label: "clickable",
        collisionFilter: { category: 0x0001 },
        render: { fillStyle: "#0062F5" }
      }
    );

    circle.plugin = {
      link: entry.link,
      name: entry.name,
      image: spriteSheet,
      sprite: entry.sprite,
      hoverScale: 1,
      targetScale: 1
    };

    const linkEl = document.createElement("a");
    linkEl.href = entry.link;
    linkEl.target = "_blank";
    linkEl.rel = "noopener noreferrer";
    linkEl.setAttribute("aria-label", `Open ${entry.name}`);
    linkEl.title = entry.name;
    linkEl.style.position = "absolute";
    linkEl.style.display = "block";
    linkEl.style.borderRadius = "50%";
    linkEl.style.pointerEvents = "auto";
    linkEl.style.background = "transparent";
    linkEl.style.outlineOffset = "3px";
    a11yLayer.appendChild(linkEl);

    circle.plugin.linkEl = linkEl;

    Body.setVelocity(circle, {
      x: (Math.random() - 0.5) * 1,
      y: (Math.random() - 0.5) * 1
    });

    driftBodies.push(circle);
  });

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
        collisionFilter: { category: 0x0002 },
        render: { fillStyle: "#F5A300" }
      }
    );

    Body.setVelocity(circle, {
      x: (Math.random() - 0.5) * 1,
      y: (Math.random() - 0.5) * 1
    });

    driftBodies.push(circle);
    draggableBodies.push(circle);
  }

  const wallThickness = 100;
  const walls = [
    Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true, render: { visible: false } }),
    Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true, render: { visible: false } }),
    Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { visible: false } }),
    Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true, render: { visible: false } })
  ];

  Composite.add(engine.world, [...driftBodies, ...walls]);

  const mouse = Mouse.create(container);
  container.removeEventListener("wheel", mouse.mousewheel);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
    collisionFilter: { mask: 0x0002 }
  });
  Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  let mousePosition = { x: 0, y: 0 };

  const onMouseMove = (event) => {
    const rect = render.canvas.getBoundingClientRect();
    mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };
  container.addEventListener("mousemove", onMouseMove);

  const onCanvasClick = (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a")) return;

    const rect = render.canvas.getBoundingClientRect();
    const clickPosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    const bodies = Composite.allBodies(engine.world);
    const clicked = Query.point(bodies, clickPosition);

    if (clicked.length > 0) {
      const body = clicked[0];
      if (body.label === "clickable" && body.plugin?.link) {
        window.open(body.plugin.link, "_blank", "noopener,noreferrer");
      }
    }
  };
  container.addEventListener("click", onCanvasClick);

  const DRIFT_INTERVAL_MS = 200;
  const DRIFT_FORCE = 0.0005;
  const DRIFT_MAX_ANGLE = Math.PI / 12;

  driftBodies.forEach((body) => {
    const vel = body.velocity;
    body.plugin.driftAngle = Math.atan2(vel.y, vel.x);
  });

  function applyBoundedDrift(body) {
    const delta = (Math.random() * 2 - 1) * DRIFT_MAX_ANGLE;
    body.plugin.driftAngle += delta;
    const fx = Math.cos(body.plugin.driftAngle) * DRIFT_FORCE;
    const fy = Math.sin(body.plugin.driftAngle) * DRIFT_FORCE;
    Body.applyForce(body, body.position, { x: fx, y: fy });
  }

  const driftIntervalId = window.setInterval(() => {
    driftBodies.forEach((body) => applyBoundedDrift(body));
  }, DRIFT_INTERVAL_MS);

  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner, engine);

  let isPanelVisible = false;
  let isTabVisible = !document.hidden;
  let isSimulationRunning = true;

  function updateSimulationState() {
    const shouldRun = isPanelVisible && isTabVisible && !window.__simpleModeEnabled;
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

    driftBodies.forEach((body) => {
      if (body.label !== "clickable") return;

      const { x, y } = body.position;
      const angle = body.angle;
      const radius = body.circleRadius;
      const image = body.plugin?.image;
      const sprite = body.plugin?.sprite;
      if (!image || !sprite) return;

      const dx = mousePosition.x - x;
      const dy = mousePosition.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const isHovering = distance < radius;

      body.plugin.targetScale = isHovering ? 1.15 : 1;
      body.plugin.hoverScale += (body.plugin.targetScale - body.plugin.hoverScale) * 0.15;
      const scale = body.plugin.hoverScale;

      const linkEl = body.plugin?.linkEl;
      if (linkEl) {
        const hitbox = radius * 1.2;
        linkEl.style.width = `${hitbox}px`;
        linkEl.style.height = `${hitbox}px`;
        linkEl.style.left = `${x - hitbox / 2}px`;
        linkEl.style.top = `${y - hitbox / 2}px`;
        linkEl.style.transform = `rotate(${angle}rad)`;
      }

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

  const contactsPanel = document.querySelector(".contacts-panel");
  const intersectionObserver = contactsPanel
    ? new IntersectionObserver((observerEntries) => {
        observerEntries.forEach((entry) => {
          isPanelVisible = entry.isIntersecting;
          updateSimulationState();
        });
      }, { threshold: 0.1 })
    : null;

  if (contactsPanel && intersectionObserver) {
    intersectionObserver.observe(contactsPanel);
  }
  updateSimulationState();

  const onVisibilityChange = () => {
    isTabVisible = !document.hidden;
    updateSimulationState();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  function handleResize() {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    render.options.width = newWidth;
    render.options.height = newHeight;
    render.canvas.width = newWidth;
    render.canvas.height = newHeight;

    Body.setPosition(walls[0], { x: newWidth / 2, y: -wallThickness / 2 });
    Body.setVertices(
      walls[0],
      Bodies.rectangle(newWidth / 2, -wallThickness / 2, newWidth, wallThickness).vertices
    );

    Body.setPosition(walls[1], { x: newWidth / 2, y: newHeight + wallThickness / 2 });
    Body.setVertices(
      walls[1],
      Bodies.rectangle(newWidth / 2, newHeight + wallThickness / 2, newWidth, wallThickness).vertices
    );

    Body.setPosition(walls[2], { x: -wallThickness / 2, y: newHeight / 2 });
    Body.setVertices(
      walls[2],
      Bodies.rectangle(-wallThickness / 2, newHeight / 2, wallThickness, newHeight).vertices
    );

    Body.setPosition(walls[3], { x: newWidth + wallThickness / 2, y: newHeight / 2 });
    Body.setVertices(
      walls[3],
      Bodies.rectangle(newWidth + wallThickness / 2, newHeight / 2, wallThickness, newHeight).vertices
    );

    driftBodies.forEach((body) => {
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
    }, 100);
  });
  resizeObserver.observe(container);

  const onBeforeUnload = () => {
    destroyMatter();
  };
  window.addEventListener("beforeunload", onBeforeUnload, { once: true });

  matterRuntime = {
    engine,
    render,
    runner,
    container,
    driftIntervalId,
    onMouseMove,
    onCanvasClick,
    onVisibilityChange,
    onBeforeUnload,
    intersectionObserver,
    resizeObserver
  };
}
