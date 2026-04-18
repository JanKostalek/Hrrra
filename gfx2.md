# GFX2 Start Screen Plan

`GFX2` is a second start-screen style that lives next to the current `GFX1` version.

## Goal

Keep the current start page as a safe fallback, while building a new crossroads-driven visual hub:

- signpost arrows become the main navigation
- clouds become secondary navigation
- the screen can later be animated
- the feature can be toggled in admin as `GFX1` / `GFX2`

## Mapping

Main signpost navigation:

- `Classic` -> `Jump Classic`
- `Advanced` -> `Jump Advanced`
- `Badges` -> `Badges`
- `Settings` -> `Settings`
- `Scores` -> `Scores`

Secondary cloud navigation:

- `Rules`
- `Credits`
- `Shop`

## Planned implementation steps

1. Add `GFX1 / GFX2` admin toggle.
2. Add a static `GFX2` start screen with clickable hotspots on the crossroads image.
3. Add clickable clouds for secondary pages.
4. Add `Advanced` lock state handling inside `GFX2`.
5. Add difficulty switching via a moving sun (`Easy` / `Hard`).
6. Add a static character near the crossroads with the player name on the pedestal.
7. Animate the character so it walks in from the lower-left path.
8. Animate the clouds so they drift from left to right.
9. Polish layout, responsiveness, hit areas, and add any missing pages.

## Current implementation scope

This first `GFX2` pass includes:

- admin toggle for `GFX1 / GFX2`
- static `GFX2` crossroads screen
- clickable arrows for `Classic`, `Advanced`, `Badges`, `Settings`, `Scores`
- clickable moving clouds for `Rules`, `Credits`, `Shop`
- `Advanced` lock notice in `GFX2`

Still intentionally left for later:

- difficulty switching via the sun
- player name on the character pedestal
- character arrival animation
- final motion polish and cloud tuning
