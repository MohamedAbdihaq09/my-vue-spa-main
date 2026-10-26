# Tasks

## 1. Shared Museum Experience

- [x] 1.1 Replace the starter global styles with responsive SMK copper, charcoal, and soft-sand tokens; verify the production build and narrow-screen layout.
- [x] 1.2 Create a shared museum shell with navigation and an Options API visitor utility bar for official opening-hours/audio-guide links and facility shortcuts; verify links and facility selections work.

## 2. Zone and Facility Map

- [x] 2.1 Create an Options API museum map view with selectable collection zones and facility locations; verify each zone and facility can be selected and its location details appear.
- [x] 2.2 Add a clear prototype-map and signage verification notice; verify the notice is visible in the map view.
- [x] 2.3 Add a keyboard-accessible SVG floor plan for the museum's main levels with selectable highlighted rooms and turn-by-turn directions; verify level switching, room selection, keyboard activation, and directions.

## 3. Artwork and Room Wayfinder

- [x] 3.1 Create an Options API destination view with featured artwork/room data and text search; verify matching results and the no-results state.
- [x] 3.2 Show ordered directions from the entrance after a destination is selected; verify directions update with the selected destination and include the prototype guidance notice.

## 4. Routing and Integration

- [x] 4.1 Configure `/`, `/find`, and the preserved `/quote` routes and connect shared shell navigation; verify each route resolves to its intended view.
- [x] 4.2 Run `npm run build` and verify the museum views, navigation, and utility bar render without build errors.
