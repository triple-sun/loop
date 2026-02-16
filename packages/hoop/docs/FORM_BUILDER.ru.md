# Гайд по Form Builder

`FormBuilder` — это инструмент для создания форм для Loop/Mattermost app framework (AppForms).

## Базовый пример

```typescript
import { HoopFactory, FormFieldFactory } from '@triple-sun/hoop';

const form = HoopFactory.Form()
  .set('title', 'Обратная связь')
  .set('icon', '/static/icon.png')
  .fields.append(
    FormFieldFactory.Text.Input({ name: 'subject', label: 'Тема' }),
    FormFieldFactory.Text.TextArea({ name: 'description', label: 'Описание' })
  )
  .build();
```

## Основной билдер: Form

Точка входа: `HoopFactory.Form()`.

### Базовые свойства

Настройка заголовка, хедера и других элементов через `set()`:

```typescript
const form = HoopFactory.Form()
  .set('title', 'Отчет об ошибке')
  .set('header', 'Пожалуйста, опишите проблему')
  .set('footer', 'Спасибо за помощь!')
  .set('submit_buttons', 'Отправить отчет');
```

### Обработка событий

Определение того, что происходит при отправке формы или изменении полей:

```typescript
// Путь для обработки отправки формы
form.set('submit', { path: '/api/submit-bug' });

// Источник данных для динамических обновлений (refresh)
form.set('source', { path: '/api/form-update' });
```

## Поля (Fields)

Добавление полей с использованием `FormFieldFactory`.

### Текстовые поля

```typescript
// Обычное поле ввода
FormFieldFactory.Text.Input({ name: 'title', label: 'Заголовок' });

// Многострочное текстовое поле
FormFieldFactory.Text.TextArea({ name: 'details', label: 'Детали' });

// Специализированные вводы
FormFieldFactory.Text.Email({ name: 'email', label: 'Email для связи' });
FormFieldFactory.Text.Number({ name: 'count', label: 'Количество' });
FormFieldFactory.Text.Url({ name: 'website', label: 'Вебсайт' });
FormFieldFactory.Text.Telephone({ name: 'phone', label: 'Телефон' });
FormFieldFactory.Text.Password({ name: 'secret', label: 'Секретный ключ' });
```

### Выпадающие списки (Selects)

```typescript
// Статические опции
FormFieldFactory.Select.Static({
  name: 'priority',
  label: 'Приоритет',
  options: [
    { label: 'Высокий', value: 'high' },
    { label: 'Низкий', value: 'low' }
  ]
});

// Динамические списки пользователей/каналов
FormFieldFactory.Select.Users({ name: 'assignee', label: 'Назначить на' });
FormFieldFactory.Select.Channels({ name: 'channel', label: 'Опубликовать в' });

// Динамический внешний источник
FormFieldFactory.Select.Dynamic({ 
  name: 'external_item', 
  label: 'Поиск во внешней системе',
  lookup: { path: '/api/lookup' }
});
```

### Форматирование

```typescript
// Чекбокс (Boolean)
FormFieldFactory.Checkbox({ name: 'urgent', label: 'Срочно' });

// Markdown / Разделитель
FormFieldFactory.Markdown({ 
  name: 'note', 
  description: '**Примечание:** Поля, отмеченные *, обязательны.' 
});

FormFieldFactory.Divider('section-1');
```

## См. также

- [Mattermost Apps Forms](https://developers.mattermost.com/integrate/apps/reference/interactive-interfaces/#form)
- Главный [README](./README.md)
