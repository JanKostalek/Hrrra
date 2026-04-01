# Workflow Rules

This file captures standing project workflow conventions so they do not get lost between sessions.

## Prompt Logging

- Every new user prompt should also be appended to `prompts.md`.
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

## Releases

- Before preparing a new Android store build, verify version consistency across:
  - `android/app/build.gradle`
  - `version-info.js`
  - `version.json`
  - `android/app/src/main/assets/public/version-info.js`
  - `android/app/src/main/assets/public/version.json`
- When the user asks to prepare an `.aab`, treat that as a request for a Store-upload-ready build.
- Always bump whatever release versioning is required for Play upload, including at minimum:
  - `versionCode`
  - `versionName` when appropriate
  - in-game/update metadata that must match the shipped build
- Always ensure the Android packaged public assets contain the same version/update files as the web root so the app does not falsely report that a newer Store version exists immediately after install/update.

## Commits

- Do not auto-commit or push unless explicitly requested by the user.
- Avoid including unrelated helper files, spreadsheets, certificates, or source/reference asset folders unless the user asks for them.
