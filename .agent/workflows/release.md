---
description: Automate the release process (Version Bump, Changelog Flip, Tagging)
---

This workflow automates the creation of a new project version.

### 1. Pre-Release Check

1. Ensure all changes are committed (`git status` should be clean).
2. Run `npm run test` to ensure stability.

### 2. Execution

// turbo

1. Run `npm run release`.
   - This will scan commits, decide the version bump, update `package.json`, and flip the `.docs/CHANGELOG.md` notes.

### 3. Verification

1. Review the updated `.docs/CHANGELOG.md`.
2. check `package.json` for the new version number.

### 4. Finalize

1. (Optional) Push the new tag to origin: `git push --follow-tags origin main`.
