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
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --accent: ${MAINTENANCE_CONFIG.accentColor};
            --blue: ${MAINTENANCE_CONFIG.secondaryColor};
            --bg: #070707;
            --glass: rgba(255, 255, 255, 0.03);
            --border: rgba(255, 255, 255, 0.08);
        }

        body {
            margin: 0;
            padding: 0;
            background-color: var(--bg);
            color: white;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
        }

        .ambient-bg {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: -1;
            background: 
                radial-gradient(circle at 20% 30%, rgba(245, 163, 0, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(0, 98, 245, 0.1) 0%, transparent 40%);
            filter: blur(80px);
            animation: pulse 10s ease-in-out infinite alternate;
        }

        @keyframes pulse {
            from { opacity: 0.5; transform: scale(1); }
            to { opacity: 0.8; transform: scale(1.1); }
        }

        .container {
            max-width: 500px;
            padding: 3rem;
            text-align: center;
            background: var(--glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border);
            border-radius: 2rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            position: relative;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: rgba(245, 163, 0, 0.1);
            border: 1px solid rgba(245, 163, 0, 0.2);
            border-radius: 99px;
            color: var(--accent);
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 2rem;
        }

        .dot {
            width: 6px;
            height: 6px;
            background: var(--accent);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--accent);
            animation: blink 1.5s infinite;
        }

        @keyframes blink { 50% { opacity: 0.3; } }

        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 2.5rem;
            margin: 0 0 1rem 0;
            background: linear-gradient(135deg, #fff 0%, #888 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            color: #999;
            line-height: 1.6;
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }

        .progress-container {
            width: 100%;
            height: 4px;
            background: rgba(255,255,255,0.05);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 2rem;
        }

        .progress-bar {
            width: 40%;
            height: 100%;
            background: linear-gradient(to right, var(--blue), var(--accent));
            border-radius: 2px;
            animation: slide 2s ease-in-out infinite;
        }

        @keyframes slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
        }

        .footer-link {
            color: #555;
            text-decoration: none;
            font-size: 0.8rem;
            transition: color 0.3s;
        }
        
        .footer-link:hover { color: var(--accent); }
    </style>
</head>
<body>
    <div class="ambient-bg"></div>
    <div class="container">
        <div class="status-badge">
            <div class="dot"></div>
            System Update
        </div>
        <h1>${MAINTENANCE_CONFIG.heading}</h1>
        <p>${MAINTENANCE_CONFIG.message}</p>
        
        <div class="progress-container">
            <div class="progress-bar"></div>
        </div>

        <a href="mailto:hi@lucasshiota.com" class="footer-link">Need to reach me? hi@lucasshiota.com</a>
    </div>
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
