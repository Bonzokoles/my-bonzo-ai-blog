# 🚀 ZEN_AGENTS_ON_AI_PLATFORM - Scenariusz Rozwoju

## 📋 AKTUALNY STAN (MVP - Minimum Viable Product)

### ✅ Co już działa:
- **Frontend Dashboard** (Next.js + Tailwind)
  - Lokalizacja: `R:\THE_AGENT_DEV\cloudflare-dashboard\frontend`
  - URL: http://localhost:3000
  - UI: Statyczne karty (agents, sessions, performance)
  
- **Zenon Browser** (Electron + React)
  - Lokalizacja: `R:\THE_AGENT_DEV\browser-automation\zenon-browser`
  - URL: http://localhost:5173
  - Browser automation z tab management

- **MCP Browser Automation** (Playwright)
  - Lokalizacja: `R:\THE_AGENT_DEV\browser-automation\mcp-browser-automation`
  - Node_modules zainstalowane ✅

- **Cloudflare Workers API** (TypeScript)
  - Lokalizacja: `R:\THE_AGENT_DEV\cloudflare-dashboard\workers\api`
  - Kod gotowy, wymaga wdrożenia

---

## 🎯 SCENARIUSZ ROZWOJU - FAZA 1 (Tydzień 1-2)

### 1.1 Backend API - Cloudflare Workers Deploy

**Cel**: Uruchomić API na Cloudflare Workers

**Kroki**:
```bash
cd R:\THE_AGENT_DEV\cloudflare-dashboard\workers\api

# 1. Zainstaluj Wrangler CLI (jeśli nie masz)
npm install -g wrangler

# 2. Zaloguj się do Cloudflare
wrangler login

# 3. Stwórz KV namespace dla danych agentów
wrangler kv:namespace create "ZENON_AGENT_DATA"
wrangler kv:namespace create "ZENON_AGENT_DATA" --preview

# 4. Stwórz R2 bucket dla plików
wrangler r2 bucket create zenon-bucket

# 5. Zaktualizuj wrangler.toml (dodaj binding IDs)
# 6. Deploy Worker
wrangler deploy
```

**Output**: API dostępne na `https://zenon-api.twoja-domena.workers.dev`

**Pliki do modyfikacji**:
- `wrangler.toml` - dodaj KV namespace IDs i R2 bucket binding
- `index.ts` - opcjonalnie dostosuj endpointy

---

### 1.2 Frontend → Backend Connection

**Cel**: Połączyć frontend z Cloudflare Workers API

**Lokalizacja**: `R:\THE_AGENT_DEV\cloudflare-dashboard\frontend`

**Plik do stworzenia**: `lib/api.js`
```javascript
const API_BASE = 'https://zenon-api.twoja-domena.workers.dev';

export async function fetchAgents() {
  const response = await fetch(`${API_BASE}/api/agents`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
}

export async function fetchBrowserSessions() {
  const response = await fetch(`${API_BASE}/api/browser/sessions`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
}

export async function fetchMetrics() {
  const response = await fetch(`${API_BASE}/api/metrics`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
}
```

**Zaktualizuj**: `pages/index.js`
```javascript
import { useEffect, useState } from 'react';
import { fetchAgents, fetchBrowserSessions, fetchMetrics } from '../lib/api';

export default function Home() {
  const [agents, setAgents] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [health, setHealth] = useState(100);

  useEffect(() => {
    // Fetch real data every 5 seconds
    const interval = setInterval(async () => {
      const agentsData = await fetchAgents();
      const sessionsData = await fetchBrowserSessions();
      const metricsData = await fetchMetrics();
      
      setAgents(agentsData.count);
      setSessions(sessionsData.count);
      setHealth(metricsData.health);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ... rest of component with real data
}
```

---

## 🎯 SCENARIUSZ ROZWOJU - FAZA 2 (Tydzień 3-4)

### 2.1 Python Agents System

**Cel**: Uruchomić system Python agents

**Lokalizacja**: Stwórz `R:\THE_AGENT_DEV\agents-system\`

**Struktura**:
```
agents-system/
├── requirements.txt
├── config.py
├── agents/
│   ├── dashboard_controller.py
│   ├── searcher_agent.py
│   ├── translator_agent.py
│   └── base_agent.py
└── main.py
```

**requirements.txt**:
```
requests==2.31.0
websockets==12.0
python-dotenv==1.0.0
aiohttp==3.9.1
```

**Przykładowy agent** (`agents/base_agent.py`):
```python
import requests
import time
from typing import Dict, Any

class BaseAgent:
    def __init__(self, agent_id: str, api_url: str, api_key: str):
        self.agent_id = agent_id
        self.api_url = api_url
        self.api_key = api_key
        self.running = False
    
    def report_status(self, status: Dict[str, Any]):
        """Report agent status to Cloudflare API"""
        headers = {'Authorization': f'Bearer {self.api_key}'}
        response = requests.post(
            f"{self.api_url}/api/agents",
            json={'agent_id': self.agent_id, **status},
            headers=headers
        )
        return response.json()
    
    def start(self):
        self.running = True
        while self.running:
            self.report_status({
                'status': 'active',
                'timestamp': time.time()
            })
            time.sleep(10)
    
    def stop(self):
        self.running = False
```

---

### 2.2 WebSocket Real-Time Communication

**Cel**: Live updates między agents a dashboard

**W Cloudflare Worker** (`workers/api/index.ts`):
```typescript
// Dodaj WebSocket Durable Object
export class AgentWebSocket {
  state: DurableObjectState;
  sessions: Set<WebSocket>;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Set();
  }

  async fetch(request: Request) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 400 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    this.sessions.add(server);

    server.accept();
    return new Response(null, { status: 101, webSocket: client });
  }

  broadcast(message: string) {
    this.sessions.forEach(session => {
      session.send(message);
    });
  }
}
```

**W Frontend** (`pages/index.js`):
```javascript
useEffect(() => {
  const ws = new WebSocket('wss://zenon-api.twoja-domena.workers.dev/ws');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update UI with real-time data
    if (data.type === 'agent_status') {
      setAgents(data.count);
    }
  };

  return () => ws.close();
}, []);
```

---

## 🎯 SCENARIUSZ ROZWOJU - FAZA 3 (Tydzień 5-6)

### 3.1 Agent Control Panel

**Funkcje**:
- Start/Stop agentów przez UI
- Restart pojedynczego agenta
- View logs w czasie rzeczywistym
- Konfiguracja parametrów agenta

**Nowa strona**: `pages/agents/control.js`

---

### 3.2 Browser Automation Integration

**Integracja**:
- Zenon Browser połączony z MCP Server
- Dashboard kontroluje browser sessions
- Screenshots w czasie rzeczywistym
- Proxy rotation

---

### 3.3 Monitoring & Analytics

**Dodaj**:
- Grafy performance (Recharts)
- Error tracking
- Agent activity timeline
- Resource usage charts

---

## 📦 DEPLOYMENT - Cloudflare Pages

### Wdróż Frontend na Cloudflare Pages

```bash
cd R:\THE_AGENT_DEV\cloudflare-dashboard\frontend

# 1. Build production
npm run build

# 2. Deploy do Cloudflare Pages
npx wrangler pages deploy out --project-name zenon-dashboard

# 3. Configure custom domain (opcjonalnie)
```

**Output**: Dashboard live na `https://zenon-dashboard.pages.dev`

---

## 🔐 AUTHENTICATION & SECURITY

### JWT Authentication

**W Worker** (`workers/api/auth.ts`):
```typescript
import * as jose from 'jose';

export async function generateToken(userId: string, secret: string) {
  const jwt = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(secret));
  return jwt;
}

export async function verifyToken(token: string, secret: string) {
  const { payload } = await jose.jwtVerify(
    token,
    new TextEncoder().encode(secret)
  );
  return payload;
}
```

**Login Page**: `pages/login.js`

---

## 🗂️ DATABASE SCHEMA - Cloudflare KV

### Agent Status
```
Key: agent:{agent_id}:status
Value: {
  status: 'active' | 'idle' | 'error',
  last_seen: timestamp,
  tasks_completed: number,
  current_task: string
}
```

### Browser Sessions
```
Key: session:{session_id}
Value: {
  agent_id: string,
  url: string,
  started_at: timestamp,
  screenshot_url: string
}
```

### Metrics
```
Key: metrics:daily:{date}
Value: {
  total_agents: number,
  total_tasks: number,
  success_rate: number
}
```

---

## 📊 ROADMAP SUMMARY

| Faza | Czas | Deliverable |
|------|------|-------------|
| **Faza 1** | Tydzień 1-2 | API deployed, Frontend connected |
| **Faza 2** | Tydzień 3-4 | Python agents running, WebSocket live |
| **Faza 3** | Tydzień 5-6 | Full control panel, monitoring |
| **Faza 4** | Tydzień 7-8 | Production ready, scaling |

---

## 🚀 QUICK START COMMANDS

```bash
# 1. Deploy API
cd R:\THE_AGENT_DEV\cloudflare-dashboard\workers\api
wrangler deploy

# 2. Start Frontend (dev)
cd R:\THE_AGENT_DEV\cloudflare-dashboard\frontend
npm run dev

# 3. Start Python Agents
cd R:\THE_AGENT_DEV\agents-system
python main.py

# 4. Deploy Frontend (production)
npm run build
npx wrangler pages deploy out
```

---

## 📝 NASTĘPNE KROKI DLA BONZO

1. **Zdecyduj**: Jaki agent chcesz uruchomić pierwszy?
2. **Deploy API**: Wykonaj kroki z Fazy 1.1
3. **Napisz pierwszy Python agent**: Skopiuj szablon z Fazy 2.1
4. **Connect Frontend**: Dodaj lib/api.js z real API calls
5. **Test end-to-end**: Agent → API → Dashboard

**Status**: Fundament gotowy, czas na kod! 💪
