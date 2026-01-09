# PUMO DIAGNOSIS HUB 🎯

## Struktura Dashboard z istniejącymi plikami .md

```
pumo-diagnosis-hub/
│
├── index.html                    # Główny dashboard (JIMBO THE PUMO)
├── export.html                  # dashboard-export.html (raporty)
├── assets/
│   ├── images/
│   │   ├── bonzo-logo.png       # Twój logo
│   │   ├── favicon.ico
│   │   └── pumo-icon.png
│   ├── css/
│   │   ├── dashboard.css        # UNIFIED style 1:1
│   │   ├── animations.css       # Hover effects
│   │   └── theme.css            # Dark/Light toggle
│   ├── js/
│   │   ├── main.js              # Core functionality
│   │   ├── charts.js            # Chart.js configs
│   │   ├── ai-analyst.js        # /api/ai-analyst calls
│   │   └── pumo-api.js          # Meble Pumo specific
│   └── data/
│       ├── mock-metrics.json    # Fallback data (usuń po API)
│       └── queries-sample.json
│
├── api/
│   ├── ai-analyst.js            # Cloudflare Worker endpoint
│   ├── metrics.js               # Real-time metrics
│   └── pumo-sync.js             # API Pumo integration
│
├── config/
│   ├── d1-schema.sql            # Database migrations
│   └── api-endpoints.json       # Configuration
│
├── docs/                        # 📚 EXISTING DOCUMENTATION
│   ├── backend-gotowy.md        # Backend gotowy.md
│   ├── funkcje-dashboardu.md    # Funkcje Dashboardu.md
│   ├── index-dashboard.md       # index.html (Główny Dashboard).md
│   ├── plan-rozwoju.md          # 🎯 Plan Rozwoju Dashboard - TYLKO Real Data.md
│   ├── whitecat-analytics.md    # 🚀 WHITECAT Analytics - Complete Implementation.md
│   └── uwagi.md                 # a co uwazasz_.md
│
├── sql/                         # 🗄️ DATABASE SCHEMAS
│   ├── schema-analytics-only.sql
│   ├── schema-analytics.sql
│   └── schema-products-utm.sql
│
└── README.md                    # Ten plik - deployment instructions
```

## Existing Documentation Files

Znalezione pliki dokumentacji zostały zorganizowane w folderze `/docs/`:

- **backend-gotowy.md** - Status implementacji backend
- **funkcje-dashboardu.md** - Specyfikacja funkcji dashboard
- **index-dashboard.md** - Dokumentacja głównego dashboard
- **plan-rozwoju.md** - Plan rozwoju z real data
- **whitecat-analytics.md** - Kompletna implementacja analytics
- **uwagi.md** - Notatki i uwagi

## Database Schemas

Pliki SQL zostały przeniesione do `/sql/`:

- **schema-analytics-only.sql** - Tylko analytics tabele
- **schema-analytics.sql** - Pełny schema analytics
- **schema-products-utm.sql** - Produkty z UTM tracking

## Deployment Instructions

1. **Setup Environment**:
   ```bash
   cd pumo-diagnosis-hub
   npm install
   ```

2. **Database Setup**:
   ```bash
   # Wybierz odpowiedni schema:
   wrangler d1 execute jimbo-rag-db --file=sql/schema-analytics.sql
   ```

3. **Deploy Worker**:
   ```bash
   npm run deploy
   ```

4. **Local Development**:
   ```bash
   # Otwórz index.html w przeglądarce
   open index.html
   ```

## API Endpoints

- `/api/ai-analyst` - AI analysis
- `/api/metrics` - Real-time metrics
- `/api/pumo-sync` - Pumo API integration

## Features

- 🎯 Real-time analytics dashboard
- 📊 Chart.js visualizations
- 🤖 AI-powered insights
- 🔄 Pumo API integration
- 📱 Responsive JIMBO UNIFIED design
- 🌙 Dark/Light theme toggle

---

**PUMO DIAGNOSIS HUB** - Professional analytics dashboard for Meble Pumo store management with JIMBO UNIFIED styling.