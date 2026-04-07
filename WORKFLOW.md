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

## Android Mirror

- When web/runtime files change in a way that affects Android behavior, mirror the updated web assets into `android/app/src/main/assets/public`.
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

- Python is available on this machine.
- Prefer the Windows launcher `C:\\Windows\\py.exe` first.
- Known direct Python path: `C:\\Program Files\\Python313\\python.exe`.
- Do not assume `python` from `WindowsApps` will work; if plain `python` fails, use `py` or the direct path above.

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
