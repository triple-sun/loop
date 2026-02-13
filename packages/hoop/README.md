# 🏀 Hoop

[🇷🇺 Читать на русском](./README.ru.md)


TypeScript SDK for Loop/Mattermost API integrations with powerful builders and factories


## 📦 Installation

```bash
npm install @triple-sun/hoop
# or
pnpm add @triple-sun/hoop
# or
yarn add @triple-sun/hoop
```

## 🎯 What is it?

Hoop gives you type-safe builders and factories for creating Loop (or Mattermost) API objects like posts, forms, dialogs, and buttons. Built on `loop-client`, it makes working with the API simple and fluent.

## ✨ Features

- **🏗️ Builder Pattern** - Chain methods to build complex objects easily
- **🏭 Factory Functions** - Shortcuts for common UI patterns
- **📘 Full TypeScript Support** - Get complete type safety and IntelliSense
- **🎨 Interactive Messages** - Create buttons, forms, and dialogs with valid types
- **🔗 Based on loop-client** - Inherits all core functionality transparently

## 🚀 Quick Start

```typescript
import { HoopFactory, ActionFactory } from '@triple-sun/hoop';

// Create a post with attachments and interactive buttons
const post = HoopFactory.Post()
  .set('message', 'Choose an action:')
  .attachments.append({
    text: 'Click a button below',
    actions: [
      ActionFactory.Button({ name: 'approve', integration: { url: 'https://some.url/approve' } }),
      ActionFactory.Button({ name: 'reject', integration: { url: 'https://some.url/reject' } })
    ]
  })
  .build();
```

## 📚 Core Components

### Builders

Builders provide a fluent interface for creating complex objects:

- **PostBuilder** - Create and modify posts with attachments, actions, and fields ([detailed guide](./docs/POST_BUILDER.md))
- **FormBuilder** - Build interactive forms ([detailed guide](./docs/FORM_BUILDER.md))
- **DialogBuilder** - Create modal dialogs ([detailed guide](./docs/DIALOG_BUILDER.md))
- **AppBindingBuilder** - Configure app bindings and integrations
- **AttachmentBuilder** - Manage post attachments

### Factories

Factories offer quick shortcuts for common patterns:

- **ActionFactory** - Create buttons and select menus
- **AttachmentFactory** - Generate post attachments
- **BindingFactory** - Configure app bindings
- **FormFieldFactory** - Build form fields
- **DialogElementFactory** - Create dialog elements

## 🔨 Examples

### Creating an Interactive Post

```typescript
import { HoopFactory, ActionFactory } from '@triple-sun/hoop';

const post = HoopFactory.Post()
  .set('message', 'Survey Question')
  .attachments.append({
    title: 'How satisfied are you?',
    text: 'Please select your rating',
    actions: [
      ActionFactory.Select.Static({
        name: 'rating',
        integration: { url: 'https://some.url/submit-rating' },
        options: [
          { text: 'Very Satisfied', value: '5' },
          { text: 'Satisfied', value: '4' },
          { text: 'Neutral', value: '3' },
          { text: 'Unsatisfied', value: '2' }
        ]
      })
    ]
  })
  .build();
```

### Building a Form

```typescript
import { HoopFactory } from '@triple-sun/hoop';

const form = HoopFactory.Form()
  .set('title', 'User Registration')
  .fields.append(
    { type: 'text', name: 'username', display_name: 'Username' },
    { type: 'text', name: 'email', display_name: 'Email', subtype: 'email' }
  )
  .build();
```

### Working with Attachments

```typescript
const post = HoopFactory.Post()
  .set('message', 'Status Report')
  .attachments.append({
    color: '#00FF00',
    title: 'Build Successful',
    fields: [
      { title: 'Duration', value: '2m 34s', short: true },
      { title: 'Tests', value: '142 passed', short: true }
    ]
  })
  .build();
```

## 🌐 Localization

Hoop supports English and Russian locales for default labels (like "Submit", "Dialog", etc.). The default is Russian (`ru`).

You can switch the locale using `setLocale`:

```typescript
import { setLocale } from '@triple-sun/hoop';

setLocale('en'); // Switch to English defaults
```

## 🧪 Development

```bash
# Run tests
npm test

# Build the project
npm run build

# Format code
npm run format

# Lint code
npm run check
```

## 📄 License

MIT
