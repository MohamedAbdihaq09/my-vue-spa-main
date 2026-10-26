# Tasks

## 1. Shared language state and navigation

- [x] 1.1 Add a shared reactive locale with English as the default and translation dictionaries for English, Danish, and Spanish; verify the app builds with `npm run build`.
- [x] 1.2 Add an accessible language switcher to the shared museum header and localize its primary navigation labels; verify switching languages updates navigation in place without losing the current route.

## 2. Museum map localization

- [x] 2.1 Resolve collection-zone names and map labels from the active locale using stable place IDs; verify each zone displays the selected language on the floor plan and detail card.
- [x] 2.2 Localize map destination turn-by-turn instructions; verify changing language with a place selected updates its ordered directions without changing the selection or map URL.

## 3. Artwork and room wayfinder localization

- [x] 3.1 Resolve wayfinder zone labels and destination direction steps from the active locale; verify directions update in place while retaining the selected destination and step order.
- [x] 3.2 Run an integration smoke check on both wayfinding routes in English, Danish, and Spanish and run `npm run build`; confirm the language switch causes no reload and preserves the current selection.
