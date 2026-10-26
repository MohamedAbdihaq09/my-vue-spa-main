# Spec Delta

## Purpose

Helps visitors orient themselves inside Statens Museum for Kunst, locate collections and essential facilities, and find selected artworks and rooms through a responsive museum-branded interface.

## ADDED Requirements

### Requirement: Explore museum zones and facilities
The application MUST let visitors select a museum collection zone or key visitor facility and see its location information.

#### Scenario: Select a collection zone
- **WHEN** a visitor selects European Art 1300–1800, Danish Golden Age, or Modern Art
- **THEN** the application identifies the selected zone and shows its location information

#### Scenario: Select a visitor facility
- **WHEN** a visitor selects lockers, café, or restrooms
- **THEN** the application identifies the selected facility and shows its location information

### Requirement: Explore rooms on an interactive floor plan
The application MUST show selectable rooms on level-based schematic floor plans and highlight the selected room.

#### Scenario: Switch museum level
- **WHEN** a visitor selects a different museum level
- **THEN** the application displays that level's room plan and available destinations

#### Scenario: Select a room on the floor plan
- **WHEN** a visitor activates a room on the SVG plan
- **THEN** the application highlights the room and displays its destination details and ordered directions

#### Scenario: Use the floor plan with a keyboard
- **WHEN** a visitor focuses a room and presses Enter or Space
- **THEN** the application selects that room and displays its directions

### Requirement: Find artwork and room directions
The application MUST let visitors search or select featured artworks and rooms and show ordered directions starting from the museum entrance.

#### Scenario: Search for a highlight
- **WHEN** a visitor enters text matching a featured artwork or room
- **THEN** the application shows matching destinations that can be selected

#### Scenario: View destination directions
- **WHEN** a visitor selects a featured artwork or room
- **THEN** the application shows its destination and ordered turn-by-turn directions from the entrance

#### Scenario: No destination matches
- **WHEN** a visitor enters search text that matches no featured artwork or room
- **THEN** the application communicates that there are no matching destinations

### Requirement: Access visitor utilities
The application MUST provide quick access to museum opening-hours information, audio-guide information, and key facility destinations.

#### Scenario: Open visitor information
- **WHEN** a visitor activates opening-hours or audio-guide access
- **THEN** the application opens the corresponding museum information

#### Scenario: Navigate to a key facility
- **WHEN** a visitor activates a facility shortcut
- **THEN** the application shows that facility's location information

### Requirement: Responsive museum interface
The application MUST present the wayfinding features in a responsive interface using the museum's copper, charcoal, and soft-sand visual palette.

#### Scenario: Use wayfinding on a narrow screen
- **WHEN** a visitor opens a wayfinding view on a narrow viewport
- **THEN** the map choices, destination search, and visitor utilities remain available without horizontal page overflow
