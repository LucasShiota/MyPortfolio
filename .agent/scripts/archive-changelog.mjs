import fs from 'node:fs';
import path from 'node:path';

const CHANGELOG_PATH = path.resolve('.docs/CHANGELOG.md');
const ARCHIVE_PATH = path.resolve('.docs/CHANGELOG_ARCHIVE.md');
const RECENT_VERSIONS_TO_KEEP = 5;

// Matches version headers like ### [0.0.2] or ### 0.0.1
const VERSION_HEADER_REGEX = /^### (\[?\d+\.\d+\.\d+\]?)/;

export async function archiveChangelog() {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    console.error('CHANGELOG.md not found.');
    return;
  }

  const content = fs.readFileSync(CHANGELOG_PATH, 'utf-8');
  const lines = content.split('\n');

  const versionIndices = [];
  lines.forEach((line, index) => {
    if (VERSION_HEADER_REGEX.test(line)) {
      versionIndices.push(index);
    }
  });

  if (versionIndices.length <= RECENT_VERSIONS_TO_KEEP) {
    console.log(`Changelog has ${versionIndices.length} versions. Keeping all of them (threshold: ${RECENT_VERSIONS_TO_KEEP}).`);
    return;
  }

  const archiveStartIndex = versionIndices[RECENT_VERSIONS_TO_KEEP];
  const recentContent = lines.slice(0, archiveStartIndex).join('\n').trim();
  const archivedEntries = lines.slice(archiveStartIndex).join('\n').trim();

  // 1. Prepare Archive File
  let archiveHeader = '# Changelog Archive\n\nAll older version histories are preserved here.\n\n';
  if (fs.existsSync(ARCHIVE_PATH)) {
    const existingArchive = fs.readFileSync(ARCHIVE_PATH, 'utf-8');
    // Remove the header of the existing archive if it exists, to append new entries correctly
    const existingEntries = existingArchive.replace(archiveHeader, '').trim();
    fs.writeFileSync(ARCHIVE_PATH, archiveHeader + archivedEntries + '\n\n' + existingEntries);
  } else {
    fs.writeFileSync(ARCHIVE_PATH, archiveHeader + archivedEntries);
  }

  // 2. Update Main Changelog
  const footerNote = `\n\n---\n**Looking for older versions?** Check out the [Changelog Archive](./CHANGELOG_ARCHIVE.md).`;
  fs.writeFileSync(CHANGELOG_PATH, recentContent + footerNote);

  console.log(`Successfully archived ${versionIndices.length - RECENT_VERSIONS_TO_KEEP} versions to CHANGELOG_ARCHIVE.md`);
}

archiveChangelog().catch(err => {
  console.error('Error during archiving:', err);
  process.exit(1);
});
