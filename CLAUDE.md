# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Task | Command |
|---|---|
| Fairness gate (full) | `npm test` — `tools/physics-sim.mjs --spins 6000`, ~4 min, exits non-zero on FAIL |
| Fairness gate (one config) | `node tools/physics-sim.mjs --spins 2000 --only uniform-7` |
| Type check | `npm run tsc` (JSDoc types via `checkJs`, `noEmit`) |
| Serve locally | `python3 -m http.server`, then `http://localhost:8000` |

No build step, no bundler, no linter, no unit-test runner — `npm test` is the physics Monte Carlo
only. Prettier runs on IDE save (`.idea/prettier.xml`, automatic config); `.editorconfig` sets 2-space
indent and a 100-column limit for JS/CSS.

Serve over HTTP rather than `file://`: ES modules, the importmap and the service worker all need an
origin.

Keep `--spins` at 2000 or above. Chi-square on a thin run reports sampling scatter as bias — 300
spins of `uniform-7` FAILs on a wheel the 6000-spin run passes.

## Architecture

One page, no compilation. `index.html` carries the entire React `App` inside a single inline
`<script type="text/babel" data-type="module">`, transpiled in the browser by Babel standalone.
React, ReactDOM, Tailwind and Babel are vendored in `scripts/lib/` and pinned by an importmap.

### The window-global bridge

Babel standalone cannot resolve the relative imports of the inline script, so every shared symbol is
both `export`ed and hung on `window`; the inline script opens with `const { … } = window;`. Adding
one shared symbol means five edits, and skipping any of them fails silently at runtime or under
`tsc`:

1. `export` it from its module in `scripts/`.
2. Assign it in that module's trailing `if (typeof window !== "undefined")` block — `scripts/icons.js`
   uses a single `Object.assign(window, {…})` instead.
3. Declare it on `interface Window` in `types/global.d.ts`, or `npm run tsc` fails.
4. Destructure it in the `= window` block at the top of the inline script in `index.html`.
5. New file only: add its `<script>` tag in `index.html` — `type="module"` for plain JS, and
   `type="text/babel" data-type="module"` for anything containing JSX — then add its path to `ASSETS`
   in `sw.js` and bump `CACHE_NAME`. A stale `CACHE_NAME` serves the old bundle to every returning
   visitor.

Tag order in `index.html` matters: `scripts/core/` and plain modules load before the Babel-compiled
`scripts/icons.js` and `scripts/components/`, which read icons as globals.

### Physics decides the winner

`scripts/physics.js` is deliberately DOM-free so Node can import it for the fairness gate. It models a
rigid disc with bearing friction and drag, plus a spring-damper flapper riding a cam built from the
pins on the rim.

- `WheelPhysics#launch(power)` applies an impulse; `#step(dt)` integrates a fixed substep accumulator
  and returns `{ impacts, settled }`. Nothing picks a target or a duration — the winner is wherever
  the wheel stalls and rolls back, so a change to the solver is a change to the odds.
- `buildPins(items)` places one pin on every segment boundary and subdivides each segment so valley
  widths stay equal across unequal weights. That equal-width property *is* the fairness guarantee;
  the gate fails any ring whose `pitchRatio` exceeds 1.02.
- `calculateWinner` in `index.html` maps the resting `theta` to a slice, and `winnerOf` in
  `tools/physics-sim.mjs` duplicates that mapping. Changing one without the other makes the gate
  certify a wheel that is not the shipped one.
- Frame pacing must not move the result: the gate checks 60 Hz, 144 Hz and jittered pacing agree to
  1e-9.
- Touching `PHYSICS`, `GEOMETRY`, `WHEEL_PRESETS`, `TENSION_MULTIPLIERS` (physics.js) or
  `FLAPPER_TENSIONS` / `POINTER_SKINS` (`scripts/configs.js`) is a fairness change — run the full
  `npm test`, not a single `--only`.
- The gate's `PRESET_CONFIGS`, `TENSION_CONFIGS` and `SKIN_CONFIGS` rows are generated from those
  five objects, so a new or retuned setting is gated with no edit here. Keep it that way: the
  multipliers were once copied into `CONFIGS` and the gate spent a retune certifying flappers no
  player could select.

### Render loop

One `requestAnimationFrame` loop in `index.html`, mounted once with `[]` deps. It reads everything
through refs (`itemsRef`, `rotationRef`, `physicsRef`, …) that small `useEffect`s mirror from state,
because a loop that closed over state would render the first frame's world forever. `onSettleRef` is
reassigned on every render for the same reason. Per frame: `physics.step(dt)` → hand `impacts` to the
audio scheduler → `drawWheel` → `updatePointer`. When no spin is running the same loop applies the
idle attract drift, which is suppressed while `settleTimerRef` is pending so it cannot walk a stopped
wheel past the pin that decided the result.

### Audio

`scripts/sounds.js`. Every impact event carries its own sub-frame `tSim`, and `ImpactScheduler`
places it on the AudioContext clock — playing ticks once per frame is what made the old wheel sound
sparse at speed. `WheelRumble` tracks angular velocity underneath. Nodes connect through
`getBuses(ctx)` (`wheel` / `sfx`), never straight to the destination.

### Persistence and progression

All state lives in localStorage under `spinWheel_*`, with every key centralized in `STORAGE_KEYS`
(`scripts/configs.js`) and read through `loadState` (`scripts/utils.js`) in `useState` initializers.
`AchievementManager` and `ChallengeManager` (`scripts/core/`) own their own storage and are held as
long-lived instances in `App`. `calculateWinner` awards XP and calls `achievementManager.check(stats)`
with a stats object assembled inline from pre-update values, since the React state it derives from has
not committed yet.

### Console mode

`processCommandCodes` (`scripts/commands.js`) runs from `spinWheel` before each spin, and only for a
list named `@console` whose first line is `#!sudo`; the coin/XP cheats additionally need
`#!enable-cheats`. The command table is documented in `README.md`.

## Conventions

- JSDoc on every exported symbol with `@param`/`@returns` — `checkJs` means these annotations are the
  type system.
- Comments in the physics, render and audio paths explain the bug the code prevents, not what it does.
  Match that when editing them; a tuning constant with no rationale invites the next reader to
  "simplify" it.
- Conventional Commits, scoped to the subsystem (`physics`, `wheel`, `sounds`, `settings`).
  `tune(...)` and `tweak(...)` are used for physics parameter changes.
