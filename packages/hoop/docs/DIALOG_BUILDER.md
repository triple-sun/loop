# Dialog Builder Guide

`DialogBuilder` simplifies creating interactive modal dialogs for Loop/Mattermost integrations (primarily for plugins and incoming webhooks).

## Quick Example

```typescript
import { HoopFactory, DialogElementFactory } from '@triple-sun/hoop';

const dialog = HoopFactory.Dialog({
    callback_id: 'survey_dialog',
    title: 'Employee Survey',
    submit_label: 'Submit'
  })
  .state.set({ userId: '123' })
  .elements.append(
    DialogElementFactory.Text({ name: 'name', display_name: 'Name' }),
    DialogElementFactory.Select.Static({
      name: 'satisfaction',
      display_name: 'Satisfaction',
      options: [
        { text: 'Happy', value: 'happy' },
        { text: 'Sad', value: 'sad' }
      ]
    })
  )
  .build();
```

## Core Builder: DialogBuilder

Start with `HoopFactory.Dialog()`.

### Basic Properties

Set properties directly in the constructor or use `set()`:

```typescript
const dialog = HoopFactory.Dialog({
    callback_id: 'my-dialog-id',
    title: 'Bug Report',
    intro_text: 'Please fill out the form below',
    icon_url: 'https://example.com/icon.png',
    notify_on_cancel: true
  })
  .set('submit_label', 'Report Issue');
```

### State Management

Pass data through the dialog lifecycle using the `state` property. It handles JSON serialization for you.

```typescript
// Set state (overwrites existing)
dialog.state.set({ ticketId: 456, step: 1 });

// Add to state (merges with existing)
dialog.state.add({ timestamp: Date.now() });
```

## Elements

Add elements using `DialogElementFactory`.

### Text Inputs

```typescript
// Single line text
DialogElementFactory.Text({ 
  name: 'email', 
  display_name: 'Email Address', 
  subtype: 'email',
  placeholder: 'user@example.com' 
});

// Multi-line text area
DialogElementFactory.TextArea({ 
  name: 'description', 
  display_name: 'Description', 
  max_length: 500 
});
```

### Select Menus

```typescript
// Static options
DialogElementFactory.Select.Static({
  name: 'priority',
  display_name: 'Priority',
  options: [
    { text: 'High', value: 'high' },
    { text: 'Low', value: 'low' }
  ]
});

// Dynamic users/channels
DialogElementFactory.Select.Users({ name: 'assignee', display_name: 'Assign To' });
DialogElementFactory.Select.Channels({ name: 'channel', display_name: 'Channel' });
```

### Checkbox & Radio

```typescript
// Checkbox
DialogElementFactory.Checkbox({ 
  name: 'agree', 
  display_name: 'I agree to the terms',
  optional: false 
});

// Radio buttons
DialogElementFactory.Radio({
  name: 'department',
  display_name: 'Department',
  options: [
    { text: 'Engineering', value: 'eng' },
    { text: 'Sales', value: 'sales' }
  ]
});
```

## See Also

- [Mattermost Interactive Dialogs](https://developers.mattermost.com/integrate/plugins/interactive-dialogs/)
- Main [README](./README.md)
