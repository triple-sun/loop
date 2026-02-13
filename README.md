# Loop Monorepo

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)

[🇷🇺 По-русски](./README.ru.md)

Welcome. This monorepo hosts the *unofficial* TypeScript ecosystem for [Loop](https://loop.ru) (and by extension [Mattermost](https://mattermost.com)).
Whether you're crafting a bot, an integration, or a full-blown client, we've got the tools.

## Packages

| Package | Description | Version |
|---|---|---|
| [`loop-client`](./packages/client) | The heavy lifter. HTTP client, robust, tested, strongly typed. | [![npm](https://img.shields.io/npm/v/loop-client)](https://www.npmjs.com/package/loop-client) |
| [`loop-ws-client`](./packages/websocket-client) | WebSocket client for events. | [![npm](https://img.shields.io/npm/v/loop-ws-client)](https://www.npmjs.com/package/loop-ws-client) |
| [`@triple-sun/hoop`](./packages/hoop) | High-level SDK. Builders and factories for posts, buttons, etc.. | [![npm](https://img.shields.io/npm/v/@triple-sun/hoop)](https://www.npmjs.com/package/@triple-sun/hoop) |
| [`loop-types`](./packages/types) | Shared definitions. | [![npm](https://img.shields.io/npm/v/loop-types)](https://www.npmjs.com/package/loop-types) |

## Getting Started

Pick what you need.

```bash
npm i loop-client
```
```bash
npm i loop-ws-client
```
```bash
npm i @triple-sun/hoop
```
```bash
npm i loop-types -D
```

Check out individual package READMEs for usage examples.

## Development

We use `pnpm` workspaces.

1. Clone: `git clone https://github.com/triple-sun/loop.git`
2. Install: `pnpm install`
3. Build: `pnpm build`

## Contributing

PRs are welcome. Please:
- Follow the code style (we use Biome).
- Write tests.
- Don't break existing stuff.

## License

ISC. Do whatever, just keep the license.
