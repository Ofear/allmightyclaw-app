# AllMightyClaw App 🦾

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2054-000020?style=for-the-badge&logo=expo" alt="Expo SDK 54" />
  <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=for-the-badge&logo=react" alt="React Native 0.81" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5.3" />
  <img src="https://img.shields.io/badge/tests-50%2B-10B981?style=for-the-badge&logo=jest" alt="50+ Tests" />
</p>

> Mobile + web client for AllMightyClaw — an autonomous AI agent runtime

```
╔═══════════════════════════════════════════════════════════╗
║   _   _                     _  ____                     ║
║  | | | | _____   __ _  __| |/ ___|  ___ ___  _ __   ___ ║
║  | |_| |/ _ \ \ / / _` | |_| \___ \ / __/ _ \| '_ \ / _ \║
║  |  _  |  __/\ V / (_| |  _| ___) | (_| (_) | |_) |  __/║
║  |_| |_|\___| \_/ \__,_|_| |____/ \___\___/| .__/ \___|║
║                                             |_|         ║
║                     A p p                          v1.0  ║
╚═══════════════════════════════════════════════════════════╝
```

## ✨ Features

### 🔗 Core Functionality
| Feature | Description |
|---------|-------------|
| **Pairing Flow** | Connect with 8-character code — no passwords needed |
| **WebSocket Chat** | Real-time streaming responses with markdown support |
| **REST API** | Full coverage — status, tools, memory, scheduler, config |
| **SSE Events** | Live activity feed with auto-reconnection |

### 📱 Screens
| Screen | Purpose |
|--------|---------|
| 💬 **Chat** | Stream AI responses, offline queue support |
| 📊 **Dashboard** | System status, cost tracking, health metrics |
| 📡 **Activity** | Real-time event stream from server |
| 🛠️ **Tools** | Tool registry with enable/disable |
| ⚙️ **Settings** | Servers, Memory, Scheduler, Config |

### 🚀 Advanced Features
- **Multi-server Support** — Switch between servers seamlessly
- **Offline Queue** — Messages queued when offline, sent on reconnect
- **Dark/Light Theme** — Auto-detect or manual override
- **Push Notifications** — Stay informed even when away
- **Haptic Feedback** — Feel the interactions

### 🎨 Polish
- Error boundaries with retry actions
- Loading skeletons with shimmer animations
- Pull-to-refresh on all data screens
- Full accessibility support (VoiceOver/TalkBack)
- Smooth animations with React Native Reanimated

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│  Framework    │  Expo SDK 54 + Expo Router 6           │
├──────────────┼──────────────────────────────────────────┤
│  Language    │  TypeScript 5.3 (strict mode)           │
├──────────────┼──────────────────────────────────────────┤
│  UI          │  React Native 0.81 + Reanimated        │
├──────────────┼──────────────────────────────────────────┤
│  Storage     │  AsyncStorage + SecureStore             │
├──────────────┼──────────────────────────────────────────┤
│  Testing     │  Jest + Detox (50 unit + 15 E2E)        │
└─────────────────────────────────────────────────────────┘
```

## 📂 Project Structure

```
allmightyclaw-app/
├── packages/app/
│   ├── app/                    # 📄 Expo Router pages
│   │   ├── (tabs)/            # 🧭 Tab navigation
│   │   │   ├── chat.tsx       # 💬 Chat
│   │   │   ├── dashboard.tsx  # 📊 Dashboard
│   │   │   ├── activity.tsx   # 📡 Activity
│   │   │   ├── tools.tsx      # 🛠️ Tools
│   │   │   └── settings/      # ⚙️ Settings
│   │   └── pair.tsx           # 🔗 Pairing
│   │
│   ├── components/            # 🧩 Reusable components
│   │   ├── ErrorBoundary.tsx  # 🛡️ Error handling
│   │   ├── LoadingSkeleton.tsx # ✨ Shimmer
│   │   └── MarkdownRenderer.tsx # 📝 Markdown
│   │
│   ├── hooks/                 # 🎣 Custom hooks
│   │   ├── useWebSocket.ts    # 🔌 WebSocket
│   │   ├── useSSE.ts         # 📡 SSE
│   │   └── useOfflineQueue.ts # 📭 Offline
│   │
│   ├── lib/                   # 📚 Core libraries
│   │   ├── api.ts            # 🌐 REST client
│   │   ├── ws.ts             # 🔌 WebSocket
│   │   └── auth.ts           # 🔐 Authentication
│   │
│   └── __tests__/             # 🧪 Unit tests (50)
│   └── e2e/                   # 🎭 E2E tests (15)
```

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/Ofear/allmightyclaw-app.git
cd allmightyclaw-app
npm install

# Start developing
npm run dev          # Expo dev server
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Browser
```

## 🧪 Testing

```bash
npm test              # Unit tests (50)
npm run e2e:ios       # E2E on iOS
npm run e2e:android   # E2E on Android
```

**Test Coverage:**
- API Client — 18 tests
- WebSocket — 13 tests
- Auth Flow — 5 tests
- Storage — 11 tests
- E2E — 15 tests

## 📦 Building

| Platform | Command |
|----------|---------|
| iOS | `npm run build:ios` |
| Android | `npm run build:android` |
| Web | `npm run build:web` |

### Deployment Targets
| Store | Build Type | Command |
|-------|------------|---------|
| 🍎 App Store | `.ipa` | `npm run build:ios && npm run submit:ios` |
| 📲 Play Store | `.aab` | `npm run build:android && npm run submit:android` |
| 🌐 Web | Static | `npm run build:web` |

## 🎯 API Endpoints

```
POST   /pair                 🔗 Pair with server
GET    /health               💚 Health check
GET    /api/status           📊 System status
GET    /api/tools            🛠️ Tool registry
GET/POST /api/memory         🧠 Memory entries
GET    /api/cost             💰 Cost tracking
GET/POST/DELETE /api/cron    ⏰ Scheduled jobs
GET/PUT /api/config         ⚙️ Configuration
WS     /ws/chat              💬 Real-time chat
SSE    /api/events           📡 Event stream
```

## 📜 License

MIT — See [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>Built with ❤️ using Expo + React Native</sub>
</p>
