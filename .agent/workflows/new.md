---
description: Scaffold a new Astro component or feature with standardized boilerplate
---

This workflow automates the creation of a new component, ensuring it follows the project's [Style Guide](file:///c:/Users/lshio/Desktop/Lucas%20Shiota/GitHub%20Repo/MyPortfolio/.docs/STYLEGUIDE.md).

### 1. Preparation

1. Identify the name and category of the new component (e.g., `features/scroll/NewManager`, `homePage/NewPanel`).
2. Decide if a companion `.ts` logic file is required.

### 2. Creation

1. Create the `.astro` file in `src/components/[category]/[Name].astro`.
2. Add the standardized header block at the top:

```astro
---
/**
 * ══════════════════════════════════════════════
 *  [NAME] COMPONENT
 * ══════════════════════════════════════════════
 *
 * PURPOSE: [Describe the component's purpose]
 */
---
```

3. If logic is needed, create `src/components/[category]/[name].ts`.
4. Add the standardized header block to the `.ts` file:

```typescript
/**
 * ══════════════════════════════════════════════
 *  [NAME] LOGIC
 * ══════════════════════════════════════════════
 *
 * PURPOSE: [Describe the logic purpose]
 * CRITICAL RULES: [List any gotchas]
 */
```

### 3. Finalize

1. Add a basic HTML structure and a scoped `<style>` block to the `.astro` file.
2. Link the `.ts` file in the `.astro` file's `<script>` tag if applicable.
3. Run `@[/standards]` to verify the new files.
