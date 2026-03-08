# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [Unreleased]

- Centralized contact links and popup triggers into a unified `ContactButton.astro` component.
- Implemented global `box-sizing: border-box` to ensure consistent layout calculations across all browsers.
- Refactored `PopUpPanel` with a `fullWidth` prop for better responsive layout control.
- Synchronized **Clarity Mode** and **Theme** colors across all header and menu buttons (Blue/Orange transitions).
- Implemented **Clarity Mode** project-wide (renamed from High Contrast) with consistent data-attribute handling.
- Integrated **Reduced Motion** into GSAP snapping logic, ensuring animations are disabled alongside Performance Mode.
- Unified scroll snapping control with the new `syncSnapping` method.
- Added **Perceptual Scale Correction** (10% bump) to icons in Clarity Mode to counteract the irradiation illusion on solid backgrounds.
- Added default structural borders for all toggle buttons (Accessibility, Theme, Performance) in Clarity Mode.
- Dynamic color inversion for Hamburger menu icons in Clarity Mode to ensure visibility against structural fills.
- Redesigned the **Hamburger Menu** into a responsive, sectioned layout with adaptive width stages (Overlay -> Drawer -> Flyout).
- Implemented **Pinning Logic** for PopUpPanels (Accessibility & Let's Talk), supporting both hover-to-peek and click-to-pin interactions.
- Modernized legacy hamburger menu elements with rounded pill buttons and progressive content visibility logic.
- Standardized section dividers with rounded-end bars for improved visual polish.
- Hardcoded **QR Code** color tokens to strict Black & White for scannability across all site themes.
- Increased header spacing for toggles and contact buttons to improve visual balance.
- Implemented persistent "Active" visual state for `btn-type-main` buttons and the hamburger toggle based on `aria-expanded` attributes.

### Changed

- Refactored `Header.astro`, `HeaderHamburger.astro`, and `LetsTalk.astro` to use the standardized `ContactButton` component.
- Simplified `btn-type-main` utility with `height: auto` and consistent padding to prevent content squashing.
- Optimized the Hamburger Menu toggle to sit flush with the header border by adjusting height and removing internal borders.
- Updated **Window** interface in `env.d.ts` to support project-wide snapping synchronization.
- Simplified hamburger menu navigation by removing redundant section headers while preserving visual divider lines.
- Improved `btn-type-main` accessibility in Clarity Mode with consistent structural borders and perceptual scaling in active states.

### Fixed

- Resolved "tight" spacing and inconsistent vertical alignment in header buttons by normalizing padding and font-size across `<a>` and `<button>` tags.
- Fixed layout "drift" in the hamburger toggle and adjacent elements by stabilizing flexbox container behaviors.
- Corrected black-on-light theme text visibility issues for popup triggers in the header.
- Fixed unintentional "Hey" navigation item visibility in the hamburger menu.
- Corrected `menuController.ts` to properly manage `aria-expanded` state on the hamburger trigger.
- Cleaned up redundant CSS outline logic and fixed structural indentation in `button.css`.

- Resolved sidebar decoration "jitter" and navigation deadzones when **Reduced Motion** is enabled by disabling margin scaling and rounding active section positions.

- Fixed typos in `root.css` dark mode highlighting to correctly map shaded secondary colors.
- Removed motion delays when `data-reduced-motion` is disabled by forcefully stopping button scale and transition effects.
- Removed arbitrary color overrides from `btn-fx-scale` and applied specific branded hover states directly to `btn-type-main`.
- Disabled Maintenance workflow to bring the site live.
- Fixed a CSS parsing issue in `button.css` that broke Tailwind due to an inline comment within a variable assignment.

- Refactored header and panel buttons to use semantically correct HTML tags (`<a>` vs `<button>`).
- Updated button utility classes (`btn-type-main`) to correctly override global link hover styles.
- Enhanced hamburger menu toggle with full-height wrapper and improved border layout.

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
