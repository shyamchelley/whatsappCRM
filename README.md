# CRM — WhatsApp + Website Lead Management

A full-stack CRM application that captures leads from **WhatsApp**, **website widget**, and manual entry, then tracks them through a visual **drag-and-drop pipeline** to conversion.

---

## Features

| Feature | Details |
|---------|---------|
| 📊 **Dashboard** | Live stats, conversion rate, pipeline value, charts by stage/source |
| 🏗️ **Kanban Pipeline** | Drag-and-drop cards across 7 stages, real-time updates |
| 👥 **Lead Management** | Search, filter, inline edit, notes, reminders, activity timeline |
| 💬 **WhatsApp Integration** | Inbound messages auto-create leads; send replies from CRM |
| 🌐 **Website Widget** | Embeddable lead capture form — one `<script>` tag |
| ⚙️ **Settings** | Profile editor, password change, pipeline stage management |
| 🔔 **Real-time** | Socket.io — live lead updates, pipeline moves, reminder alerts |
| 🔐 **Auth** | JWT + refresh tokens, role-based access (Admin / Agent) |

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone and install
```bash
git clone https://github.com/shyamchelley/whatsappCRM.git
cd whatsappCRM
npm run setup        # installs all deps, runs migrations + seeds
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

### 3. Start everything
```bash
npm run dev
# Backend → http://localhost:3001
# Frontend → http://localhost:5173
```

### Default login credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@crm.com` | `admin123` |
| Agent | `agent@crm.com` | `agent123` |

---

## Project Structure

```
crm/
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/           # DB, Socket.io
│   │   ├── db/               # Migrations + seeds
│   │   ├── middleware/       # Auth, validation, rate limiting
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/
│   │   │   ├── leads/
│   │   │   ├── pipeline/
│   │   │   ├── dashboard/
│   │   │   ├── notes/
│   │   │   ├── reminders/
│   │   │   ├── webhooks/     # WhatsApp inbound + outbound
│   │   │   └── widget/       # Public lead capture endpoint
│   │   └── jobs/             # Reminder cron job
│   ├── knexfile.js
│   ├── server.js
│   └── test-webhook.js       # Simulate WhatsApp inbound message
│
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/              # Axios API modules
│   │   ├── components/       # Kanban, leads, layout, common UI
│   │   ├── pages/            # Dashboard, Pipeline, Leads, Settings
│   │   ├── store/            # Redux Toolkit slices
│   │   └── hooks/            # useSocket, useAuth
│   ├── widget/               # Standalone embeddable widget source
│   ├── vite.config.js        # Main app build
│   └── vite.widget.config.js # Widget IIFE build
│
├── docs/
│   ├── whatsapp-setup.md     # Meta WhatsApp Business API guide
│   └── widget-demo.html      # Widget embed demo page
│
├── docker-compose.yml
└── .env.example
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express 5, Knex.js |
| Database | SQLite (dev) → PostgreSQL (production) |
| Real-time | Socket.io |
| Frontend | React 18, Vite, Tailwind CSS |
| State | Redux Toolkit |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Auth | JWT + httpOnly refresh cookie |
| WhatsApp | Meta WhatsApp Business Cloud API |

---

## API Endpoints

### Auth
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
PATCH  /api/auth/me
PATCH  /api/auth/me/password
```

### Leads
```
GET    /api/leads               ?search=&stage_id=&source=
POST   /api/leads
GET    /api/leads/:id
PATCH  /api/leads/:id
DELETE /api/leads/:id
PATCH  /api/leads/:id/stage
GET    /api/leads/:id/activities
GET    /api/leads/:id/notes
POST   /api/leads/:id/notes
GET    /api/leads/:id/reminders
POST   /api/leads/:id/reminders
```

### Pipeline
```
GET    /api/pipeline/board
GET    /api/pipeline/stages
POST   /api/pipeline/stages
PATCH  /api/pipeline/stages/reorder
PATCH  /api/pipeline/stages/:id
DELETE /api/pipeline/stages/:id
```

### Dashboard
```
GET    /api/dashboard/stats
GET    /api/dashboard/by-source
GET    /api/dashboard/by-stage
GET    /api/dashboard/recent
GET    /api/dashboard/reminders
```

### WhatsApp
```
GET    /webhook/whatsapp        (Meta hub verification)
POST   /webhook/whatsapp        (Inbound messages)
GET    /api/whatsapp/:leadId/messages
POST   /api/whatsapp/:leadId/send
```

### Widget
```
POST   /api/widget/lead         (Public — no auth)
GET    /api/widget/config
GET    /widget/crm-widget.iife.js  (Served widget bundle)
```

---

## WhatsApp Setup

See `docs/whatsapp-setup.md` for the complete Meta WhatsApp Business API setup guide.

**Quick steps:**
1. Create a Meta Developer App
2. Add the WhatsApp product
3. Set up a webhook pointing to `https://YOUR_DOMAIN/webhook/whatsapp`
4. Add `WA_VERIFY_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_ACCESS_TOKEN` to `.env`

**Test locally with ngrok:**
```bash
ngrok http 3001
# Use the HTTPS URL as your webhook callback
```

---

## Website Widget Embed

```html
<div id="crm-widget-root"
  data-api-base="https://your-crm-domain.com"
  data-site-token="your_site_token"
  data-title="Contact Us"
  data-subtitle="We reply within 1 hour">
</div>
<script src="https://your-crm-domain.com/widget/crm-widget.iife.js"></script>
```

Build the widget bundle:
```bash
cd frontend && npm run build:widget
```

---

## Production Deployment (Docker)

```bash
# 1. Copy and fill in env vars
cp .env.example .env
nano .env

# 2. Start all services
docker-compose up -d

# App runs on port 80
```

**Services started:**
- `postgres` — PostgreSQL database
- `backend` — Node.js API (auto-migrates on start)
- `frontend` — React app served by Nginx (proxies API + Socket.io)

---

## Pipeline Stages

Default stages (configurable in Settings):

| Stage | Color | Type |
|-------|-------|------|
| New Lead | Indigo | Normal |
| Contacted | Blue | Normal |
| Qualified | Purple | Normal |
| Proposal | Amber | Normal |
| Negotiation | Orange | Normal |
| Won | Green | Terminal ✅ |
| Lost | Red | Terminal ❌ |

---

## Socket.io Events

| Event | Direction | When |
|-------|-----------|------|
| `lead:new` | Server → All | New lead created |
| `lead:updated` | Server → All | Lead fields changed |
| `pipeline:card_moved` | Server → All | Lead moved between stages |
| `whatsapp:message` | Server → All | New WhatsApp message |
| `reminder:due` | Server → User | Reminder cron fires |

---

## License

MIT
