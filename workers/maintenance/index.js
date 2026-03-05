/**
 * Lucas Shiota Portfolio - Maintenance Mode Worker
 * Optimized for SEO with 503 Status Code
 */

const MAINTENANCE_CONFIG = {
  title: "Under Maintenance | Lucas Shiota",
  heading: "Polishing Reality",
  message: "I'm currently updating my portfolio with new projects and refinements. I'll be back online shortly.",
  accentColor: "#F5A300", // Portfolio gold
  secondaryColor: "#0062F5", // Portfolio blue
};

const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${MAINTENANCE_CONFIG.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
    <style>
        :root {
            --accent: ${MAINTENANCE_CONFIG.accentColor};
            --blue: ${MAINTENANCE_CONFIG.secondaryColor};
            --bg: #070707;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg);
            color: white;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }

        #physics-canvas {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            z-index: 0;
        }

        .minimal-ui {
            position: relative;
            z-index: 10;
            text-align: center;
            pointer-events: none;
            background: rgba(0, 0, 0, 0.4);
            padding: 2.5rem;
            border-radius: 1.5rem;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            max-width: 400px;
        }

        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 2rem;
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.02em;
        }

        p {
            color: #777;
            font-size: 0.95rem;
            margin: 0 0 1.5rem 0;
            line-height: 1.5;
        }

        .contacts {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            font-size: 0.8rem;
            color: #555;
            pointer-events: auto;
        }

        .contacts a {
            color: #888;
            text-decoration: none;
            transition: color 0.2s;
        }

        .contacts a:hover { color: var(--accent); }

        .discord-tag {
            background: rgba(255, 255, 255, 0.03);
            padding: 0.3rem 0.6rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
    </style>
</head>
<body>
    <canvas id="physics-canvas"></canvas>

    <div class="minimal-ui">
        <h1>Updating...</h1>
        <p>Currently refining projects and polishing the code. Back shortly.</p>
        <div class="contacts">
            <a href="mailto:hi@lucasshiota.com">hi@lucasshiota.com</a>
            <span class="discord-tag">Discord: @lucas_shiota</span>
        </div>
    </div>

    <script>
        // --- 1. THE BULLETPROOF LOADER ---
        function loadMatter(callback) {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js";
            script.onload = () => {
                console.log("Matter.js loaded successfully!");
                callback();
            };
            script.onerror = () => {
                console.error("Critical Error: Matter.js CDN is blocked or unavailable.");
            };
            document.head.appendChild(script);
        }

        // --- 2. THE PHYSICS ENGINE ---
        loadMatter(() => {
            const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

            const engine = Engine.create();
            const world = engine.world;
            const canvas = document.getElementById('physics-canvas');

            const render = Render.create({
                canvas: canvas,
                engine: engine,
                options: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    wireframes: false,
                    background: 'transparent',
                    pixelRatio: window.devicePixelRatio
                }
            });

            Render.run(render);
            Runner.run(Runner.create(), engine);

            // Boundaries
            const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true, render: { visible: false } });
            const ceiling = Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth, 100, { isStatic: true, render: { visible: false } });
            const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true, render: { visible: false } });
            const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true, render: { visible: false } });
            Composite.add(world, [ground, ceiling, leftWall, rightWall]);

            // Shapes
            const colors = ['${MAINTENANCE_CONFIG.accentColor}', '${MAINTENANCE_CONFIG.secondaryColor}', '#FFFFFF', '#333333'];
            const createShape = () => {
                const x = Math.random() * window.innerWidth;
                const size = Math.random() * 30 + 15;
                const type = Math.floor(Math.random() * 4);
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                let body;
                const opt = { render: { fillStyle: color, opacity: 0.6 } };
                if(type === 0) body = Bodies.circle(x, -100, size/2, opt);
                else if(type === 1) body = Bodies.rectangle(x, -100, size, size, opt);
                else body = Bodies.polygon(x, -100, type + 2, size, opt);
                return body;
            };

            for(let i=0; i<40; i++) {
                setTimeout(() => Composite.add(world, createShape()), i * 150);
            }

            // Mouse
            const mouse = Mouse.create(render.canvas);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: { stiffness: 0.2, render: { visible: false } }
            });
            Composite.add(world, mouseConstraint);

            window.addEventListener('resize', () => {
                render.canvas.width = window.innerWidth;
                render.canvas.height = window.innerHeight;
                Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
            });
        });
    </script>
</body>
</html>
`;

export default {
  async fetch(request, env) {
    if (env.MAINTENANCE_MODE !== "true") {
      return fetch(request);
    }

    return new Response(HTML_CONTENT, {
      status: 503,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  },
};
