# Spec Delta

## Purpose

Provides a focused quote page where users can read a quote and request another one selected randomly from the available collection.

## ADDED Requirements

### Requirement: Display a quote
The application MUST provide a quote page that displays a quote from its available collection.

#### Scenario: Open the quote page
- **WHEN** the user navigates to `/quote`
- **THEN** the page displays a quote

### Requirement: Select another quote randomly
The application MUST let the user request another quote selected at random from its available collection.

#### Scenario: Request a random quote
- **WHEN** the user activates the random quote action
- **THEN** the page displays a quote selected from the available collection
