---
description: Detect unintended UI changes (Visual Regression)
---

This workflow helps you catch "pixel shifts" and unintended layout breaks.

### 1. Preparation

1. Ensure the development server is running or the script will start it automatically.

### 2. Execution

// turbo

1. Run `npx playwright test`.
2. This will compare the current site against "threshold" images.

### 3. Reviewing Results

1. If the test fails, run `npx playwright show-report`.
2. A browser will open showing the "Expected" vs "Actual" vs "Difference" (in red).

### 4. Updating Baselines

1. If the change was intended (e.g., you updated a button's color), run:
   `npx playwright test --update-snapshots`
2. Commit the new snapshots to lock in the new look.
