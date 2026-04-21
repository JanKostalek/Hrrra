# Workflow Rules

This file captures standing project workflow conventions so they do not get lost between sessions.

## Prompt Logging

- Every new user prompt should also be appended to `prompts.md`.
- For every user message, first append it to `prompts.md`, and only after that respond, analyze, or implement anything else.
- Each prompt entry should use this separator format:

```text
<prompt text>

-------------------

```

## Documentation Logging

- Non-mechanic changes should be logged in `CHANGES.md`.
- Any gameplay or balance behavior changes must also be logged in `MECHANICS.md`.
- After each implemented change, append a short note to the relevant log immediately.
- Log entries should include what changed, why it changed, and where it changed when possible.
- Prefer file plus selector/function/section names over line numbers so the note stays useful after later edits.

## Android Mirror

- Do not mirror or sync web/runtime files into `www` or `android/app/src/main/assets/public` automatically unless the user explicitly asks for it.
- Only copy into `www` when the user says `priprav www`.
- Only sync into Android and then prepare the `.aab` when the user says `priprav aab`.
- When web/runtime files change in a way that affects Android behavior, mirror the updated web assets into `android/app/src/main/assets/public` only as part of an explicit `priprav aab` request.
- Typical examples:
  - `game.js`
  - `style.css`
  - `index.html`
  - `config.js`
  - `tuning.js`
  - audio assets
  - version/update metadata

## Validation

- After meaningful JavaScript changes, run syntax validation with `node --check`.
- When Android public assets were mirrored, also validate the mirrored `game.js` copy.

## Local Tooling

- Before searching for environment/tooling details or recurring workflow facts, first check this `WORKFLOW.md` to see whether the answer is already documented here.
- Python is available on this machine.
- Prefer the Windows launcher `C:\\Windows\\py.exe` first.
- Known direct Python path: `C:\\Program Files\\Python313\\python.exe` (`py -0p` reports `-V:3.13 *` there).
- Do not assume `python` from `WindowsApps` will work; if plain `python` fails, use `py` or the direct path above.
- Java is available via Android Studio. Known JDK path: `C:\\Program Files\\Android\\Android Studio\\jbr`.

## Local Storage Cleanup

- If the user asks for `vycistení local storage`, clear only Hrrra progress data for skins and badges.
- The exact keys to remove are:
  - `hrrra_player_skin_progress_v1`
  - `hrrra_badge_stats_v1`
- The Firefox file-origin storage for the local Hrrra build is under:
  - `C:\\Users\\jkostalek\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\s33txe4g.default-release\\storage\\default\\file++++C++-_WeB_-+Hrrra+index.html\\ls\\data.sqlite`
- If backup origin folders for the same page exist, remove the same two keys there too so the progress does not come back from an older local copy.
- Do not clear `hrrra_economy_v1`, player name, player id, or max score unless the user explicitly asks for those too.
- Reusable helper scripts: `reset-local-storage.cmd` and `reset-local-storage.ps1` in the repo root. Prefer the `.cmd` launcher when you want a one-click reset.
- The helper reset clears the local `file://` Hrrra storage branch and its backup copies in the current Firefox profiles, but only removes the Hrrra skin/badge progress data.
- One-shot reset command for the current Firefox profile:

```powershell
@'
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const base = path.join(process.env.APPDATA, 'Mozilla', 'Firefox', 'Profiles', 's33txe4g.default-release', 'storage', 'default');
const keys = ['hrrra_player_skin_progress_v1', 'hrrra_badge_stats_v1'];
for (const dirent of fs.readdirSync(base, { withFileTypes: true })) {
  if (!dirent.isDirectory() || !dirent.name.startsWith('file++++C++-_WeB_-+Hrrra+index.html')) continue;
  const dbPath = path.join(base, dirent.name, 'ls', 'data.sqlite');
  if (!fs.existsSync(dbPath)) continue;
  const db = new DatabaseSync(dbPath);
  db.exec('BEGIN IMMEDIATE');
  for (const key of keys) db.prepare('delete from data where key = ?').run(key);
  const usage = db.prepare('select coalesce(sum(length(value)), 0) as usage from data').get().usage;
  db.prepare('update database set usage = ? where origin = ?').run(usage, 'file:///C:/-_WeB_-/Hrrra/index.html');
  db.exec('COMMIT');
  db.close();
}
'@ | node -
```

## Releases

- Before preparing a new Android store build, verify version consistency across:
  - `android/app/build.gradle`
  - `version-info.js`
  - `version.json`
  - `android/app/src/main/assets/public/version-info.js`
  - `android/app/src/main/assets/public/version.json`
- When the user asks to prepare an `.aab`, treat that as a request for a Store-upload-ready build.
- `Prepare aab` means the whole release flow, not only the local bundle build.
- Always bump whatever release versioning is required for Play upload, including at minimum:
  - `versionCode`
  - `versionName` when appropriate
  - in-game/update metadata that must match the shipped build
- Never reuse the previous release version when preparing a new `.aab`; every `.aab` preparation must bump the release version first.
- Always ensure the Android packaged public assets contain the same version/update files as the web root so the app does not falsely report that a newer Store version exists immediately after install/update.
- `main` is the verified local baseline. Do not make changes on `main`; use it only to preserve the last verified working state after testing. All new work goes on a side branch, currently `New`. If the repo is on `main`, I will say so explicitly before doing anything else.
- Unless the user explicitly says otherwise, all UI and implementation work should be done in `gfx2` first; treat `gfx1` as legacy fallback only.
- Unless the user explicitly says otherwise, `prepare aab` should include all of this:
  - commit the intended release changes
  - make sure the release commit is on local `main`
  - push that release commit to `origin/main`
  - verify the remote deployment picks up the new version metadata
  - confirm `version.json` on the live site reports the new release version
  - only treat the release as complete when the in-app update check can see the new version after launch
  - then build the final `.aab`
- The goal of `prepare aab` is a release state where:
  - Google Play accepts the upload
  - the bundled app reports the shipped version correctly
  - the live `version.json` advertises the same newer version
  - an older installed app can detect that update on startup

## Commits

- Do not auto-commit or push unless explicitly requested by the user.
- Avoid including unrelated helper files, spreadsheets, certificates, or source/reference asset folders unless the user asks for them.

- Pokud budeme na vetvi `main`, vždy to výslovne reknu, aby se na ní omylem nepracovalo.
