---
description: Branching and Merge Strategy (feature branches, PRs, and branch cleanup)
---

# GitHub Flow Workflow

This workflow ensures that code changes are integrated into the `main` branch safely and consistently.

## 1. Starting a Task

Before writing any code, create a new branch:

- **Command**: `git checkout -b <prefix>/<short-desc> main`
- **Prefixes**: `feature/`, `fix/`, `chore/`, `refactor/`, `hotfix/`.

## 2. Work & Commit

Follow the [Standards](file:///.agent/workflows/standards.md) workflow for headers and commit messages.

## 3. Verification & PR

1. Run `npx astro check` and `npm run test`.
2. Push your branch: `git push origin <branch-name>`.
3. Open a Pull Request on GitHub using the provided template.

## 4. Merging

1. Wait for CI checks and approval.
2. Select **Squash and merge** on GitHub.
3. Update `.docs/CHANGELOG.md` (usually handled by `/commit` or `/release`).

## 5. Cleanup

// turbo

1. Delete the remote branch: `git push origin --delete <branch-name>`.
2. Delete the local branch: `git checkout main && git branch -D <branch-name>`.
