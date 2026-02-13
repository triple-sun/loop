# Loop Monorepo

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)

[🇺🇸 English](./README.md)

Это *неофициальный* монорепозиторий с TypeScript экосистемой для [Loop](https://loop.ru) (и как следстувие - [Mattermost](https://mattermost.com)).

## Пакеты

| Пакет | Описание | Версия |
|---|---|---|
| [`loop-client`](./packages/client) | Основной инструмент. HTTP клиент: надежный и типизированный. | [![npm](https://img.shields.io/npm/v/loop-client)](https://www.npmjs.com/package/loop-client) |
| [`loop-ws-client`](./packages/websocket-client) | WebSocket клиент для событий. | [![npm](https://img.shields.io/npm/v/loop-ws-client)](https://www.npmjs.com/package/loop-ws-client) |
| [`@triple-sun/hoop`](./packages/hoop) | Высокоуровневый SDK. Билдеры, фабрики для сообщений, кнопок и т.д. | [![npm](https://img.shields.io/npm/v/@triple-sun/hoop)](https://www.npmjs.com/package/@triple-sun/hoop) |
| [`loop-types`](./packages/types) | Общие типы. | [![npm](https://img.shields.io/npm/v/loop-types)](https://www.npmjs.com/package/loop-types) |

## С чего начать

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

Подробные примеры использования можно найти в README конкретных пакетов.

## Разработка

Мы используем `pnpm` workspaces.

1. Клонируем: `git clone https://github.com/triple-sun/loop.git`
2. Ставим зависимости: `pnpm install`
3. Собираем: `pnpm build`

## Контрибьютинг

PR и фича реквесты приветствуются. Правила если пишете код:

- Соблюдать кодстайл
- Писать тесты
- Не ломать то, что уже работает

## Лицензия

ISC. Делайте что хотите, только лицензию оставьте.
