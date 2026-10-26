# Spec Delta

## Purpose

Lets SMK visitors use the wayfinder's navigation, collection zones, and route directions in English, Danish, or Spanish through an in-page language switcher.

## ADDED Requirements

### Requirement: Switch the wayfinder language
The wayfinder MUST let visitors choose English, Danish, or Spanish and apply the selection immediately without a page reload.

#### Scenario: Change the selected language
- **WHEN** a visitor chooses another supported language
- **THEN** localized content updates in place and the current view and destination selection remain intact

### Requirement: Localize navigation and museum zones
The wayfinder MUST show primary navigation labels and museum zone names in the selected language.

#### Scenario: View navigation and zones in another language
- **WHEN** a visitor selects Danish or Spanish
- **THEN** primary navigation labels and collection-zone names are shown in that language

### Requirement: Localize turn-by-turn directions
The wayfinder MUST show destination direction steps in the selected language.

#### Scenario: View route directions in another language
- **WHEN** a visitor selects a destination while Danish or Spanish is active
- **THEN** its ordered turn-by-turn instructions are shown in that language

#### Scenario: Change language while directions are visible
- **WHEN** a visitor changes language while viewing destination directions
- **THEN** the directions update to the selected language without changing their order or destination
