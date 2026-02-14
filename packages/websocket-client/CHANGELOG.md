# Changelog

## [0.1.0] - 2026-02-14

### Added
- Monorepo migration.
- Improved missed event handler.
- Annotated options

### Changed
- Renamed `minRetryTime` option to `minReconnectTime`.
- Renamed `maxRetryTime` option to `maxReconnectTime`.
- Renamed `maxFails` option to `maxReconnectFails`.
- Renamed `jitterRange` option to `reconnectJitterRange`.
- Renamed `clientPingInterval` option to `pingInterval`.
- Renamed `wsCreator` option to `wsConstructor`.
- Renamed `resetCount` option to `resetSequenceOnClose`.
- Renamed `CLIENT_PING_TIMEOUT_ERR_CODE` constant to `PING_TIMEOUT_ERROR_CODE`.
- Renamed `CLIENT_SEQUENCE_MISMATCH_ERR_CODE` constant to `SEQUENCE_MISMATCH_ERROR_CODE`.
