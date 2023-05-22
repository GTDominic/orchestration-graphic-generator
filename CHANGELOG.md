# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2023-05-22

## Added

- Custom Colors
- Color Picker

## [0.5.0] - 2023-05-22

### Added

- Register table overview

### Changed

- UI changes (download buttons moved and graphic fixed position)
- Conductor and Player Size as UI Setting
- UI setting for border by corner or player

### Fixed

- minimum Value for some settings
- Circle parts over 180° now rendered correctly
- String inputs now handle html characters (<>&, etc.) correctly

## [0.4.0] - 2023-05-20

### Added

- Header & Footer
- Row linking helpers

### Fixed

- Input Text now getting sanatized

## [0.3.0] - 2023-05-19

### Added

- JSON Export/Import
- SVG Export

### Changed

- Use of `G_settings` in classes
- SVG Styles from style.css to object in diagram_generator.ts

## [0.2.0] - 2023-05-17

### Changed

- UI Design changes

### Fixed

- Bug if debug was set to "true" and environment was set to "testing" or "production"

## [0.1.0] - 2023-05-16

### Added

- Orchestration Graphic Generator
    - Form
    - Graphic
