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
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
        }

        /* Ambient Background Glows */
        .ambient-bg {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: -1;
            background: 
                radial-gradient(circle at 20% 30%, rgba(245, 163, 0, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(0, 98, 245, 0.05) 0%, transparent 40%);
            filter: blur(80px);
        }

        .minimal-ui {
            z-index: 10;
            text-align: center;
            background: rgba(255, 255, 255, 0.03);
            padding: 3rem;
            border-radius: 2rem;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            max-width: 420px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 2.22rem;
            margin: 0 0 1rem 0;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #fff 0%, #aaa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            color: #999;
            font-size: 1.05rem;
            margin: 0 0 2rem 0;
            line-height: 1.6;
        }

        .contacts {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            align-items: center;
        }

        .contacts a {
            color: #777;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.2s;
            border-bottom: 1px solid transparent;
        }

        .contacts a:hover { 
            color: var(--accent);
            border-bottom-color: rgba(245, 163, 0, 0.3);
        }

        .discord-tag {
            color: #555;
            font-size: 0.8rem;
            background: rgba(255, 255, 255, 0.02);
            padding: 0.4rem 0.8rem;
            border-radius: 0.6rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: inline-block;
            margin-top: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="ambient-bg"></div>

    <div class="minimal-ui">
        <h1>Updating...</h1>
        <p>Currently refining projects and polishing the code. Back shortly.</p>
        <div class="contacts">
            <a href="mailto:hi@lucasshiota.com">hi@lucasshiota.com</a>
            <span class="discord-tag">Discord: @lucas_shiota</span>
        </div>
    </div>
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
