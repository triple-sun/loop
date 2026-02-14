# Loop Client

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)

[🇷🇺 Читать на русском](./README.ru.md)

A modern, strongly-typed TypeScript client for [Loop](https://loop.ru) (a fork of Mattermost). Designed to be compatible with both Node.js and browser environments, this client provides comprehensive coverage of the Loop/Mattermost API with full type safety.

## Features

✨ **Modern & Type-Safe**
- Written in TypeScript 5.9 with strict type checking
- Comprehensive type definitions for all API methods

🔄 **Robust & Reliable**
- Built-in retry mechanisms with configurable policies
- Request queuing with concurrency control (via [breadline-ts](https://github.com/triple-sun/breadline-ts))

🌐 **Universal Compatibility**
- Works in Node.js (≥20), bun (≥1.0) and browser environments

📊 **Extensive API Coverage**
- **Channels**: Create, manage, search, and moderate channels
- **Posts**: Create, update, pin, search posts and threads
- **Users**: User management, profiles, authentication
- **Teams**: Team creation, membership, and administration
- **Files**: Upload, download, and manage file attachments
- **Emojis**: Custom emoji management
- **Webhooks**: Incoming and outgoing webhook integration
- **Bots**: Bot user management and automation
- **Playbooks**: Playbook and playbook runs (Loop-specific)
- **Groups**: LDAP group synchronization
- **Admin**: System administration and analytics
- And many more...

🧪 **Well-Tested**
- Comprehensive unit test coverage (90%+ threshold)
- Integration tests with real API
- Fuzz testing for edge cases

## Installation

```bash
npm install loop-client
```

Or using pnpm:

```bash
pnpm add loop-client
```

Or using bun:

```bash
bun add loop-client
```

Or using yarn:

```bash
yarn add loop-client
```

Or using bun:

```bash
bun add loop-client
```

## Quick Start

### Basic Usage

```typescript
import { LoopClient } from 'loop-client';

// Initialize the client
const client = new LoopClient('https://your-loop-server.loop.ru', {
  token: 'your-api-token',
  logLevel: 'info'
});

// Fetch current user
const me = await client.users.profile.get.me();
console.log(`Hello, ${me.data.username}!`);

// Create a post
const post = await client.posts.create({
  channel_id: 'channel-id-here',
  message: 'Hello from loop-client!'
});

// Search channels
const channels = await client.channels.search.all({
  term: 'general'
});

// Don't forget to cleanup when done
client.destroy();
```

### Advanced Configuration

```typescript
import { LoopClient, fiveRetriesInFiveMinutes } from 'loop-client';

const client = new LoopClient('https://your-loop-server.loop.ru', {
  // Authentication
  token: 'your-api-token',
  userID: 'me', // Optional: Current user ID (calculated automatically if not provided)
  
  // Auto-detection & Behavior
  useCurrentUserForDirectChannels: true, // Auto-use current user ID for DM creation
  useCurrentUserForPostCreation: true,   // Auto-resolve channel_id for new posts if missing
  saveFetchedUserID: false,              // Cache fetched user ID for future requests

  // Logging
  logLevel: 'debug',
  logger: customLogger, // Optional: provide your own logger
  
  // Performance tuning
  maxRequestConcurrency: 50, // Limit concurrent requests
  retryConfig: fiveRetriesInFiveMinutes, // Custom retry policy
  
  // Network configuration
  timeout: 30000, // Request timeout in ms
  headers: {
    'X-Custom-Header': 'value'
  },
  agent: new https.Agent({ keepAlive: true }), // Custom HTTP agent (e.g. for proxies)
  requestInterceptor: (config) => config,      // Custom request interceptor
  adapter: customAdapter,                      // Custom Axios adapter
  
  // TLS/SSL options
  tls: {
    rejectUnauthorized: false // For self-signed certificates
  },
  
  // Testing
  testConnectionOnInit: true // Test connection on initialization
});
```

## API Reference

The client provides a comprehensive API organized by resource type. All methods return a `Promise` with typed results.

### Core Resources

#### Users

```typescript
// Get user by ID
await client.users.profile.get.byId({ user_id: 'user-id' });

// Search users
await client.users.search({ term: 'john' });

// Update user roles
await client.users.updateRoles({
  user_id: 'user-id',
  roles: 'system_user system_admin'
});

// Set user status
await client.users.status.set({
  user_id: 'me',
  status: 'away'
});

// Set custom status
await client.users.status.setCustom({
  emoji: '🚀',
  text: 'Working on something awesome'
});
```

#### Channels

```typescript
// Create a regular channel
await client.channels.create.regular({
  team_id: 'team-id',
  name: 'my-channel',
  display_name: 'My Channel',
  type: 'O' // 'O' for open, 'P' for private
});

// Create a direct message channel
await client.channels.create.direct(['user-id-1', 'user-id-2']);

// Get channel by name
await client.channels.get.byName({
  team_id: 'team-id',
  channel_name: 'general'
});

// Add member to channel
await client.channels.members.add({
  channel_id: 'channel-id',
  user_id: 'user-id'
});

// Search channels
await client.channels.search.all({ term: 'marketing' });
```

#### Posts

```typescript
// Create a post
await client.posts.create({
  channel_id: 'channel-id',
  message: 'Hello World!'
});

// Create a post with file attachments
await client.posts.create({
  channel_id: 'channel-id',
  message: 'Check out this file',
  file_ids: ['file-id-1', 'file-id-2']
});

// Get posts for a channel
await client.posts.getForChannel({
  channel_id: 'channel-id',
  page: 0,
  per_page: 60
});

// Search posts
await client.posts.search({ terms: 'important meeting' });

// Pin/unpin a post
await client.posts.pin({ post_id: 'post-id' });
await client.posts.unpin({ post_id: 'post-id' });

// Get a thread
await client.posts.getThread({ post_id: 'post-id' });
```

#### Files

```typescript
// Upload a file
const uploadResult = await client.files.upload({
  channel_id: 'channel-id',
  files: fileBuffer, // or Stream
  filename: 'document.pdf'
}); // Note: actual implementation might require FormData or specific stream handling depending on environment

// Get file metadata
await client.files.get.metadata({ file_id: 'file-id' });

// Download a file
const fileData = await client.files.get.file({ file_id: 'file-id' });

// Search files
await client.files.search({ terms: 'report', team_id: 'team-id' });
```

#### Teams

```typescript
// Create a team
await client.teams.create({
  name: 'my-team',
  display_name: 'My Team',
  type: 'O' // 'O' for open, 'I' for invite-only
});

// Add member to team
await client.teams.members.add({
  team_id: 'team-id',
  user_id: 'user-id'
});

// Search teams
await client.teams.search({ term: 'engineering' });
```

### Additional Resources

The client also provides methods for:

- **Emojis**: Custom emoji management (`client.emojis.*`)
- **Reactions**: Post reactions (`client.reactions.*`)
- **Webhooks**: Incoming and outgoing webhooks (`client.webhooks.*`)
- **Bots**: Bot user management (`client.bots.*`)
- **Preferences**: User preferences (`client.preferences.*`)
- **Roles**: Role and permission management (`client.roles.*`)
- **Groups**: LDAP group sync (`client.groups.*`)
- **Playbooks**: Playbook management (`client.playbooks.*`)
- **Jobs**: Background job management (`client.jobs.*`)
- **System**: System configuration and analytics (`client.system.*`)
- **OAuth**: OAuth app management (`client.oauth.*`)
- **Compliance**: Compliance reports (`client.compliance.*`)
- **And more...**

See the [Loop API documentation](https://developers.loop.ru/API/4.0.0/loop-api-reference) for complete API reference.

### Error Handling

```typescript
import { WebAPIRequestError, WebAPIServerError } from 'loop-client';

try {
  await client.posts.create({
    channel_id: 'invalid-channel-id',
    message: 'This will fail'
  });
} catch (error) {
  if (error instanceof WebAPIRequestError) {
    console.error('Request error:', error.message);
    console.error('Status code:', error.statusCode);
  } else if (error instanceof WebAPIServerError) {
    console.error('Server error:', error.message);
    console.error('Server error ID:', error.serverErrorId);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Retry Policies

The client includes two built-in retry policies:

```typescript
import { 
  tenRetriesInAboutThirtyMinutes, 
  fiveRetriesInFiveMinutes 
} from 'loop-client';

// Default: 10 retries over ~30 minutes
const client1 = new LoopClient(url, {
  token,
  retryConfig: tenRetriesInAboutThirtyMinutes
});

// Faster: 5 retries over 5 minutes
const client2 = new LoopClient(url, {
  token,
  retryConfig: fiveRetriesInFiveMinutes
});

// Custom retry policy
const client3 = new LoopClient(url, {
  token,
  retryConfig: {
    retries: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 60000,
    random: true
  }
});
```

## Development

### Prerequisites

- Node.js ≥20
- bun, pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/triple-sun/loop-client.git
cd loop-client

# Install dependencies
pnpm install

# Build the project
pnpm build
```

### Project Structure

```
loop-client/
├── src/
│   ├── web-client.ts       # Main LoopClient class
│   ├── methods.ts          # API method definitions (2900+ LOC)
│   ├── errors.ts           # Error definitions
│   ├── utils.ts            # Utility functions
│   ├── const.ts            # Constants and retry policies
│   ├── logger.ts           # Logging utilities
│   ├── instrument.ts       # Performance instrumentation
│   └── types/              # TypeScript type definitions
│       ├── methods/        # Method argument types
│       └── responses/      # Response types
├── test/
│   ├── integration/        # Integration tests
│   ├── fuzzing/            # Fuzz tests
│   └── *.test.ts          # Unit tests
├── build/                  # Compiled output
└── coverage/               # Test coverage reports
```

### Available Scripts

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test

# Run real API integration tests (requires .env.test.local)
pnpm test:real:only

# Build the project
pnpm build

# Lint and format code
pnpm check

# Format code only
pnpm format

# Lint code only
pnpm lint
```

### Testing

The project has comprehensive test coverage:

```bash
# Run unit tests
pnpm test

# Run integration tests against actual API
# Create .env.test.local with:
# LOOP_URL=https://your-loop-server.com
# LOOP_TOKEN=your-test-token
pnpm test:real:only
```

Test structure:
- **Unit tests**: Mock-based tests for core functionality
- **Integration tests**: e2e tests and tests against actual Loop API
- **Fuzz tests**: Edge case and randomized input testing

### Code Quality

The project uses:
- **TypeScript 5.9** with strict mode enabled
- **Biome** for linting and formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

Configuration:
- Strict TypeScript settings in `tsconfig.json`
- Biome configuration in `biome.json`
- Jest configuration in `jest.config.ts`

## Environment Variables

For testing against a real Loop server, create a `.env.test.local` file:

```env
LOOP_URL=https://your-loop-server.com
LOOP_TOKEN=your-personal-access-token
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the code quality standards
4. Run tests (`pnpm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards

- Follow the existing TypeScript and Biome configuration
- Maintain test coverage above 90%
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages

## License

ISC License - see [package.json](package.json) for details

## Links

- **Repository**: [https://github.com/triple-sun/loop-client](https://github.com/triple-sun/loop-client)
- **Issues**: [https://github.com/triple-sun/loop-client/issues](https://github.com/triple-sun/loop-client/issues)
- **Loop API Documentation**: [https://developers.loop.ru/API/4.0.0/loop-api-reference](https://developers.loop.ru/API/4.0.0/loop-api-reference)
- **Mattermost API Documentation**: [https://developers.mattermost.com/api-documentation](https://developers.mattermost.com/api-documentation)

## Acknowledgments

- Inspired by the [Slack Web API client](https://github.com/slackapi/node-slack-sdk)
- Built for compatibility with [Loop](https://loop.ru) and Mattermost APIs
- Uses [breadline-ts](https://github.com/triple-sun/breadline-ts) for request queuing
- Uses [again-ts](https://www.npmjs.com/package/again-ts) for retry logic

---

**Made with ❤️ by [triple-sun](https://github.com/triple-sun)**