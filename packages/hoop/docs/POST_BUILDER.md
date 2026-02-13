# Post Builder Guide

The `PostBuilder` is your main tool for creating rich, interactive Loop/Mattermost posts. It handles the complexity of nested objects for you, letting you focus on the content.

## Quick Example

```typescript
import { HoopFactory, ActionFactory } from '@triple-sun/hoop';

const post = HoopFactory.Post()
  .set('message', 'Hey team!')
  .attachments.append({
    title: 'Survey',
    text: 'Rate your experience',
    color: '#00C853',
    actions: [
      ActionFactory.Button({ name: 'Good', integration: { url: '/api/vote' } }),
      ActionFactory.Button({ name: 'Bad', integration: { url: '/api/vote' } })
    ]
  })
  .build();
```

## Core Builder: PostBuilder

This is where you start. Access it via `HoopFactory.Post()`.

### Simple Properties

Configure basic fields with `set()`:

```typescript
const post = HoopFactory.Post()
  .set('message', 'Hello world')
  .set('channel_id', 'abc123')
  .set('root_id', 'def456')  // for replies
  .build();
```

### Metadata

You can attach typed metadata directly:

```typescript
interface MyMetadata {
  taskId: number;
  priority: 'high' | 'low';
}

const post = HoopFactory.Post()
  .set('message', 'Task notification')
  .metadata.add<MyMetadata>({ taskId: 42, priority: 'high' })
  .build();
```

### Building for API Calls

Get the right format for client methods:

```typescript
const createArgs = builder.buildToCreate('channel', 'channel-id-123');
const updateArgs = builder.buildToUpdateArgs('post-id-456');
```

## Attachments

Attachments give your posts structure with colored borders, titles, and fields.

### Basic Attachments

```typescript
const post = HoopFactory.Post()
  .attachments.append({
    color: '#FF5722',
    title: 'Build Failed',
    text: 'Check the logs for details',
    title_link: 'https://ci.example.com/build/123'
  })
  .build();
```

### With Fields

Display structured data in columns (just set `short: true`):

```typescript
const post = HoopFactory.Post()
  .attachments.append({
    title: 'Deployment Status',
    fields: [
      { title: 'Environment', value: 'Production', short: true },
      { title: 'Version', value: 'v2.3.1', short: true },
      { title: 'Duration', value: '3m 12s', short: true },
      { title: 'Status', value: '✅ Success', short: true }
    ]
  })
  .build();
```

### Modifying Attachments

```typescript
// Update first attachment
builder.attachments.update('color', '#00FF00', 0);

// Append more attachments
builder.attachments.append({ text: 'Another one' });

// Filter attachments
builder.attachments.filter(at => at.get('color') !== '#FF0000');

// Clear all
builder.attachments.clear();
```

## Actions

Add interactivity with buttons and menus.

### Buttons

```typescript
import { ActionFactory } from '@triple-sun/hoop';

const post = HoopFactory.Post()
  .attachments.append({
    text: 'Approve this request?',
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

### Select Menus

Static options:

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

Dynamic options from channels/users:

```typescript
// User selector
ActionFactory.Select.Users({
  name: 'assignee',
  integration: { url: '/api/assign' }
})

// Channel selector
ActionFactory.Select.Channels({
  name: 'channel',
  integration: { url: '/api/move' }
})
```

### Managing Actions

```typescript
// Add actions to first attachment
builder.actions.append(0, ActionFactory.Button({ name: 'ok' }));

// Update action properties
builder.actions.update('name', 'updated-name', 0);

// Set all actions
builder.actions.set(0, 
  ActionFactory.Button({ name: 'yes' }),
  ActionFactory.Button({ name: 'no' })
);

// Clear actions
builder.actions.clear(0);

// Get all actions from all attachments
const allActions = builder.getAllActions();
```

## Fields

Fields are simple key-value pairs inside attachments.

### Basic Usage

```typescript
builder.fields.append(0, 
  { title: 'Status', value: 'Active', short: true },
  { title: 'Owner', value: '@johndoe', short: true }
);
```

### Field Operations

```typescript
// Update field
builder.fields.update('value', 'Updated', 0);

// Filter fields
builder.fields.filter(0, field => field.get('short') === true);

// Get all fields
const allFields = builder.getAllFields();
```

## App Bindings

Use bindings to add slash commands and interactive menus.

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
          submit: { url: '/api/action' }
        })
      ]
    })
  )
  .build();
```

## Related Builders

### PostPropsBuilder

Manages props (metadata, attachments, bindings). Usually accessed through PostBuilder, not directly.

```typescript
// Accessed via post.props
builder.update('from_bot', 'true');
```

### AttachmentBuilder

Manages individual attachments. Created automatically when you add attachments.

```typescript
// Usually created via attachments.append(), but can be used standalone:
import { AttachmentBuilder } from '@triple-sun/hoop';

const attachment = new AttachmentBuilder({ title: 'Test' })
  .set('color', '#123456')
  .build();
```

### ActionBuilder

Wraps post actions. Use `ActionFactory` instead of creating directly.

### FieldBuilder

Wraps attachment fields. Rarely used directly - just pass plain objects.

## Advanced: Finders

Most methods that accept an index (like `.update`, `.filter`, `.set` for attachments/actions/fields) also accept a finder function.

### Functional Finders

Instead of hardcoding indices, you can find elements dynamically:

```typescript
// Update the attachment that has a specific title
builder.attachments.update(
  'color', 
  '#FF0000', 
  at => at.get('title') === 'Error Log'
);

// Update a field in a specific attachment
builder.fields.update(
  'value', 
  'Fixed', 
  at => at.get('title') === 'Status', // find attachment
  field => field.get('title') === 'Bug #123' // find field
);

// Add an action to a specific attachment
builder.actions.append(
  at => at.get('text').includes('Approve'),
  ActionFactory.Button({ name: 'Confirm' })
);
```

## Common Patterns

### Multi-Attachment Posts

```typescript
const report = HoopFactory.Post()
  .set('message', '📊 Daily Report')
  .attachments.append(
    {
      color: '#4CAF50',
      title: '✅ Successful',
      fields: [
        { title: 'Tests Passed', value: '142', short: true },
        { title: 'Coverage', value: '94%', short: true }
      ]
    },
    {
      color: '#F44336',
      title: '❌ Failed',
      fields: [
        { title: 'Tests Failed', value: '3', short: true },
        { title: 'Critical', value: '1', short: true }
      ]
    }
  )
  .build();
```

### Conditional Actions

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
  .attachments.append({ text: 'Item details', actions })
  .build();
```

### Updating Existing Posts

```typescript
// Fetch existing post builder
const builder = HoopFactory.Post(existingPost);

// Modify and rebuild
builder
  .set('message', 'Updated message')
  .attachments.update('color', '#FFD700', 0);

// Send update
await client.posts.update(postId, builder.buildToUpdateArgs(postId));
```

## Tips

- **Colors**: Use hex colors like `#FF5722` for attachment colors
- **Markdown**: Post messages and attachment text support markdown
- **Fallback**: Attachments auto-generate fallback text for notifications
- **Short fields**: Set `short: true` to display fields in two columns
- **Context**: Add context data to integrations for callbacks
- **Immutability**: `build()` returns frozen objects - safe to use
- **Method chaining**: All builder methods return `this` for chaining

## See Also

- [Mattermost Message Attachments](https://developers.mattermost.com/integrate/reference/message-attachments/)
- [Mattermost Interactive Messages](https://developers.mattermost.com/integrate/plugins/interactive-messages/)
- Main [README](./README.md) for installation and overview
