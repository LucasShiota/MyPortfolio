# Performance Audit Standard Operating Procedure (SOP)

To ensure that recordings are comparable over time, you should follow this exact sequence for every audit. This eliminates variables like "how fast I scrolled" or "how long I waited."

## 1. Environment Preparation

- **Build Production**: Never audit in `dev` mode. Run `npm run build` then `npm run preview`.
- **Close Background Tabs**: Ensure Firefox is the only active application.
- **Incognito/Private Mode**: Disable extensions that might inject scripts (like password managers or ad-blockers).

## 2. Standardized Audit Scenarios

### Scenario A: The "Cold Start" (Boot Performance)

1. Open Firefox DevTools -> Performance tab.
2. Press **Start Recording**.
3. Hit **Refresh** (Ctrl+F5) on the page.
4. Wait for the "Startup Gate" to fade and the shader to appear.
5. Stop recording immediately.
6. **Name**: `perf_audit_v1_coldstart.json`

### Scenario B: The "Scroll Stress Test" (Jank/FPS)

1. Start on the Home/Hero section.
2. Press **Start Recording**.
3. Scroll to the bottom of the page at a **moderate, steady speed** (approx. 3 seconds to reach the footer).
4. Stay at the bottom for 2 seconds (triggers Matter.js physics).
5. Scroll back to the top at the same speed.
6. Stop recording.
7. **Name**: `perf_audit_v1_scroll.json`

### Scenario C: The "Inactivity/Thermal Test" (Long Session)

1. Start Recording.
2. Leave the mouse perfectly still for **6 minutes** (this tests the 5-min Sleep Mode and 1-min Jitter Wrap).
3. Wiggle the mouse to "wake" the site.
4. Stop recording.
5. **Name**: `perf_audit_v1_thermal.json`

## 3. Storage & Organization

Keep your findings inside the repository so they can be tracked alongside code changes.

- **Location**: `tests/audits/performance/`
- **Subfolders**:
  - `/raw/` - For the JSON/recording files exported from browsers.
  - `/summaries/` - For your (or my) analysis notes and comparisons.

- **Tip**: If the JSON files get larger than 50MB, add `tests/audits/performance/raw/*.json` to your `.gitignore` to keep the repo thin.

## 4. Comparison Checklist

When comparing two reports, look for:

- **CPU Usage**: Is the "Scripting" block smaller than before?
- **Frame Time**: Are the "Red Bars" fewer in number during Scenario B?
- **GC Events**: Are there vertical yellow bars (Garbage Collection) during Scenario C?
