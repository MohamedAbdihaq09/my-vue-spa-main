# Design

## Context

The app is currently the Vite starter and mounts a single root component. See `proposal.md` for motivation and `specs/quote-display/spec.md` for behavior.

## Goals / Non-Goals

**Goals:**
- Add a dedicated quote view and route using the existing Vue 3 and Vue Router dependencies.
- Keep the quote collection and random-selection state local to the view.

**Non-Goals:**
- Persist quotes, fetch them from a service, or add quote-management functionality.

## Decisions

- Use a Vue Options API single-file component with `data()` for the quote collection and current quote, and a method for random selection. This follows the requested API style without adding state-management dependencies.
- Register `/quote` in `src/router/index.js` and mount `RouterView` from the root app so the route renders in the SPA. No additional router dependency is needed because `vue-router` is already installed.

## Risks / Trade-offs

- The quote list is static and limited → Keep the content local as scoped; persistence and remote sourcing are out of scope.
