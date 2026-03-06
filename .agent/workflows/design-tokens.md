---
description: How to maintain project design tokens (Colors, Spacing, Typography)
---

# Design Tokens Workflow

This workflow ensures that all styling is centralized and consistent across the project.

## 1. Identify Change

If you need to:

- Add a new **color** or **gradient**.
- Change a **spacing** unit (margin/padding).
- Update a **z-index** level.
- Change a **border-radius** globally.

## 2. Update `tokens.css`

Go to [src/styles/tokens.css](file:///c:/Users/lshio/Desktop/Lucas%20Shiota/GitHub%20Repo/MyPortfolio/src/styles/tokens.css) and add/update your CSS variables.

**Example**:

```css
:root {
  --accent-new: #ff00ff;
  --space-xxl: 8rem;
}
```

## 3. Usage in Components

**Avoid hardcoding values** like `padding: 10px` or `color: #abc`.

- **In CSS**: Use `var(--color-variable)`.
- **In Tailwind classes**: Use design-token aware classes (if synced) or arbitrary values mapping to tokens like `p-[var(--space-md)]`.

## 4. Verification

Run the visual check to ensure no existing components were broken:

// turbo

1. Run `npm run visual-check`.
