# loop-ws-client

Простой и надежный WebSocket клиент для Loop/Mattermost на TypeScript.

[In English](./README.md)

## Что он умеет?

- Автоматический (реально работающий) реконнект
- Обработка пропущенных сообщений с автоматической синхронизацией
- Полная типизация в комплекте
- Работает и в браузере, и в node

## Как использовать?

Ставим:

```bash
npm install loop-ws-client
```

Пишем код:

```typescript
import { WebSocketClient } from 'loop-ws-client';

const client = new WebSocketClient({
    url: 'wss://your-loop.loop.ru/api/v4/websocket',
    token: 'your-auth-token'
});

// Подключаемся
client.init();

// Добавляем обработчики
client.listeners.message.add((msg) => console.log('Пришло сообщение:', msg));
client.listeners.firstConnect.add(() => console.log('Мы в эфире!'));
client.listeners.reconnect.add(() => console.log('Снова с вами!'));
client.listeners.close.add((failCount) => console.log(`Связь потеряна. Попыток восстановить: ${failCount}`));

// Отправляем события
client.update.presence.thread(true, 'channel_id', 'parent_id');
client.update.userActiveStatus(true, true);
client.send.notifyAck('post_id', 'status');
```

## Контрибьютинг

PR и фича-реквесты приветствуются.
