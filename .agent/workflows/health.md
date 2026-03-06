---
description: Check project dependency health (Outdated & Security)
---

This workflow automates the checking of your 3rd party libraries for updates and security vulnerabilities.

### 1. Security Check

// turbo

1. Run `npm audit`.
2. If vulnerabilities are found:
   - Run `npm audit fix` for safe, non-breaking fixes.
   - For high-severity issues requiring breaking changes, report them to the user before running `npm audit fix --force`.

### 2. Update Check

// turbo

1. Run `npm outdated`.
2. Identify packages that are behind their "Latest" version.
3. **Recommendation**:
   - Use `npm update` for minor/patch versions (Safe).
   - For Major version jumps (e.g., `astro` 4 -> 5), report it as a potential migration task.

### 3. Verification

1. After any update, run `npm test` and `npx astro check` to ensure the new versions didn't break anything.
2. If everything passes, update `CHANGELOG.md` under `[Changed]` or `[Security]`.
