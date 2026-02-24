# AllMightyClaw App

Mobile + web client for AllMightyClaw — an autonomous AI agent runtime.

## Overview

This is a fork of Happy Coder, adapted to connect to AllMightyClaw's HTTP/WebSocket gateway instead of Claude Code.

## Development Plan

### Phase 1: Foundation
- [ ] Set up Expo SDK 52+ with Expo Router
- [ ] Configure TypeScript strict mode
- [ ] Set up project structure (monorepo with packages)

### Phase 2: Core Features
- [ ] Implement pairing flow (POST /pair)
- [ ] Build WebSocket chat client (/ws/chat)
- [ ] Implement REST API client (/v1/chat/completions)
- [ ] Add SSE event handling (/api/events)

### Phase 3: Screens
- [ ] Chat screen with streaming responses
- [ ] Dashboard screen (status, cost, health)
- [ ] Activity feed (real-time events)
- [ ] Tools screen (registry + history)
- [ ] Settings screen (servers, memory, scheduler, config)

### Phase 4: Advanced Features
- [ ] Multi-server support
- [ ] Offline queue
- [ ] Push notifications
- [ ] Dark/light theme

### Phase 5: Polish
- [ ] Error handling
- [ ] Loading states
- [ ] Pull-to-refresh
- [ ] Accessibility

## Tech Stack

- TypeScript
- Expo (React Native)
- React
- Expo Router

## Getting Started

```bash
npm install
npx expo start
```

## API Reference

See [evolution-daemon-spec.md](../evolution-daemon-spec.md) for full API documentation.
