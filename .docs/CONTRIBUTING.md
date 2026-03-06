# Contributing to MyPortfolio

Welcome! To maintain a high-quality codebase that is accessible to both humans and AI, please follow these standards.

## Commit Message Policy
We enforce **Conventional Commits**. Your commit will be rejected by a git-hook if it doesn't match this format:
`type(scope): description`

**Common Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `refactor`: Code restructuring
- `chore`: Maintenance tasks (dependencies, config)

## Code Standards
### 1. File Headers
All significant files should include a header block:
```typescript
/**
 * ══════════════════════════════════════════════
 *  NAME
 * ══════════════════════════════════════════════
 */
```

### 2. Changelog
Always update `.docs/CHANGELOG.md` when introducing significant changes.

## Tools
- `npm run check`: Run Astro health checks.
- `commitlint`: Automatically validates your commit messages.
