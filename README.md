# AllMightyClaw App

Mobile + web client for AllMightyClaw — an autonomous AI agent runtime.

## Features

### Core Functionality
- **Pairing Flow** - Connect to AllMightyClaw server with 8-character pairing code
- **WebSocket Chat** - Real-time streaming responses with chunk/done/error handling
- **REST API Client** - Full API coverage for status, tools, memory, scheduler, config
- **SSE Events** - Real-time activity feed with reconnection logic

### Screens
- **Chat** - Streaming responses with markdown rendering and offline queue
- **Dashboard** - System status, cost tracking, health monitoring
- **Activity** - Real-time event feed from SSE connection
- **Tools** - Tool registry with enabled/disabled status
- **Settings** - Servers, Memory, Scheduler, Config management

### Advanced Features
- **Multi-server Support** - Add, remove, switch between servers
- **Offline Queue** - Messages queued when disconnected, sent on reconnect
- **Dark/Light Theme** - System preference detection with manual override
- **Push Notifications** - Configured via expo-notifications

### Polish
- **Error Boundaries** - Graceful error handling with retry
- **Loading Skeletons** - Shimmer animations while loading
- **Pull-to-Refresh** - On all data screens
- **Accessibility** - Screen reader labels on all interactive elements
- **Haptic Feedback** - Tactile responses on interactions

## Tech Stack

- **TypeScript** - Strict mode enabled
- **Expo SDK 52** - React Native with Expo Router
- **React Native Reanimated** - Fluid animations
- **AsyncStorage** - Persistent data storage
- **SecureStore** - Encrypted token storage
- **expo-haptics** - Haptic feedback
- **expo-clipboard** - Copy functionality
- **react-native-markdown-display** - Markdown rendering

## Project Structure

```
packages/app/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── chat.tsx       # Chat screen
│   │   ├── dashboard.tsx  # Dashboard screen
│   │   ├── activity.tsx   # Activity feed
│   │   ├── tools.tsx      # Tools registry
│   │   ├── settings.tsx   # Settings menu
│   │   └── settings/      # Settings sub-screens
│   ├── pair.tsx           # Pairing flow
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable components
│   ├── ErrorBoundary.tsx  # Error handling
│   ├── ErrorDisplay.tsx   # Error UI with retry
│   ├── LoadingSkeleton.tsx # Shimmer loading
│   ├── MarkdownRenderer.tsx # Markdown display
│   └── CodeBlock.tsx      # Syntax highlighted code
├── context/               # React contexts
│   └── ThemeContext.tsx   # Theme provider
├── hooks/                 # Custom hooks
│   ├── useApi.ts          # API data fetching
│   ├── useWebSocket.ts    # WebSocket connection
│   ├── useSSE.ts          # SSE connection
│   ├── useServers.ts      # Server management
│   ├── useOfflineQueue.ts # Offline message queue
│   └── useHaptics.ts      # Haptic feedback
├── lib/                   # Core libraries
│   ├── api.ts             # REST API client
│   ├── ws.ts              # WebSocket client
│   ├── sse.ts             # SSE client
│   ├── auth.ts            # Authentication
│   ├── storage.ts         # AsyncStorage wrapper
│   └── types.ts           # TypeScript types
└── __tests__/             # Unit tests
    ├── api.test.ts        # API tests
    ├── ws.test.ts         # WebSocket tests
    ├── auth.test.ts       # Auth tests
    └── storage.test.ts    # Storage tests
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Expo development server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm test` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- api.test.ts
```

## Configuration

### Theme

The app supports three theme modes:
- **Light** - Always use light theme
- **Dark** - Always use dark theme  
- **System** - Follow system preference (default)

Theme preference is persisted in AsyncStorage.

### Servers

Multiple servers can be configured. The first server is automatically selected as active. Server list is persisted in AsyncStorage.

## API Reference

See [evolution-daemon-spec.md](../evolution-daemon-spec.md) for full API documentation.

### Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pair` | POST | Pair with server |
| `/health` | GET | Health check |
| `/api/status` | GET | System status |
| `/api/tools` | GET | Tool registry |
| `/api/memory` | GET/POST | Memory entries |
| `/api/cost` | GET | Cost summary |
| `/api/cron` | GET/POST/DELETE | Scheduled jobs |
| `/api/config` | GET/PUT | Configuration |
| `/api/health` | GET | Component health |
| `/v1/chat/completions` | POST | Chat completion |
| `/ws/chat` | WebSocket | Real-time chat |
| `/api/events` | SSE | Event stream |

## License

MIT
