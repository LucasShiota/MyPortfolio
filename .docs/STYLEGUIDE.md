# Project Style Guide & Standards

This document defines the coding, documentation, and workflow standards for **MyPortfolio**. Following these rules ensures consistency for both humans and AI contributors.

---

## 1. Commit Message Style

We follow the **Conventional Commits** specification. This allows for automated changelog generation.

**Format**: `<type>(<scope>): <description>`

### Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Example:

`feat(scroll): add smooth snapping to panel transitions`
`refactor(sidebar): consolidate mobile and desktop classes`

---

## 2. File Commenting Standards

Every major file (especially `.ts` and `.astro` logic) should have a header block and clear section dividers.

### Header Block

Used at the top of the file to explain its purpose and any critical rules.

```typescript
/**
 * ══════════════════════════════════════════════
 *  [FILE NAME / MODULE NAME]
 * ══════════════════════════════════════════════
 *
 * PURPOSE: Brief explanation of what this file does.
 *
 * CRITICAL RULES:
 * - List any "gotchas" or strict design rules here.
 * - [Rule 1]
 */
```

### Section Dividers

Used to group related logic within a file.

```typescript
// --- SECTION NAME (e.g. SHARED STATE, HELPERS, LISTENERS) ---
```

---

## 3. Change Log Structure

We use the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.

### Structure:

- `Added`: for new features.
- `Changed`: for changes in existing functionality.
- `Deprecated`: for soon-to-be removed features.
- `Removed`: for now removed features.
- `Fixed`: for any bug fixes.
- `Security`: in case of vulnerabilities.

---

## 4. File & Folder Hierarchy

- `src/components/`: Reusable Astro components.
- `src/components/features/`: Logic-heavy modules (e.g., scroll, interactions). Try to keep `.ts` logic separate from `.astro` if it exceeds 100 lines.
- `src/layouts/`: Base page templates.
- `src/styles/`: Global CSS and design tokens.

---

## 5. Automation

- **Commit Hooks**: Commits that don't match the style guide will be rejected by `commitlint`.
- **Auto-Formatting**: Code is automatically formatted using Prettier via `lint-staged` on every commit.
- **Image Guard**: Staged images are checked for size limits to prevent site bloat.
- **A11y Checks**: Run automated accessibility audits via `@[/a11y]`.
- **Visual Checks**: Detect unintended UI changes using `@[/visual-check]`.
- **Health Checks**: Monitor dependency updates and security via `@[/health]`.
- **Change Log Updates**: AI should proactively update `CHANGELOG.md` after major tasks.
