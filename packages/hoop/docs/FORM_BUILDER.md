# Form Builder Guide

`FormBuilder` is your tool for creating valid Loop/Mattermost forms (AppForms). It manages the form structure, fields, and event bindings.

## Quick Example

```typescript
import { HoopFactory, FormFieldFactory } from '@triple-sun/hoop';

const form = HoopFactory.Form()
  .set('title', 'Feedback')
  .set('icon', '/static/icon.png')
  .fields.append(
    FormFieldFactory.Text.Input({ name: 'subject', label: 'Subject' }),
    FormFieldFactory.Text.TextArea({ name: 'description', label: 'Description' })
  )
  .build();
```

## Core Builder: FormBuilder

Start with `HoopFactory.Form()`.

### Basic Properties

Set title, header, and other UI elements with `set()`:

```typescript
const form = HoopFactory.Form()
  .set('title', 'Bug Report')
  .set('header', 'Please describe the issue')
  .set('footer', 'Thanks for helping!')
  .set('submit_buttons', 'Send Report');
```

### Event Handling

Define what happens when the form is submitted or values change:

```typescript
// Define submit action path
form.set('submit', { path: '/api/submit-bug' });

// Define source for dynamic updates (refresh)
form.set('source', { path: '/api/form-update' });
```

## Fields

Add fields using `FormFieldFactory`.

### Text Inputs

```typescript
// Basic input
FormFieldFactory.Text.Input({ name: 'title', label: 'Title' });

// Text area
FormFieldFactory.Text.TextArea({ name: 'details', label: 'Details' });

// Specialized inputs
FormFieldFactory.Text.Email({ name: 'email', label: 'Contact Email' });
FormFieldFactory.Text.Number({ name: 'count', label: 'Quantity' });
FormFieldFactory.Text.Url({ name: 'website', label: 'Website' });
FormFieldFactory.Text.Telephone({ name: 'phone', label: 'Phone' });
FormFieldFactory.Text.Password({ name: 'secret', label: 'Secret Key' });
```

### Selects

```typescript
// Static options
FormFieldFactory.Select.Static({
  name: 'priority',
  label: 'Priority',
  options: [
    { label: 'High', value: 'high' },
    { label: 'Low', value: 'low' }
  ]
});

// Dynamic users/channels
FormFieldFactory.Select.Users({ name: 'assignee', label: 'Assign To' });
FormFieldFactory.Select.Channels({ name: 'channel', label: 'Post In' });

// Dynamic external source
FormFieldFactory.Select.Dynamic({ 
  name: 'external_item', 
  label: 'Search External',
  lookup: { path: '/api/lookup' }
});
```

### Formatting

```typescript
// Checkbox (Boolean)
FormFieldFactory.Checkbox({ name: 'urgent', label: 'Mark as Urgent' });

// Markdown / Divider
FormFieldFactory.Markdown({ 
  name: 'note', 
  description: '**Note:** Fields marked with * are required.' 
});

FormFieldFactory.Divider('section-1');
```

## See Also

- [Mattermost Apps Forms](https://developers.mattermost.com/integrate/apps/reference/interactive-interfaces/#form)
- Main [README](./README.md)
