# Economy / Shop Proposal

This document captures the current agreed proposal for the future shop and currency system. It is a design note only for now, not an implemented feature.

## Core Direction

- There will be one shared persistent coin wallet.
- Coins are the long-term currency.
- The wallet is shared across the whole game, not per run.
- The system should be built in multiple steps, not all at once.

## Currency Sources

Coins should eventually come from three places:

1. Coins collected during gameplay.
2. Manual score-to-coins exchange.
3. Rewarded ads in the future.

Important:

- Score must **not** convert to coins automatically after every run.
- Score exchange should happen deliberately in the Shop page.

## Shop Purpose

The Shop page should become the place where the game prepares and offers purchasable content over time.

Planned examples:

- Shop-only skins that cannot be unlocked through normal discovery.
- Special unlocks such as a hidden level like `4.5`.
- Future `continue` purchases after death.
- Future special/seasonal items.

## Recommended System Split

Even with one shared wallet, the system should internally distinguish between:

- Permanent unlocks
- Consumables
- Run-only purchases

Suggested internal item types:

- `skin_unlock`
- `level_unlock`
- `continue_offer`
- `consumable`
- `special`

This keeps the first version simple while leaving room to grow.

## Recommended First Steps

Best implementation order:

1. Persistent coin wallet + persistent total score foundation + Game Over coin summary
2. Shop admin section
3. Player-facing Shop page
4. Manual score-to-coins exchange in Shop
5. First permanent unlock item
6. Continue flow later
7. Rewarded ads later

## Wallet Data

Suggested persistent fields:

- `coinsBalance`
- `totalCoinsEarned`
- `totalCoinsSpent`
- `totalPersistentScore`

## Score Exchange

Current agreed direction:

- Score exchange happens outside active gameplay.
- It should be a conscious player choice, not an automatic reward.
- The source for exchange is one persistent total score pool shared across all runs.

This total score already conceptually exists because the game tracks long-term score progression for badges.

Agreed behavior:

- Every run keeps increasing one large persistent total score value.
- That total score should be visible in admin.
- Admin should allow converting part of that total score into coins.
- When conversion happens:
  - total score goes down
  - coin balance goes up
- Future runs keep increasing total score again from the new reduced base.

So the economy should use:

- one persistent total score pool
- one persistent coin wallet

instead of a separate exchange-only score bank.

## Exchange Location

Current idea:

- The Shop page can become the player-facing place for exchange.
- Admin must also expose the persistent total score and the economy controls.

This means:

- player-facing exchange can live in `Shop`
- admin can inspect and adjust the underlying economy state
- admin sets the exchange ratio
- the actual exchange action happens in `Shop`, not in admin

## Shop Admin

Add a dedicated admin section such as `Shop`.

Initial admin controls should include:

- `Score Needed Per 1 Coin`
- `Rewarded Ad Coin Reward`
- `Continue 1 Price`
- `Continue 2 Price`
- `Continue Lives Granted`

And item controls for shop content, such as:

- `Enabled`
- `Type`
- `Price Coins`
- `Reward Id`
- `Label`
- `Description`

Examples:

- Which skin is sold
- How much the skin costs
- How much a special level unlock costs
- How much future continue costs
- How many coins a rewarded ad grants
- What the current persistent total score is
- How much of that total score should be exchanged into coins

## Continue

`Continue` should come later, because it is the most complex part.

It will need rules for:

- When it appears
- How many times per run it is offered
- Whether first and second continue have different prices
- How many lives are granted
- Where the player respawns
- What happens to active effects like shield, curse, magnet, slow, etc.

## Game Over Requirement

When the coin wallet is implemented, the `Game Over` screen should clearly show:

- How many coins the player collected in that run
- That those collected coins are being added to the wallet

The intent is that the player always sees the coin reward summary directly on `Game Over`.

## Current Recommendation

Use one shared wallet, build the economy in multiple phases, and start with:

- persistent wallet
- persistent total score foundation
- immediate `Game Over` coin summary
- Shop admin section for economy tuning
- player-facing Shop page
- manual score-to-coins exchange from persistent total score in `Shop`
- first permanent unlocks

Only after that should the design move on to `continue` and rewarded ads.

## Updated Implementation Roadmap

### Step 1

Build the economy foundation:

- persistent `coinsBalance`
- persistent `totalCoinsEarned`
- persistent `totalCoinsSpent`
- persistent `totalPersistentScore`
- `Game Over` summary showing how many coins were collected in the run and that they are being added to the wallet

No player-facing exchange yet, but the wallet and long-term score base already exist.

### Step 2

Add admin section `Shop`:

- show current `totalPersistentScore`
- show current `coinsBalance`
- set `Score Needed Per 1 Coin`
- set future ad reward values
- set future continue prices
- set future shop item prices/config

Admin tunes the economy, but does not perform the player exchange flow.

### Step 3

Add player-facing `Shop` page:

- show coin wallet
- show available persistent total score
- show first prepared shop offers
- prepare the place where exchange and purchases will happen

### Step 4

Add actual player-facing score exchange inside `Shop`:

- use the admin-defined `Score Needed Per 1 Coin`
- converting score reduces `totalPersistentScore`
- converting score increases `coinsBalance`

### Step 5

Add first permanent shop purchases:

- shop-only skin
- special level unlock such as `4.5`

### Step 6

Add `continue` economy:

- continue pricing
- lives granted
- run limits
- respawn and effect rules

### Step 7

Add rewarded ads:

- admin-defined reward amount
- wallet gain after successful ad reward
