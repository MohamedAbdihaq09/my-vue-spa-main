# Proposal

## Why

Tourists visiting Statens Museum for Kunst need a clear, approachable way to orient themselves, find collection highlights, and locate essential visitor facilities. A responsive wayfinding SPA can make these tasks easier while reflecting SMK's calm, Scandinavian visual identity.

## What Changes

- Replace the starter experience with a museum wayfinding helper.
- Add an interactive zone selector for the European Art 1300–1800, Danish Golden Age, and Modern Art areas, plus lockers, café, and restrooms.
- Add search and selection for featured artworks and rooms, with turn-by-turn directions from the entrance.
- Provide a persistent visitor utility bar for opening hours, audio guides, and facility shortcuts.
- Configure Vue Router for the wayfinding views and preserve `/quote` as an existing route.
- Apply the SMK-inspired copper, charcoal, and soft-sand palette with responsive layouts.

## Capabilities

### New Capabilities
- `museum-wayfinding`: Helping visitors explore museum zones and facilities, find collection highlights, and access visitor utilities.

### Modified Capabilities

## Impact

- Vue 3 Options API views and reusable wayfinding components under `src/`.
- Vue Router routes in `src/router/index.js`.
- Global and component styling in `src/style.css`.
- No new dependencies or external services.
