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
            pointer-events: none; /* Let clicks pass through to physics if needed, or keep for clarity */
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
        const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events, Common } = Matter;

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
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Ground, Walls and Ceiling
        const wallOptions = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, wallOptions);
        const ceiling = Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, wallOptions);
        
        Composite.add(world, [ground, ceiling, leftWall, rightWall]);

        // Helper to get random palette color
        const colors = ['${MAINTENANCE_CONFIG.accentColor}', '${MAINTENANCE_CONFIG.secondaryColor}', '#FFFFFF', '#333333'];
        
        const createShape = () => {
            const x = Math.random() * window.innerWidth;
            const y = -100;
            const size = Math.random() * 30 + 15;
            const shapeType = Math.floor(Math.random() * 4);
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            let body;
            const renderOptions = {
                fillStyle: color,
                strokeStyle: 'rgba(255,255,255,0.1)',
                lineWidth: 1,
                opacity: 0.6
            };

            switch(shapeType) {
                case 0: body = Bodies.circle(x, y, size/2, { render: renderOptions, friction: 0.1, restitution: 0.6 }); break;
                case 1: body = Bodies.rectangle(x, y, size, size, { render: renderOptions, chamfer: { radius: 5 } }); break;
                case 2: body = Bodies.polygon(x, y, 3, size/1.5, { render: renderOptions }); break;
                case 3: body = Bodies.polygon(x, y, 6, size/1.5, { render: renderOptions }); break;
            }
            
            return body;
        };

        // Initial drop
        for(let i=0; i<30; i++) {
            setTimeout(() => Composite.add(world, createShape()), i * 150);
        }

        // Mouse interactions
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        Composite.add(world, mouseConstraint);
        render.mouse = mouse;

        // "Vortex" effect on drag - unique physics behavior
        Events.on(mouseConstraint, 'mousemove', function(event) {
            const mousePosition = event.mouse.position;
            if (mouseConstraint.body) {
                // When dragging, give the body a little "vibe" or spin
                Matter.Body.setAngularVelocity(mouseConstraint.body, (Math.random() - 0.5) * 0.2);
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
            Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
            Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
        });
    </script>
</body>
</html>
`;

export default {
  async fetch(request, env) {
    // If maintenance mode is OFF, just let the request through to your real site
    if (env.MAINTENANCE_MODE !== "true") {
      return fetch(request);
    }

    // Otherwise, return the maintenance page
    return new Response(HTML_CONTENT, {
      status: 503,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  },
};
