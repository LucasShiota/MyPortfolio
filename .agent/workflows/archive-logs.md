---
description: Archive old changelog entries to keep history manageable
---

# Archive Workflow

This workflow helps you move old version history from `CHANGELOG.md` to `.docs/CHANGELOG_ARCHIVE.md`.

## 1. Verification

1. Review the current `.docs/CHANGELOG.md`.

## 2. Execution

// turbo

1. Run `npm run archive-changelog`.

## 3. Cleanup

1. Commit the changes: `git add . && git commit -m "chore(docs): archive older versions in changelog"`
