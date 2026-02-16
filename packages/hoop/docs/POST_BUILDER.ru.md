# Гайд по Post Builder

`PostBuilder` — основной инструмент для создания постов в Loop/Mattermost.

## Быстрый пример

```typescript
import { HoopFactory, ActionFactory } from '@triple-sun/hoop';

const post = HoopFactory.Post()
  .set('message', 'Привет, команда!')
  .attachments.append({
    title: 'Опрос',
    text: 'Оцените ваш опыт',
    color: '#00C853',
    actions: [
      ActionFactory.Button({ name: 'Хорошо', integration: { url: '/api/vote' } }),
      ActionFactory.Button({ name: 'Плохо', integration: { url: '/api/vote' } })
    ]
  })
  .build();
```

## Основной билдер: PostBuilder

Главный конструктор для создания постов. Доступен через `HoopFactory.Post()`.

### Простые свойства

Настройка базовых полей через `set()`:

```typescript
const post = HoopFactory.Post()
  .set('message', 'Всем привет')
  .set('channel_id', 'abc123')
  .set('root_id', 'def456')  // для ответов в тред
  .build();
```

### Метаданные

Прикрепление типизированных метаданных напрямую:

```typescript
interface MyMetadata {
  taskId: number;
  priority: 'high' | 'low';
}

const post = HoopFactory.Post()
  .set('message', 'Уведомление о задаче')
  .metadata.add<MyMetadata>({ taskId: 42, priority: 'high' })
  .build();
```

### Подготовка для API

Сборка в формат, нужный для методов клиента:

```typescript
const createArgs = builder.buildToCreate('channel', 'channel-id-123');
const updateArgs = builder.buildToUpdate('post-id-456');
```

## Вложения (Attachments)

### Простые вложения

```typescript
const post = HoopFactory.Post()
  .attachments.append({
    color: '#FF5722',
    title: 'Сборка не удалась',
    text: 'Проверьте логи для деталей',
    title_link: 'https://ci.example.com/build/123'
  })
  .build();
```

### С полями

Короткие (`short: true`) поля отображаются по 2 на строку:

```typescript
const post = HoopFactory.Post()
  .attachments.append({
    title: 'Статус деплоя',
    fields: [
      { title: 'Environment', value: 'Production', short: true },
      { title: 'Version', value: 'v2.3.1', short: true },
      { title: 'Duration', value: '3m 12s', short: true },
      { title: 'Status', value: '✅ Success', short: true }
    ]
  })
  .build();
```

### Изменение вложений

```typescript
// Обновить первое вложение
builder.attachments.update('color', '#00FF00', 0);

// Добавить еще вложений
builder.attachments.append({ text: 'Еще одно' });

// Отфильтровать вложения
builder.attachments.filter(at => at.get('color') !== '#FF0000');

// Очистить все
builder.attachments.clear();
```

## Действия (Actions)

Добавление интерактивности с помощью кнопок и меню.

### Кнопки

```typescript
import { ActionFactory } from '@triple-sun/hoop';

const post = HoopFactory.Post()
  .attachments.append({
    text: 'Одобрить этот запрос?',
    actions: [
      ActionFactory.Button({
        name: 'approve',
        integration: { url: 'https://api.example.com/approve', context: { id: 123 } }
      }),
      ActionFactory.Button({
        name: 'reject',
        style: 'danger',
        integration: { url: 'https://api.example.com/reject' }
      })
    ]
  })
  .build();
```

### Выпадающие списки (Select Menus)

Статические опции:

```typescript
ActionFactory.Select.Static({
  name: 'priority',
  integration: { url: '/api/set-priority' },
  options: [
    { text: 'High', value: 'high' },
    { text: 'Medium', value: 'medium' },
    { text: 'Low', value: 'low' }
  ]
})
```

Динамические опции (пользователи/каналы):

```typescript
// Выбор пользователя
ActionFactory.Select.Users({
  name: 'assignee',
  integration: { url: '/api/assign' }
})

// Выбор канала
ActionFactory.Select.Channels({
  name: 'channel',
  integration: { url: '/api/move' }
})
```

### Управление действиями

```typescript
// Добавить действие в первое вложение
builder.actions.append(0, ActionFactory.Button({ name: 'ok' }));

// Обновить свойство действия
builder.actions.update('name', 'updated-name', 0);

// Задать все действия
builder.actions.set(0, 
  ActionFactory.Button({ name: 'yes' }),
  ActionFactory.Button({ name: 'no' })
);

// Очистить действия
builder.actions.clear(0);

// Получить все действия со всех вложений
const allActions = builder.getAllActions();
```

## Поля (Fields)

Отображение данных парами "название-текст".

### Базовое использование

```typescript
builder.fields.append(0, 
  { title: 'Status', value: 'Active', short: true },
  { title: 'Owner', value: '@johndoe', short: true }
);
```

### Операции с полями

```typescript
// Обновить поле
builder.fields.update('value', 'Updated', 0, 0);

// Фильтрация полей
builder.fields.filter(0, field => field.get('short') === true);

// Получить все поля
const allFields = builder.getAllFields();
```

## App Bindings

Использование bindings в постах.

```typescript
import { BindingFactory } from '@triple-sun/hoop';

const post = HoopFactory.Post()
  .bindings.append(
    BindingFactory.AppBinding({
      app_id: 'my-app',
      location: 'in_post',
      bindings: [
        BindingFactory.Binding({
          location: 'action-button',
          label: 'Custom Action',
          submit: { url: 'https://some-api.com/api/action' }
        })
      ]
    })
  )
  .build();
```

## Связанные билдеры

### PostPropsBuilder

Управляет свойствами поста (метаданные, вложения, привязки). Обычно используется через `PostBuilder`, а не напрямую.

```typescript
// Доступ через post.props
builder.update('from_bot', 'true');
```

### AttachmentBuilder

Управляет отдельными вложениями. Создается автоматически при добавлении вложений.

```typescript
// Обычно создается через attachments.append(), но можно использовать и отдельно:
import { AttachmentBuilder } from '@triple-sun/hoop';

const attachment = new AttachmentBuilder({ title: 'Test' })
  .set('color', '#123456')
  .build();
```

### ActionBuilder

Обертка для действий (Actions). Используйте `ActionFactory` вместо прямого создания.

### FieldBuilder

Обертка для полей вложений. Редко используется напрямую — рекомендуется передавать обычные объекты.

## Продвинутое использование: Finders

Большинство методов, принимающих индекс (например, `.update`, `.filter`, `.set` для вложений/действий/полей), также принимают функцию-поисковик (finder).

### Функциональные поисковики

Вместо жестко заданных индексов можно искать элементы динамически:

```typescript
// Обновить вложение с определенным заголовком
builder.attachments.update(
  'color', 
  '#FF0000', 
  at => at.get('title') === 'Error Log'
);

// Обновить поле в конкретном вложении
builder.fields.update(
  'value', 
  'Fixed', 
  at => at.get('title') === 'Status', // найти вложение
  field => field.get('title') === 'Bug #123' // найти поле
);

// Добавить кнопку к определенному вложению
builder.actions.append(
  at => at.get('text').includes('Approve'),
  ActionFactory.Button({ name: 'Confirm' })
);
```

## Примеры

### Посты с несколькими вложениями

```typescript
const report = HoopFactory.Post()
  .set('message', '📊 Ежедневный отчет')
  .attachments.append(
    {
      color: '#4CAF50',
      title: '✅ Успех',
      fields: [
        { title: 'Tests Passed', value: '142', short: true },
        { title: 'Coverage', value: '94%', short: true }
      ]
    },
    {
      color: '#F44336',
      title: '❌ Ошибки',
      fields: [
        { title: 'Tests Failed', value: '3', short: true },
        { title: 'Critical', value: '1', short: true }
      ]
    }
  )
  .build();
```

### Назначение действий в зависимости от условий

```typescript
const actions = [
  ActionFactory.Button({ name: 'view', integration: { url: '/view' } })
];

if (userCanEdit) {
  actions.push(ActionFactory.Button({ name: 'edit', integration: { url: '/edit' } }));
}

if (userCanDelete) {
  actions.push(
    ActionFactory.Button({ 
      name: 'delete', 
      style: 'danger',
      integration: { url: '/delete' } 
    })
  );
}

const post = HoopFactory.Post()
  .attachments.append({ text: 'Детали элемента', actions })
  .build();
```

### Обновление существующих постов

**__ВНИМАНИЕ!__** По умолчанию Loop не отдает параметр integration т.к. там могут быть чувствительные данные.

```typescript
// Загружаем билдер из существующего поста
const builder = HoopFactory.Post(existingPost);

// Меняем и пересобираем
builder
  .set('message', 'Обновленное сообщение')
  .attachments.update('color', '#FFD700', 0);

// Отправляем обновление
await client.posts.update(postId, builder.buildToUpdateArgs(postId));
```

## Советы

- **Цвета**: Можно использовать enum `AppPostAttachmentColor` или hex-коды (например, `#FF5722`) для цветов вложений.
- **Markdown**: Текст постов и вложений поддерживает разметку Markdown.
- **Fallback**: Для вложений автоматически генерируется текстовая версия (fallback) для уведомлений.
- **Контекст**: Добавление данных в `context` позволяет передавать контекст в интеграции.
- **Неизменяемость**: `build()` возвращает "замороженные" объекты — их безопасно передавать куда угодно.
- **Цепочки вызовов**: Все методы билдера возвращают `this` для удобного чейнинга.

## См. также

- [Mattermost Message Attachments](https://developers.mattermost.com/integrate/reference/message-attachments/)
- [Mattermost Interactive Messages](https://developers.mattermost.com/integrate/plugins/interactive-messages/)
- Главный [README](./README.md) для установки и обзора
