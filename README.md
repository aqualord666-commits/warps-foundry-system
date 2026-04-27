# WARPS System

WARPS System is a custom tabletop RPG system for Foundry Virtual Tabletop.

This project is currently in an early playable prototype stage. The core character data model, a custom V2 character sheet, and the first resource rules are already implemented. The system is still growing, so some planned gameplay features such as rolls, items, combat automation, and progression logic are not finished yet.

## Current Status

The current build includes:

- A custom `character` Actor type
- A custom V2 character sheet
- Editable core stats
- Editable resources
- Editable progression point pools
- Automatic HP and EFF bounds
- English and Russian localization files

## Requirements

- Foundry Virtual Tabletop v13

## Installation

At the moment WARPS is intended for local development and manual installation.

1. Open your Foundry user data folder.
2. Go to `Data/systems/`.
3. Place the `warps` folder there.
4. Restart Foundry VTT.
5. Enable the system when creating or launching a world.

Example path on Windows:

```text
C:\Users\<YourUser>\AppData\Local\FoundryVTT\Data\systems\warps
```

## Creating a Character

1. Open the Actors directory in Foundry.
2. Create a new Actor.
3. Choose the `character` type.
4. Open the actor sheet.
5. Fill in the character name, stats, resources, and progression values.

The WARPS character sheet supports window resizing and vertical scrolling if the content does not fit in the visible area.

## Character Sheet Overview

The current character sheet has three main sections:

### 1. Stats

The following base stats are currently available:

- `STR` — Strength
- `FOC` — Focus
- `REF` — Reflex
- `PER` — Perception
- `INT` — Intellect
- `DEX` — Dexterity
- `END` — Endurance

Rules at the data level:

- Stats are integers
- Stats cannot go below `0`
- Stats can be edited directly on the sheet

### 2. Resources

The system currently uses two resources:

- `HP`
- `EFF`

#### HP

HP is the only value that may become negative.

Current HP rules:

- `HP max = STR * 5`
- `HP min = -STR * 5`
- A newly created character starts with current HP equal to max HP
- Current HP is clamped between minimum and maximum values

#### EFF

EFF is a resource tied to Endurance.

Current EFF rules:

- `EFF min = 0`
- `EFF max = END`
- Current EFF is clamped between `0` and `END`

### 3. Progression

The sheet currently includes three progression point pools for future character advancement:

- Universal Points
- Combat Points
- Narrative Points

At the moment these values are editable and stored on the character sheet, but no automated spending or level-up rules are implemented yet.

## What Is Automated Right Now

The following values are automatically recalculated by the system:

- `HP min`
- `HP max`
- `HP current`
- `EFF min`
- `EFF max`
- `EFF current`

This recalculation happens whenever the actor data is prepared by Foundry.

## What Is Not Implemented Yet

The following systems are planned but not yet available:

- Dice rolling
- Stat checks
- Initiative logic
- Item sheets and inventory
- Combat actions
- Skills
- Derived stat modifiers
- Advancement rules
- NPC sheets
- Automation for progression point spending

## Project Structure

Important files in the current prototype:

- `system.json` — system manifest and Foundry metadata
- `module/main.js` — data model, derived rules, and sheet registration
- `templates/actor/character-sheet.hbs` — character sheet template
- `styles/main.css` — character sheet styling
- `lang/en.json` — English localization
- `lang/ru.json` — Russian localization

## User Notes

- The custom WARPS sheet is registered as the default sheet for `character` actors.
- The sheet uses Foundry V13's newer V2 application framework.
- Read-only values such as HP min/max and EFF min/max are shown on the sheet for convenience but are derived from the base data.
- If a stat changes, related resource bounds update automatically.

## Developer Notes

WARPS is currently designed around a clean separation between:

- Base actor data
- Derived resource rules
- Sheet rendering
- Localization

This makes it easier to expand the system later with:

- roll formulas
- combat actions
- inventory
- advancement systems
- more actor or item types

## Roadmap

Planned development steps:

1. Expand the character sheet UI
2. Add derived stat modifiers
3. Add basic roll mechanics
4. Add initiative and combat foundations
5. Add items and equipment
6. Add progression rules
7. Add NPC support
8. Improve presentation and documentation

## License / Usage

No formal license has been added yet.

Until a license is explicitly included, treat this repository as a personal project under active development.
