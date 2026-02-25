# AllMightyClaw Mobile Client Plan

## Task Overview

Create a mobile + web client for **AllMightyClaw** — an autonomous AI agent runtime — by forking and adapting Happy Coder. Connect to AllMightyClaw's HTTP/WebSocket gateway.

**Repo name**: `allmightyclaw-app`
**Stack**: TypeScript, Expo (React Native), React
**Platforms**: iOS, Android, Web

## Monorepo Setup Notes

### Expo Router Web Fix for Monorepos

When using Expo Router in an npm workspaces monorepo, the `process.env.EXPO_ROUTER_APP_ROOT` environment variable is not properly inlined by babel-preset-expo because node_modules are hoisted to the root. 

**Solution**: Use a postinstall script to patch the `_ctx.*.js` files in expo-router:

1. Add a `postinstall` script in root `package.json`:
   ```json
   "postinstall": "node scripts/patch-expo-router.js"
   ```

2. Create `scripts/patch-expo-router.js` that replaces `process.env.EXPO_ROUTER_APP_ROOT` with the relative path to the app directory.

3. Add React version overrides in root `package.json` to ensure consistent React versions:
   ```json
   "overrides": {
     "react": "19.1.0",
     "react-dom": "19.1.0"
   }
   ```

4. Use a custom `index.js` entry point instead of `expo-router/entry`:
   ```jsx
   import { registerRootComponent } from 'expo';
   import { ExpoRoot } from 'expo-router';

   export function App() {
     const ctx = require.context('./app');
     return <ExpoRoot context={ctx} />;
   }

   registerRootComponent(App);
   ```

## AllMightyClaw Gateway API Reference

### Authentication (Pairing)
```
POST /pair
Header: X-Pairing-Code: <8-char-code>
Response: {"paired": true, "token": ""}
All subsequent requests use: Authorization: Bearer <token>
```

### Chat Options

**Option A — WebSocket (preferred for mobile)**:
```
GET /ws/chat?token=
Client → Server: {"type":"message","content":"Hello"}
Server → Client: {"type":"chunk","content":"Hi! "}
Server → Client: {"type":"tool_call","name":"shell","args":{...}}
Server → Client: {"type":"tool_result","name":"shell","output":"..."}
Server → Client: {"type":"done","full_response":"..."}
Server → Client: {"type":"error","message":"..."}
```

**Option B — OpenAI-compatible REST**:
```
POST /v1/chat/completions
Authorization: Bearer
Body: {"model":"default","messages":[{"role":"user","content":"..."}]}
```

### Real-Time Events (SSE)
```
GET /api/events
Authorization: Bearer
Events: llm_request, tool_call, agent_start, agent_end, error
```

### Dashboard API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/status` | System status |
| GET | `/api/tools` | List tools |
| GET | `/api/memory` | List/search memory |
| POST | `/api/memory` | Store memory |
| GET | `/api/cost` | Cost summary |
| GET | `/api/cron` | List cron jobs |
| POST | `/api/cron` | Add cron job |
| DELETE | `/api/cron/{id}` | Remove cron job |
| POST | `/api/doctor` | Run diagnostics |
| GET | `/api/config` | Get config |
| PUT | `/api/config` | Update config |
| GET | `/api/health` | Component health |
| GET | `/health` | Simple health check |

## App Navigation

```
Tab Bar:
├── Chat          — WebSocket chat with streaming
├── Dashboard     — Status, cost, health
├── Activity      — Real-time SSE event feed
├── Tools         — Tool registry + call history
└── Settings
    ├── Servers   — Add/remove/switch servers
    ├── Memory    — Browse/search/add memory
    ├── Scheduler — Cron job management
    └── Config    — View/edit server config
```

## Pairing Flow
1. Enter server URL (e.g., `http://192.168.1.50:42617`)
2. App calls `GET /health` to verify
3. Enter 8-character pairing code
4. App calls `POST /pair` with `X-Pairing-Code`
5. Store token in secure storage, navigate to Chat

## Technical Requirements
- TypeScript strict mode
- Expo SDK 52+ with Expo Router
- WebSocket reconnection with exponential backoff
- SSE handling with EventSource
- Secure token storage (expo-secure-store)
- Dark/light theme support
- Haptic feedback
- Push notifications
- Offline queue
- Code syntax highlighting
- Markdown rendering
