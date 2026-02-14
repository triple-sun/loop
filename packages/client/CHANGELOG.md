# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-02-14

### Changed
- **Documentation**: Updated `README.md` and `README.ru.md` examples to match `methods.ts` implementation.
- **Refactor**: Extracted types to `src/types.ts` and updated `LoopClient` to use them.

## [0.1.0] - 2026-02-14

### Added
- **Client**: Added `LoopClient` class (renamed from `WebClient`) with improved structure.
- **Testing**: Added more comprehensive unit, integration, and fuzz tests.

### Changed
- **Breaking**: Renamed `WebClient` to `LoopClient`.
- **Refactor**: Major refactor of internals for better maintainability and type safety.

## [0.0.18] - 2026-02-10

### Added
- **Users**: Added methods for managing user roles, status, and custom status.
- **Teams**: Added methods for managing user teams.
- **Documentation**: Added comprehensive `README.md` and `README.ru.md` with usage examples and configuration details.
- **Tests**: Added more unit tests and edge case coverage.

### Changed
- **Error Handling**: Improved error classification and handling in `LoopClient`.
- **Logger**: Enhanced logger configuration and output.
- **LoopClient**: Improved code readability and structure.
- **Metadata**: Removed application metadata.

## [0.0.18] - 2026-02-10

### Added
- **Users**: Added methods for managing user roles, status, and custom status.
- **Teams**: Added methods for managing user teams.
- **Documentation**: Added comprehensive `README.md` and `README.ru.md` with usage examples and configurations.
- **Tests**: Added instrument tests and improved coverage.

### Changed
- **Error Handling**: Improved error classification and handling in `LoopClient`.
- **Logger**: Enhanced logger configuration and output.
- **LoopClient**: Improved code readability and structure.
- **Metadata**: Removed application metadata.

## [0.0.17] - 2026-02-09

### Changed
- **Typings**: Improved types for apps and posts.

## [0.0.16] - 2026-02-09

### Changed
- **Typings**: Significant improvements to `apps`, `dialog`, and `posts` types.
- **Refactoring**: Added shared `common.ts` types.

## [0.0.15] - 2026-02-09

### Changed
- **Typings**: Massive overhaul of type definitions across multiple modules including `config`, `files`, `bots`, `plugins`, and `reports`.
- **Cleanup**: Removed unused and redundant type definitions.

## [0.0.14] - 2026-02-08

### Changed
- **Typings**: Expanded and improved types for `apps` and `dialogs`.

## [0.0.12] - 2026-02-08

### Added
- **Tests**: Added fuzzing tests for URL parameters and redaction.
- **Tests**: Added edge case tests for `LoopClient` and errors.
- **Tests**: Added logger tests.

### Fixed
- **Bugs**: Fixed various bugs in `LoopClient` and error handling.
- **Dependencies**: Removed `package-lock.json` in favor of `pnpm-lock.yaml`.

### Changed
- **Typings**: Improved types for `posts`, `apps`, and `dialogs`.
