# loop-ws-client

Simple, robust TypeScript WebSocket client for Loop/Mattermost.

[По-русски](./README.ru.md)

## What's inside?

- Automatic reconnects with jitter (because thundering herds are bad)
- Handling of missed messages (syncs automagically)
- Typed events for your pleasure
- Compatible both with node and browser environments

## Usage

Grab it:

```bash
npm install loop-ws-client
```

Or via pnpm

```bash
pnpm install loop-ws-client
```

Or via yarn

```bash
yarn add loop-ws-client
```

Or via bun

```bash
bun add loop-ws-client
```

Use it:

```typescript
import { WebSocketClient } from 'loop-ws-client';

const client = new WebSocketClient({
    url: 'wss://your-loop.loop.ru/api/v4/websocket',
    token: 'your-auth-token'
});

// Connect
client.init();

// Add listeners
client.listeners.message.add((msg) => console.log('Got message:', msg));
client.listeners.firstConnect.add(() => console.log('We are live!'));
client.listeners.reconnect.add(() => console.log('And we are back!'));
client.listeners.close.add((failCount) => console.log(`Connection died. Fail count: ${failCount}`));

// Send updates
client.update.presence.thread(true, 'channel_id', 'parent_id');
client.update.userActiveStatus(true, true);
client.send.notifyAck('post_id', 'status', 'reason');
```

## Contributing

PRs and feature requests are welcome. Don't break the build.