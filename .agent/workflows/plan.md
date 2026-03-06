---
description: High-efficiency execution designed to minimize quota and turn rates.
---

Use this workflow to complete complex tasks with the minimum number of message turns.

### 1. The Strategy Phase

1.  **Analyze**: Deeply analyze the user's request.
2.  **Mapping**: Identify _every_ file that might be touched or needs to be read.
3.  **Batch Read**: Call the `view_file` or `grep_search` tools on ALL identified files in a single turn. Do not read them one by one.

### 2. The Execution Plan

1.  Present a concise "Manifest" to the user:
    - [ ] Files to be modified.
    - [ ] Logic to be implemented.
    - [ ] Automation tests to be run.
2.  **Ask for a single "Go"**: One approval for the entire plan.

### 3. The Big Push (Atomic Execution)

// turbo-all

1.  Perform all file modifications using `multi_replace_file_content` or `replace_file_content`.
2.  Perform all cleanup (formatting) as part of the same block.
3.  Run all verification commands (`astro check`, `npm test`) immediately after.

### 4. Minimal Reporting

1.  Do not explain every line of code.
2.  Provide a short "Completion Summary" and a list of updated files.
3.  Proactively offer to run `@[/commit]` to finish.
