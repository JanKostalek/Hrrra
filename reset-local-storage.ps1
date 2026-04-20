$ErrorActionPreference = 'Stop'

# Reset only the unlock progress the team wants to re-test.
$keys = @(
  'hrrra_player_skin_progress_v1',
  'hrrra_badge_stats_v1'
)

$profileRoot = Join-Path $env:APPDATA 'Mozilla\Firefox\Profiles'
$nodeExe = Join-Path $env:ProgramFiles 'nodejs\node.exe'
if (-not (Test-Path -LiteralPath $nodeExe)) {
  $nodeExe = 'node'
}

@'
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const profileRoot = process.argv[2];
const keys = ['hrrra_player_skin_progress_v1', 'hrrra_badge_stats_v1'];
const originMatchers = [
  /^file\+\+\+\+C\+\+\-_WeB_-\+Hrrra\+index\.html(?:\.bak-.*)?$/i
];

function shouldTargetOrigin(name) {
  return originMatchers.some((matcher) => matcher.test(name));
}

for (const profileDirent of fs.readdirSync(profileRoot, { withFileTypes: true })) {
  if (!profileDirent.isDirectory()) continue;

  const profileDir = path.join(profileRoot, profileDirent.name);
  const storageRoot = path.join(profileDir, 'storage', 'default');
  if (fs.existsSync(storageRoot)) {
    for (const originDirent of fs.readdirSync(storageRoot, { withFileTypes: true })) {
      if (!originDirent.isDirectory() || !shouldTargetOrigin(originDirent.name)) continue;

      const dbPath = path.join(storageRoot, originDirent.name, 'ls', 'data.sqlite');
      if (!fs.existsSync(dbPath)) continue;

      const db = new DatabaseSync(dbPath);
      db.exec('BEGIN IMMEDIATE');
      for (const key of keys) {
        db.prepare('delete from data where key = ?').run(key);
      }
      const usage = db.prepare('select coalesce(sum(length(value)), 0) as usage from data').get().usage;
      db.prepare('update database set usage = ? where origin = ?').run(usage, 'file:///C:/-_WeB_-/Hrrra/index.html');
      db.exec('COMMIT');
      db.close();
      console.log(`cleared ${dbPath}`);
    }
  }
}
'@ | & $nodeExe - $profileRoot
