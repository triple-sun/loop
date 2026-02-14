# Changelog

## [0.1.0] - 2026-02-14

### Added
- **Monorepo**: Migration to monorepo structure.
- **Client**: Renamed `WebClient` to `LoopClient` and improved its structure.
- **Client**: Added more comprehensive unit, integration, and fuzz tests.
- **WebSocket Client**: Improved missed event handler and annotated options.

### Changed
- **Client**: Renamed `WebClient` to `LoopClient`.
- **Client**: Major refactor of internals for better maintainability and type safety.
- **WebSocket Client**: Renamed various options for clarity (e.g., `minRetryTime` -> `minReconnectTime`).
