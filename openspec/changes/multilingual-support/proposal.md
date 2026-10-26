# Proposal

## Why

SMK visitors who prefer Danish or Spanish cannot currently use the wayfinder in those languages. A client-side language switcher will make navigation, museum zones, and route instructions accessible in English, Danish, and Spanish without interrupting the visitor's current view.

## What Changes

- Add a shared client-side language state and a visible switcher for English, Danish, and Spanish.
- Translate primary navigation labels, museum zone labels, and turn-by-turn directions according to the selected language.
- Update those labels and instructions immediately when the visitor changes language, without reloading or losing the current selection.

## Capabilities

### New Capabilities

- `multilingual-wayfinding`: Switch the wayfinder's navigation, museum zones, and directions between English, Danish, and Spanish.

### Modified Capabilities

None.

## Impact

- Vue shell and wayfinding views under `src/components/` and `src/views/`.
- A shared Vue language state/store and translation data, with no new dependency or external service.
- No route or URL changes; other interface copy outside the listed surfaces remains unchanged.
