# Гайд по Dialog Builder

`DialogBuilder` упрощает создание интерактивных модальных окон (диалогов) для Loop/Mattermost

## Базовый пример

```typescript
import { HoopFactory, DialogElementFactory } from '@triple-sun/hoop';

const dialog = HoopFactory.Dialog({
    callback_id: 'survey_dialog',
    title: 'Опрос сотрудников',
    submit_label: 'Отправить'
  })
  .state.set({ userId: '123' })
  .elements.append(
    DialogElementFactory.Text({ name: 'name', display_name: 'Имя' }),
    DialogElementFactory.Select.Static({
      name: 'satisfaction',
      display_name: 'Удовлетворенность',
      options: [
        { text: 'Счастлив', value: 'happy' },
        { text: 'Грущу', value: 'sad' }
      ]
    })
  )
  .build();
```

## Основной билдер: DialogBuilder

Точка входа: `HoopFactory.Dialog()`.

### Базовые параметры

Можно задать изначальные параметры прямо в конструкторе или через `set()`:

```typescript
const dialog = HoopFactory.Dialog({
    callback_id: 'my-dialog-id',
    title: 'Отчет о баге',
    intro_text: 'Заполните форму ниже',
    icon_url: 'https://example.com/icon.png',
    notify_on_cancel: true
  })
  .set('submit_label', 'Сообщить о проблеме');
```

### Управление состоянием (State)

Передача данных в `state` диалога. Автоматически сериализует JSON.

```typescript
// Задать состояние (перезаписывает существующее)
dialog.state.set({ ticketId: 456, step: 1 });

// Добавить в состояние (объединяет с существующим)
dialog.state.add({ timestamp: Date.now() });
```

## Элементы (Elements)

Создание элементов с использованием `DialogElementFactory`.

### Текстовые вводы

```typescript
// Однострочное поле
DialogElementFactory.Text({ 
  name: 'email', 
  display_name: 'Email адрес', 
  subtype: 'email',
  placeholder: 'user@example.com' 
});

// Многострочное текстовое поле
DialogElementFactory.TextArea({ 
  name: 'description', 
  display_name: 'Описание', 
  max_length: 500 
});
```

### Выпадающие списки (Select Menus)

```typescript
// Статические опции
DialogElementFactory.Select.Static({
  name: 'priority',
  display_name: 'Приоритет',
  options: [
    { text: 'Высокий', value: 'high' },
    { text: 'Низкий', value: 'low' }
  ]
});

// Динамические списки (user/channel)
DialogElementFactory.Select.Users({ name: 'assignee', display_name: 'Назначить на' });
DialogElementFactory.Select.Channels({ name: 'channel', display_name: 'Канал' });
```

### Чекбоксы и радио-кнопки

```typescript
// Чекбокс
DialogElementFactory.Checkbox({ 
  name: 'agree', 
  display_name: 'Беру все!',
  optional: true 
});

// Радио-кнопки
DialogElementFactory.Radio({
  name: 'department',
  display_name: 'Отдел',
  options: [
    { text: 'Разработка', value: 'dev' },
    { text: 'Продажи', value: 'sales' }
  ]
});
```

## См. также

- [Mattermost Interactive Dialogs](https://developers.mattermost.com/integrate/plugins/interactive-dialogs/)
- Главный [README](./README.md)
