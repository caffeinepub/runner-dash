# Specification

## Summary
**Goal:** Build a lightweight 2D endless runner web game with menus, settings, audio, scoring, game-over flow, simulated rewarded-continue, and an Internet Identity–backed Motoko leaderboard.

**Planned changes:**
- Implement core 2D endless runner loop (auto-run, jump + gravity, ground, collisions, increasing difficulty) with randomized obstacle spawning and cleanup.
- Add screens and UI flow: Main Menu (Start, Settings, Exit), Gameplay HUD (score), Game Over (final + best score, Restart, Main Menu, rewarded-continue simulation), and Leaderboard screen.
- Add controls: on-screen Jump button (click/tap) and Space key support.
- Add character sprite animation (run cycle + airborne state) driven by the game loop.
- Add audio: jump and hit/game-over SFX plus looping background music; settings toggles (and optional volume) that persist locally and apply immediately; ensure audio loading doesn’t block start.
- Apply a simple, coherent, game-appropriate UI theme across all screens (not a blue/purple default palette).
- Backend: create a single Motoko leaderboard canister storing best scores per Internet Identity principal with methods to submit score, fetch top N, and fetch caller best (stable persistence).
- Frontend: integrate Internet Identity login and connect to leaderboard (login prompt, submit score on game over, display top N and user best/rank if feasible; clear messaging when login is required).
- Performance optimizations: stable update loop, minimize React re-renders during gameplay, keep assets lightweight.
- Add generated static art assets (character/obstacles/background/ground) under `frontend/public/assets/generated` and render them in gameplay.

**User-visible outcome:** Users can play an endless runner in the browser with smooth animation, audio and persistent settings, see score/high score, use a simulated “Watch Ad to Continue” once per run, and log in with Internet Identity to submit scores and view a leaderboard.
