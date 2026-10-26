# Design

## Context

The SPA uses Vue 3 Options API components. Navigation text lives in `MuseumShell.vue`; museum zone data and map labels are hardcoded in `MuseumMapView.vue`; wayfinder destination data and directions are hardcoded in `WayfinderView.vue`. There is no current localization library or shared language state.

## Goals / Non-Goals

**Goals:**
- Keep one selected locale available to the shell and both wayfinding views.
- Store translations by stable language and destination/zone identifiers so changing locale does not alter selection or route state.
- Keep English as the default and avoid adding a dependency.

**Non-Goals:**
- Translate copy outside the navigation labels, museum zones, and turn-by-turn directions covered by the spec.
- Persist a visitor's locale across page reloads or browser sessions.
- Translate artwork titles, external SMK pages, or other third-party content.

## Decisions

- Add a small shared i18n module exporting a reactive locale and translation dictionaries. The existing Options API components can read the shared reactive locale and compute translated labels and directions without introducing a plugin or changing the router.
- Keep destination, zone, and room identifiers as the data keys; resolve their localized labels and instruction arrays from dictionaries. This avoids storing translated text as selection state and preserves the existing selected IDs and map query parameter when the locale changes.
- Put the language control in the shared museum header so visitors can switch languages from either wayfinding view. Use explicit language names and update text reactively in place.
- Default to English on startup. Since the request does not require persistence, do not write locale state to storage or the URL.
- Keep the current English strings as the English dictionary values; add Danish and Spanish equivalents for the specified surfaces. A language change must not mutate the order of direction steps or filter data against the active locale.
- Keep wayfinder search matching its existing canonical English destination data; localization changes displayed text, not search behavior.

## Risks / Trade-offs

- [Translation wording may not match SMK's preferred terminology] → Keep strings centralized by language and stable content ID so museum-approved wording can be revised without changing selection logic.
- [Visitors may search using a language other than English] → Search remains English-based and unchanged in this scope; preserve current results and selections when the locale changes.

## Migration Plan

No data migration is needed. Add the shared locale module, wire it into the shared shell and wayfinding views, then verify English defaults and switching between all three languages on both routes. Roll back by removing the locale module and restoring the existing English labels and strings.
