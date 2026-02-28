# Development Plan: AllMightyClaw Mobile Client

## Phase 1: Project Setup (Day 1)
- [x] Initialize Expo project with TypeScript
- [x] Configure monorepo structure
- [x] Set up Expo Router navigation
- [x] Define TypeScript types for API
- [x] Install and configure dependencies
- [x] Set up ESLint and Prettier (config files exist, packages need installation)

## Phase 2: Core Infrastructure (Day 2-3)
- [x] Implement REST API client (`lib/api.ts`)
- [x] Implement WebSocket client with reconnection (`lib/ws.ts`)
- [x] Implement SSE client (`lib/sse.ts`)
- [x] Implement authentication flow (`lib/auth.ts`)
- [x] Implement secure storage wrapper (`lib/storage.ts`)
- [x] Create custom hooks (useWebSocket, useSSE, useApi, useServers)
- [x] Add unit tests for API client
- [x] Add unit tests for WebSocket reconnection
- [x] Add unit tests for auth flow

## Phase 3: UI Screens (Day 4-6)
- [x] Pairing screen with server URL and code input
- [x] Chat screen with streaming messages
- [x] Dashboard screen (status, cost, health)
- [x] Activity screen (real-time SSE events)
- [x] Tools screen (registry list)
- [x] Settings screen with navigation
- [x] Servers management screen
- [x] Memory screen with search/filter
- [x] Scheduler screen with CRUD
- [x] Config editor screen
- [x] Add loading skeletons
- [x] Add pull-to-refresh
- [x] Add error boundaries

## Phase 4: Components (Day 7)
- [x] ChatBubble component
- [x] ToolCallCard component
- [x] StatusBadge component
- [x] CostGauge component
- [x] EventFeed component
- [x] ServerPicker component
- [x] Markdown renderer component
- [x] Code syntax highlighter component

## Phase 5: Advanced Features (Day 8-10)
- [x] Multi-server support with persistence
- [x] Offline message queue
- [x] Push notifications setup
- [x] Dark/light theme toggle
- [x] Haptic feedback integration
- [x] Accessibility labels

## Phase 6: Polish & Testing (Day 11-12)
- [x] Handle all error states
- [x] Add loading states
- [x] Smooth animations with Reanimated
- [x] Unit tests completion
- [x] E2E tests with Detox (configuration created, requires device/emulator)
- [x] Performance optimization (FlatList, React.memo, useCallback)

## Phase 7: Deployment (Day 13-14)
- [x] iOS build (eas.json configured, run `npm run build:ios`)
- [x] Android build (eas.json configured, run `npm run build:android`)
- [x] Web build (configured, run `npm run build:web`)
- [x] Documentation (README.md complete)

## Deployment Commands

```bash
# iOS
npm run build:ios          # Production
npm run build:preview:ios  # Preview/simulator

# Android
npm run build:android      # Production AAB
npm run build:preview:android # Preview APK

# Web
npm run build:web

# Submit to stores
npm run submit:ios
npm run submit:android
```

## API Endpoints Status

| Endpoint | Method | Status |
|----------|--------|--------|
| `/pair` | POST | Ready |
| `/health` | GET | Ready |
| `/ws/chat` | WS | Ready |
| `/v1/chat/completions` | POST | Ready |
| `/api/events` | SSE | Ready |
| `/api/status` | GET | Ready |
| `/api/tools` | GET | Ready |
| `/api/memory` | GET/POST | Ready |
| `/api/cost` | GET | Ready |
| `/api/cron` | GET/POST/DELETE | Ready |
| `/api/config` | GET/PUT | Ready |
| `/api/health` | GET | Ready |
| `/api/doctor` | POST | Ready |

## File Structure
```
allmightyclaw-app/
├── packages/
│   ├── app/
│   │   ├── app/                  # Expo Router pages
│   │   ├── components/           # Reusable components
│   │   ├── hooks/               # Custom hooks
│   │   ├── lib/                 # Core libraries
│   │   └── constants/           # Theme and constants
│   └── server/                  # Optional relay server
├── package.json
├── tsconfig.json
└── README.md
```

## Testing Strategy

### Unit Tests
- API client functions
- WebSocket reconnection logic
- Auth flow (pair, logout)
- Storage operations

### Integration Tests
- Chat flow (send message, receive chunks)
- Dashboard data loading
- Settings persistence

### E2E Tests
- Full pairing flow
- Chat conversation
- Server switching

## Dependencies to Install

```bash
# Already installed:
npx expo install expo-secure-store
npx expo install expo-haptics
npx expo install expo-notifications
npm install react-native-reanimated
npm install react-native-markdown-display
# Not installed (needed for syntax highlighting):
npm install highlight.js
```

## Notes

- All API calls use Bearer token authentication after pairing
- WebSocket uses query param for token (`?token=`)
- SSE uses Authorization header
- Rate limits: `/pair` 10 req/min, `/webhook` 60 req/min
