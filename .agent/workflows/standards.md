---
description: How to maintain project standards (Comments, Commits, Changelog)
---

This workflow ensures that all AI-generated code and commits adhere to the project's [Style Guide](file:///c:/Users/lshio/Desktop/Lucas%20Shiota/GitHub%20Repo/MyPortfolio/.docs/STYLEGUIDE.md).

### 1. File Commenting
When creating or heavily refactoring a file:
- **Always** add the stylized header block at the top.
- **Use** the `// --- SECTION ---` dividers for state, helpers, and main logic.
- **Ensure** critical rules (e.g. GSAP trigger constraints) are explicitly documented in the header.

### 2. Commit Messages
When tasking a commit or proposing one:
- **MUST** use the Conventional Commits format: `<type>(<scope>): <message>`.
- **Allowed Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

### 3. Change Log Automation
At the end of a significant task:
- **Check** if `.docs/CHANGELOG.md` exists. If not, create it.
- **Add** a new entry under `[Unreleased]` or a versioned header following "Keep a Changelog" format.
- **Summarize** the key changes (Added, Fixed, Changed).

### 4. Verification
Before finishing a request:
- **Run** `npm run check` (if applicable) to ensure Astro/TypeScript integrity.
- **Check** if any new files follow the folder hierarchy in the Style Guide.
