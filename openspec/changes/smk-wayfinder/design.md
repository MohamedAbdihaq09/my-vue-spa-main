# Design

## Context

The app currently has a quote route and no shared museum navigation. See `proposal.md` for motivation and `specs/museum-wayfinding/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**
- Make the map, destination search, and visitor utilities reachable from a shared responsive museum shell.
- Keep visitor-facing content maintainable as local data without adding dependencies or backend services.
- Use accessible controls, clear selection states, and the requested SMK-inspired palette.

**Non-Goals:**
- Provide a surveyed, geospatially accurate interactive floor plan or live indoor positioning.
- Claim live opening status, accessibility routing, or emergency-service functionality.

## Decisions

- Use Vue 3 Options API single-file components and Vue Router. The root route presents zone selection, `/find` presents destination search and directions, and `/quote` remains available.
- Keep the zone, facility, and highlight directory local to the relevant views. This supports a working prototype without a service or store.
- Present route steps as indicative prototype guidance from the entrance, with a visible notice to verify directions against museum signage or staff. Accurate floor plans and room numbering were not provided and must not be implied.
- Link opening-hours and audio-guide utilities to the museum's official visitor information instead of hard-coding potentially stale schedules or guide availability.
- Use native links and buttons with focus states, semantic headings, and responsive CSS rather than adding a map or component library.

## Risks / Trade-offs

- [Indicative directions can differ from the current gallery layout] → Label prototype directions clearly and defer authoritative room routes until verified floor-plan data is available.
- [External museum links can change] → Keep them centralized in the utility component and use official SMK pages.
- [The static destination list is limited] → Make its data structure easy to extend when a verified directory becomes available.

## Migration Plan

Replace the starter root screen with the museum shell, add the wayfinding routes and views, and retain the existing quote route. No data migration or deployment coordination is required.
