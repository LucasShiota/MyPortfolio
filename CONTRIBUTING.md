# Contributing to MyPortfolio

Thank you for contributing! To maintain a clean and professional codebase, please follow these branching and PR standards.

## Branching Strategy

We use a PR-based workflow. Please name your branches consistently:

| Prefix      | Use Case                                       | Example                     |
| :---------- | :--------------------------------------------- | :-------------------------- |
| `feature/`  | New features or UI components                  | `feature/about-section`     |
| `fix/`      | Bug fixes                                      | `fix/scroll-snap-mobile`    |
| `chore/`    | Maintenance, dependencies, or configuration    | `chore/update-readme`       |
| `refactor/` | Code structure changes without feature changes | `refactor/scroll-logic`     |
| `hotfix/`   | Critical production fixes                      | `hotfix/v1.0.1-broken-link` |

### Rules

1. **Never** push directly to `main`.
2. **Concise names**: Use hyphens, lowercase, and be descriptive.
3. **Short-lived**: Delete branches immediately after they are merged.

## Pull Request Process

1. **Self-Check**: Before opening a PR, run the following locally:
   - `npm run check` (Astro/TypeScript check)
   - `npm run test` (Vitest suite)
2. **Template**: Use the provided PR template to describe your changes.
3. **Approval**: At least one approval is required for merging into `main`.
4. **Merge Method**: Use **Squash and Merge** to keep the `main` history clean.

---

_This guide is part of our [Standards Workflow](file:///.agent/workflows/github-flow.md)._
