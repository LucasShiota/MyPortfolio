---
description: Automate the finalization of a task (Check, Documentation, Commit)
---

This workflow automates the "finishing" steps of a task using the project standards.

### 1. Verification

// turbo

1. Run `npx astro check` to ensure there are no build errors.

### 2. Documentation Update

1. Read the changes in the current session.
2. Update `.docs/CHANGELOG.md` under the `[Unreleased]` section with a summary of work (Added, Changed, Fixed).

### 3. File Headers

1. Verify that any new or modified `.ts` or `.astro` files contain the required header block defined in the [Style Guide](file:///c:/Users/lshio/Desktop/Lucas%20Shiota/GitHub%20Repo/MyPortfolio/.docs/STYLEGUIDE.md).

### 4. Commit

1. Stage all changes (`git add .`).
   - _Note: `lint-staged` will automatically format your code using Prettier during the commit process._
2. Generate a Conventional Commit message in the format: `<type>(<scope>): <description>`.
3. Execute the commit.
