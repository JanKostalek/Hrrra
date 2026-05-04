# Mine Economy Todo

This document captures the current proposal for the future mine economy screen and its progression path. It is a living design note, so we can keep adding details and follow-up ideas over time.

## Goal

Create a passive mine loop around the existing `mine_inside` screen:

- coins slowly accumulate into a dedicated storage
- the player manually transfers stored coins into the normal wallet
- storage has a fixed capacity at first
- storage capacity can later be upgraded in the shop through the chest graphic

The mine should feel like a reward loop, not just a timer.

## Core Loop

1. The mine produces coins at a fixed interval.
2. Coins go into `mine storage`, not directly into the wallet.
3. Storage has a maximum capacity.
4. The UI shows:
   - current stored coins
   - total storage capacity
   - countdown until the next coin
5. When storage is full, the timer area shows `FULL`.
6. The player presses `Transfer`.
7. All stored coins move into the regular wallet.
8. Mining resumes automatically after transfer.

## Recommended Technical Model

Use a timestamp-based model instead of relying on a live interval as the source of truth.

Suggested persistent fields:

- `walletCoins`
- `mineStorageCoins`
- `mineStorageCapacity`
- `mineMineIntervalMs`
- `mineLastUpdatedAt`
- `mineUnlocked`

Why:

- survives reloads
- survives inactive tabs better
- avoids desync if the game is paused or hidden
- makes the countdown easy to rebuild whenever the screen opens

## Recommended Behavior

- Default storage example: `50` coins
- Default interval example: `1 coin / minute`
- Transfer should move the full stored amount at once
- After transfer, the mine should continue from the existing time model instead of restarting a fresh wait from zero
- If storage is full, do not keep overfilling it

## UI Proposal

The mine screen should visually separate:

- `Storage`
- `Wallet`
- `Transfer`
- `Next coin in`
- `Info / message` area

Suggested visual rules:

- Storage panel shows `23 / 50`
- Wallet panel shows current coin balance
- Transfer button is the primary action
- Countdown area shows either `MM:SS` or `FULL`
- A bottom info panel can show short contextual messages

## Information / Message Area

The lower message panel should not be purely random spam.

Better sources for messages:

- first entry into the mine
- first coin produced
- storage half full
- storage full
- after transfer
- after capacity upgrade

Random messages are still possible, but they should come from a controlled pool and respect cooldowns.

## Future Shop Expansion

Later, the shop should allow increasing storage capacity.

Suggested progression:

- chest level 1: base capacity
- chest level 2: larger capacity
- chest level 3: even larger capacity

This should feel like a meaningful upgrade, so capacity changes should be clearly visible.

## Risks / Things To Watch

- Do not use `setInterval` as the source of truth.
- Multiple tabs may write conflicting mine state.
- Browser time changes can affect time-based systems.
- If capacity upgrades are too small, the player will not feel progress.
- If the interval is too long, the mine will feel empty.
- If the message panel is too random, it will feel disconnected from the actual mine state.

## Recommended Safeguards

- Recompute mine state from `Date.now()` whenever the screen opens.
- Save important changes immediately after transfer and after upgrades.
- Keep the storage cap strict.
- Keep the timer logic readable and deterministic.
- Prefer a simple first version, then expand with upgrades and events.

## Future Additions

Possible follow-up items:

- different mine themes or levels
- better particle or coin animation inside the storage
- storage upgrade tiers in the shop
- special mine events
- prestige-like mine bonuses
- more message types tied to player progress

## Implementation Order

1. Build the persistent mine state model.
2. Add the mine_inside screen.
3. Show storage, wallet, countdown, and transfer.
4. Add transfer logic.
5. Add the message panel.
6. Add shop-based storage upgrades.
7. Extend with extra mine events later.

## Current Direction

Use the mine as a passive storage layer between gameplay rewards and the main wallet.
Make it simple first, then grow it with upgrades and events after the base loop feels solid.

## Current Status

- Step 4 is now in the first working pass: `Transfer` moves stored mine coins into the wallet and resumes the mine timer.
- Step 5 is now in the first working pass: the bottom mine message panel shows contextual status text and idle tips.
