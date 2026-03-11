# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [Unreleased]

- Replaced **Three.js** and **Vanta.js** (~600KB) with a custom, lightweight **Pure WebGL** shader in `ShaderFogBG.astro`.
- Localized critical 3rd-party libraries (**FontAwesome**) to eliminate render-blocking CDN dependencies.
- Implemented **Astro Image Optimization** pipeline across the homepage and project pages, reducing image payload by over **80%**.
- Restored **Variable Font preloading** in `BaseHead.astro` to improve Core Web Vitals (LCP/CLS).
- Integrated `src/assets` and the `<Image />` component into the `projects` content collection schema.
- Optimized initial parser-blocking scripts for theme detection and mobile performance mode.
- Redesigned Performance Toggle into a dynamic 3-state (Auto, Eco, Off) capsule button.
- Integrated comprehensive accessibility controls (Reduced Motion) directly into the `ShaderFogBG.astro` WebGL render loop.
- Unified button press feedback with a new global `btn-fx-squish` utility class.
- Restructured `Header.astro` and `HeaderHamburger.astro` navigation rules to intelligently hide redundant buttons based on media queries and homepage routing.
- Re-architected the **About Section** into a modular **Widget-Based System (Level 2 Customization)**.
- Implemented a **Persistent Global Header** for character profile tracking across all tabs.
- Migrated About content and layout logic into a unified, data-driven schema in `aboutData.ts`.
- Optimized tab navigation with autonomous UI components for Abilities, Proficiencies, and Milestones.

### Added

- Created a **Widget System** in `AboutSheet.tsx` that renders dynamic layouts based on a configuration registry.
- Added support for asymmetric layouts (e.g. `2-col-asymmetric`, `3-col`) within the About Panel.

### Changed

- Refactored `AboutSheet.tsx` from a static tabbed view to a generic renderer for data-driven widgets.
- Consolidated global status metrics (AC, Init, Speed) and the HP bar into a persistent header block.
- Updated Character Sheet styling to follow the latest Tailwind v4 and project-specific color variables.

### Fixed

- Resolved Tailwind v4 utility class mismatches (`border-color-accent` -> `border-(--brand-secondary)`).
- Restored missing TypeScript interfaces in `aboutData.ts` and resolved all project-wide hints during `astro check`.

### Added

- Created `ShaderFogBG.astro`, a zero-dependency WebGL shader that replicates the Vanta Fog effect with 99% less code.
- Created `@utility btn-fx-squish` in `button.css` to centralize tactile click animations with automatic Reduced Motion overrides.
- Implemented `ProjectsPanel.tsx`, a Solid.js component for reactive project management.
- Integrated `gsap` and `ScrollToPlugin` for advanced slider physics.

### Changed

- Refactored `HomePageLayout.astro` to use the new `ShaderFogBG` component.
- Optimized homepage background by eliminating heavy 3rd-party 3D engine dependencies.
- Refactored `Header.astro`, `HeaderHamburger.astro`, and `LetsTalk.astro` to use the standardized `ContactButton` component.
- Simplified `btn-type-main` utility with `height: auto` and consistent padding to prevent content squashing.
- Optimized the Hamburger Menu toggle to sit flush with the header border by adjusting height and removing internal borders.
- Updated **Window** interface in `env.d.ts` to support project-wide snapping synchronization and Vanta effect management.
- Simplified hamburger menu navigation by removing redundant section headers while preserving visual divider lines.
- Improved `btn-type-main` accessibility in Clarity Mode with consistent structural borders and perceptual scaling in active states.
- Re-architected `performanceController.ts` and `PerformanceToggle.astro` to support a continuous "Spectrum" of performance mapping instead of binary on/off states.
- Updated `HeaderIconButton.astro` for cohesive frosted glass styling and unified button states across all header UI elements.
- Migrated `Projects.astro` to host the new Solid.js `ProjectsPanel`.
- Refactored `projectsPhysics.ts` to use GSAP for all scroll-based physics and inertia.

### Fixed

- Resolved `/[object Object]` 404 errors in project pages by updating content mapping and routing to handle **Astro 5** image metadata objects.
- Fixed markup nesting error in `Hey.astro` where the flip card back face was rendering outside its container.
- Resolved TypeScript declaration errors for legacy Vanta and Three.js modules via `env.d.ts` and `@types` installation.
- Corrected project route generation by switching from deprecated `slug` to `id` mapping in `projectsData.ts`.
- Fixed CSS injection issues in the Projects Panel by inlining styles to ensure Tailwind v4 processing.

### Removed

- Removed `vanta` and `three` from project dependencies.
- Deleted `VantaFogBG.astro` following migration to native WebGL.
- Removed deprecated project list and preview Astro components (`ProjectList.astro`, `ProjectPreviews.astro`).
- Deleted legacy controller scripts (`projectsEntriesController.ts`, `projectsPreviewsController.ts`, `initProjectsPanel.ts`).

### [0.0.2](https://github.com/LucasShiota/MyPortfolio/compare/v0.0.1...v0.0.2) (2026-03-06)

### Features (0.0.2)

- **automation:** add /health workflow for dependency monitoring ([991c80f](https://github.com/LucasShiota/MyPortfolio/commit/991c80feabc1b2cf52c39598a390032170b09c08))
- **automation:** add image-guard, a11y, and visual-check workflows ([fba89a6](https://github.com/LucasShiota/MyPortfolio/commit/fba89a64027b47c5d00311b50c76caf94ad12518))
- **formatting:** install Prettier and configure lint-staged ([e9e91b6](https://github.com/LucasShiota/MyPortfolio/commit/e9e91b681ef00a1002be77f845aea503b5a7021b))
- **standards:** add /plan workflow for high-efficiency execution ([3b77f18](https://github.com/LucasShiota/MyPortfolio/commit/3b77f18e30a688956dcc727e110d868247235591))
- **maintenance:** reorganize worker and add `/maintenance` workflow

### 0.0.1 (2026-03-06)

### Features (0.0.1)

- add cloudflare maintenance worker and deploy workflow ([e4baed1](https://github.com/LucasShiota/MyPortfolio/commit/e4baed1abf7eb719aaead8ef5a831c68876c10e3))
- Add core portfolio UI components and implement a new styling system. ([a89a076](https://github.com/LucasShiota/MyPortfolio/commit/a89a0764ba22235deca430179205e1795f04e29c))
- Add foundational Astro components for portfolio home and project pages, global styles, and utilities. ([78656f4](https://github.com/LucasShiota/MyPortfolio/commit/78656f4f5487570d63437bbb739e059e8ec1e43f))
- add GitHub Actions workflow for deploying the maintenance worker ([f28b0cf](https://github.com/LucasShiota/MyPortfolio/commit/f28b0cf3463c14aad96c9e516bd787555b4138b7))
- Add initial header component, global styles, and an interactive projects section with list, previews, and filtering. ([2e487f7](https://github.com/LucasShiota/MyPortfolio/commit/2e487f7a6b30eebd396b735880845676bb9d756d))
- Add new icons and update styles ([0e6e75b](https://github.com/LucasShiota/MyPortfolio/commit/0e6e75b2022bcb9f0d8934feea80b3287da076de))
- Add new project page components, Baraliot project content, and centralized link configuration. ([6333343](https://github.com/LucasShiota/MyPortfolio/commit/6333343e9366728a32cb215745a558b71d113b20))
- Add new project pages and components for enhanced project display and navigation. ([be9b058](https://github.com/LucasShiota/MyPortfolio/commit/be9b058f6f35e3d1298fe345b5d8eb2a00406706))
- add panel scroll functionality with GSAP animations and sidebar scaling ([f1dd858](https://github.com/LucasShiota/MyPortfolio/commit/f1dd8584be0bfdfc87a875ccd6c0e138e6dbccda))
- add project management components and functionality ([aa3950a](https://github.com/LucasShiota/MyPortfolio/commit/aa3950a625c22a131b6b4216398e93122e7950a7))
- add project showcase and details components ([2927bb5](https://github.com/LucasShiota/MyPortfolio/commit/2927bb5f62ccc375c8fbc9a47c6f39d78c21c20a))
- add maintenance mode Cloudflare Worker with physics animation and remove Tailwind reference file. ([7fc3de9](https://github.com/LucasShiota/MyPortfolio/commit/7fc3de9c24808544ba52d98b2b648fef29753287))
- add new components for About, Hero background text, Sidebar, and Simple Mode toggle ([2a2d28e](https://github.com/LucasShiota/MyPortfolio/commit/2a2d28e2eeca0d53c8a30abb4cd3cd05d53dfaa7))
- add initial UI components and styling for portfolio sections. ([8fceddf](https://github.com/LucasShiota/MyPortfolio/commit/8fceddfe8105e89b3a515751cc774b0b51b17678))
- enhance header animations and improve theme handling ([efe2db6](https://github.com/LucasShiota/MyPortfolio/commit/efe2db655ebb545b7e1ef8c1af198be07e8bf5df))
- Implement a dynamic project page layout with modular sections and add initial project content. ([ea14824](https://github.com/LucasShiota/MyPortfolio/commit/ea14824a72a567e11c0f644294cea43ef51ba977))
- Implement a new projects section featuring a selectable list, detailed previews, and their associated data and control scripts. ([2e1f1f1](https://github.com/LucasShiota/MyPortfolio/commit/2e1f1f1e120c1c93b5da10e29e6502e874974c61))
- Implement core layout, advanced scrolling features, and UI toggles for dark and performance modes. ([8dcb4bb](https://github.com/LucasShiota/MyPortfolio/commit/8dcb4bb2b64ed2b8b450023ca095de266e9adcb4))
- implement DarkMode component with theme toggle and Vanta.js animation ([a4f1449](https://github.com/LucasShiota/MyPortfolio/commit/a4f14492a86baccff9ecad0536cebf89368be550))
- Implement initial portfolio structure with core layout components, navigation, and feature toggles. ([512aca0](https://github.com/LucasShiota/MyPortfolio/commit/512aca026f6b303bba8adb614fa085fe3a2d398e))
- Implement Matter.js physics simulation and establish core portfolio site structure with new Astro components, pages, and project content. ([a53b256](https://github.com/LucasShiota/MyPortfolio/commit/a53b2568898c5e8e57ddfbc04740736a9a37fec4))
- Implement new project page structure with modular section components and dynamic navigation. ([07817a0](https://github.com/LucasShiota/MyPortfolio/commit/07817a0be8f776218fac974824cbe693c1cfa19f))
- Implement project display components for the homepage and detailed project pages with section navigation. ([0cd9839](https://github.com/LucasShiota/MyPortfolio/commit/0cd9839a685e03cb849e1403b747adb3538f9155))
- implement responsive canvas resizing and wall repositioning in Matter.js ([edc219b](https://github.com/LucasShiota/MyPortfolio/commit/edc219bc5283e5d3e517f26046831eb8af5e9817))
- Implement responsive header with hamburger menu, accessibility toggle, and project section base component. ([8166e90](https://github.com/LucasShiota/MyPortfolio/commit/8166e9023e25d02e942e75080e59f47ac56512cf))
- Introduce an interactive physics simulation for links, supported by a new configuration file and a Header component. ([1892429](https://github.com/LucasShiota/MyPortfolio/commit/189242919e03da3b396104fcf190f24365cf389c))
- introduce base layout, project navigation, and startup UI components. ([def8e5f](https://github.com/LucasShiota/MyPortfolio/commit/def8e5f98708bb13f941992165062e654d641807))
- Introduce detailed project pages with new content collection, navigation, and modular section components. ([e1b8c5a](https://github.com/LucasShiota/MyPortfolio/commit/e1b8c5a506cc1f7b739ee77e45a8cfabada77c7c))
- refactor layout by removing Footer component, updating Header z-index, and adding Contacts component with footer info ([ff89847](https://github.com/LucasShiota/MyPortfolio/commit/ff898476811a6ecab69e37f21bcfce90337b0d48))
- Set up initial homepage layout with new Astro components and integrate Tailwind CSS for styling. ([d20ee93](https://github.com/LucasShiota/MyPortfolio/commit/d20ee93293f0b4565bf39d4b0dc4cc81d89d0438))
- **standards:** add style guide, automated workflows, and commit enforcers ([949c563](https://github.com/LucasShiota/MyPortfolio/commit/949c56302b5599543d088878de9bd281d33b9351))

### Bug Fixes

- correct import path for DarkMode component ([051dc7c](https://github.com/LucasShiota/MyPortfolio/commit/051dc7c23b094a64bd6824187e8738d471a56b23))
- correct import path for DarkMode component ([d795858](https://github.com/LucasShiota/MyPortfolio/commit/d795858c1c9666c99fcf3c6374bb579615337fb4))
- simplify wrangler routes and add package.json ([f162dee](https://github.com/LucasShiota/MyPortfolio/commit/f162deefae5b7d962beaae9d1e472c9a5fb01620))
- use string array for wrangler routes ([dd6d22a](https://github.com/LucasShiota/MyPortfolio/commit/dd6d22adb53bd43649c0a693b8f0d40d6d91dcea))
