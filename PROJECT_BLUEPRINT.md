# Mercedes-Benz Spare Parts CRM – Delivery Blueprint

## 1) UI Screens and User Journeys

## IA (Top-level navigation)
- Dashboard
- Leads
- Orders
- Tokens (Walk-in Queue)
- Quotations
- Customers
- Tasks & Follow-ups
- Payments
- Warehouse
- Reports
- Admin/Settings

## Core Screen Specs

### 1. Login
**Purpose:** Role-based access into branch-specific workspace.  
**Key elements:** mobile/email, password, branch selector (if multi-branch), forgot password.  
**Actions:** Sign in.

### 2. Dashboard (Role-aware)
**Purpose:** Single operational cockpit.  
**Widgets (dynamic by role):**
- Enquiries today/week/month
- Orders by status
- Tokens waiting/in-service/completed
- Pending stock checks
- Pending payment orders
- Ready-for-pickup ageing
- Agent leaderboard
- Alerts panel (SLA breaches)

### 3. Quick Lead Create (Fast Entry)
**Purpose:** Capture request in <30 seconds.  
**Fields:** customer name, mobile, source, parts requested, VIN/model, assigned agent, priority, branch, need today, walk-in flag.  
**Actions:** Save Lead, Save & Quote, Save & Convert to Order, Create Token.

### 4. Lead List
**Purpose:** Triage and workload management.  
**Filters:** source, status, branch, assigned agent, created date, priority, overdue follow-up.  
**Actions:** open, assign/reassign, bulk status update.

### 5. Lead Detail
**Purpose:** Work a lead to closure.  
**Panels:** customer, vehicle, requested parts, activity log, follow-ups, quotations, attachments, lost reason.  
**Sticky actions:** Quote, Confirm, Convert to Order, Mark Lost.

### 6. Customer Profile
**Purpose:** 360° customer history.  
**Tabs:** Overview, vehicles, enquiries, orders, quotations, payments, interactions, frequent parts.  
**Actions:** create repeat order, add note, flag VIP/blacklist.

### 7. Vehicle Detail
**Purpose:** Fitment correctness for Mercedes parts.  
**Fields:** VIN, model/year/variant/engine, fuel type, plate no, OEM references.  
**Actions:** attach images/docs.

### 8. New Order (One-screen capture)
**Purpose:** High-speed order creation.  
**Sections:** header (customer/source/agent/branch), line items, pricing/discount/tax, payment, fulfillment, notes/SAP refs.  
**Actions:** save draft, confirm, mark paid, reserve stock.

### 9. Order List
**Purpose:** Fulfillment control and ageing view.  
**Filters:** status, payment status, fulfillment type, branch, assigned agent, overdue.  
**Actions:** open, progress status, print docs.

### 10. Order Detail
**Purpose:** End-to-end lifecycle tracking.  
**Timeline:** created → quote → confirmed → paid → picking → ready → completed/returned.  
**Actions:** split payment, update stock check, handover/delivery confirmation.

### 11. Token Queue Screen (Live)
**Purpose:** Walk-in queue management.  
**Columns:** token no, type, wait time, assigned counter/agent, status.  
**Actions:** call next, hold, resume, no-show, complete.

### 12. Counter Desk
**Purpose:** Ultra-fast token issuance.  
**Fields:** token type, customer mobile/name, purpose, assigned desk.  
**Actions:** issue token, link to existing customer/lead/order.

### 13. Cashier Screen
**Purpose:** Payment settlement and receipt references.  
**Actions:** collect by mode, split allocations, attach receipt ref, mark paid/refunded/cancelled.

### 14. Warehouse Screen
**Purpose:** Stock validation and issue flow.  
**Actions:** available/partial/not available, reserve, pick, mark ready, issue/dispatch.

### 15. Quotations Screen
**Purpose:** Create and track quote lifecycle.  
**Actions:** draft/share/revise/accept/reject/expire, channel send tracking.

### 16. Follow-up / Task Screen
**Purpose:** SLA and callback commitments.  
**Actions:** add reminders, reassign, snooze, complete, overdue escalation.

### 17. Reports & Analytics
**Purpose:** Management visibility and continuous improvement.  
**Views:** channel performance, agent performance, conversion funnels, token wait times, lost reasons.

### 18. User/Agent Management
**Purpose:** Access and team setup.  
**Actions:** create user, role, branch mapping, permissions.

### 19. Settings
**Purpose:** Controlled configuration.  
**Entities:** lead sources, statuses, token types, SLA thresholds, discount approval rules.

---

## End-to-End User Journeys

### Journey A: WhatsApp/Phone/Email Enquiry → Order Complete
1. Agent taps **Quick Lead**.
2. Customer + vehicle + part request captured.
3. Warehouse check recorded (available/partial/not available).
4. Quote generated and shared.
5. Customer confirms.
6. Lead converted to order.
7. Payment recorded (full/partial).
8. Pickup or delivery fulfilled.
9. Order marked completed.

### Journey B: Walk-in Token Flow
1. Counter issues token (type selected).
2. Token enters waiting queue.
3. Agent calls token.
4. Request converted to lead or direct order.
5. Cashier posts payment.
6. Warehouse issues part.
7. Token and order closed.

### Journey C: Website Lead Automation
1. Website webhook creates lead.
2. System auto-assigns agent.
3. Agent notified in dashboard.
4. Contact + quote + conversion cycle executed.
5. Fulfillment and closure.

### Journey D: Repeat Customer Fast Reorder
1. Agent searches by mobile.
2. Opens customer history.
3. Clones previous order.
4. Edits quantities/pricing.
5. Confirms and processes quickly.

---

## 2) Database Schema with SQL (PostgreSQL)

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- Core Master Tables
-- =========================
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Dubai',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(40) UNIQUE NOT NULL,
  name VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID REFERENCES branches(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  full_name VARCHAR(120) NOT NULL,
  mobile VARCHAR(30),
  email VARCHAR(180) UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(40) UNIQUE NOT NULL,
  label VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lost_reasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(60) UNIQUE NOT NULL,
  label VARCHAR(120) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Customer & Vehicle
-- =========================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_type VARCHAR(20) NOT NULL DEFAULT 'individual',
  name VARCHAR(140) NOT NULL,
  mobile VARCHAR(30) NOT NULL,
  alternate_mobile VARCHAR(30),
  whatsapp VARCHAR(30),
  email VARCHAR(180),
  company_name VARCHAR(180),
  preferred_channel VARCHAR(30),
  trn VARCHAR(60),
  notes TEXT,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (mobile)
);

CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_type VARCHAR(20) NOT NULL DEFAULT 'primary',
  line1 VARCHAR(200) NOT NULL,
  line2 VARCHAR(200),
  city VARCHAR(80),
  state VARCHAR(80),
  country VARCHAR(80) DEFAULT 'UAE',
  postal_code VARCHAR(30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vin VARCHAR(50),
  plate_no VARCHAR(30),
  brand VARCHAR(60) NOT NULL DEFAULT 'Mercedes-Benz',
  model VARCHAR(80),
  year INT,
  variant VARCHAR(80),
  engine VARCHAR(80),
  fuel_type VARCHAR(30),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Lead & Activity
-- =========================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_no VARCHAR(40) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  source_id UUID NOT NULL REFERENCES lead_sources(id),
  assigned_to UUID REFERENCES users(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  status VARCHAR(40) NOT NULL,
  request_summary TEXT NOT NULL,
  walk_in_flag BOOLEAN NOT NULL DEFAULT FALSE,
  need_today BOOLEAN NOT NULL DEFAULT FALSE,
  token_id UUID,
  website_reference VARCHAR(120),
  lost_reason_id UUID REFERENCES lost_reasons(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  notes TEXT,
  activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id)
);

CREATE TABLE tasks_followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  order_id UUID,
  assigned_to UUID NOT NULL REFERENCES users(id),
  due_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  reminder_channel VARCHAR(20) DEFAULT 'in_app',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Token Queue
-- =========================
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_no VARCHAR(40) UNIQUE NOT NULL,
  branch_id UUID NOT NULL REFERENCES branches(id),
  token_type VARCHAR(30) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  assigned_to UUID REFERENCES users(id),
  status VARCHAR(30) NOT NULL DEFAULT 'waiting',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  called_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  waiting_minutes INT,
  service_minutes INT
);

CREATE TABLE token_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_id UUID NOT NULL REFERENCES tokens(id) ON DELETE CASCADE,
  from_status VARCHAR(30),
  to_status VARCHAR(30) NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);

-- =========================
-- Quotations
-- =========================
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_no VARCHAR(40) UNIQUE NOT NULL,
  lead_id UUID REFERENCES leads(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  assigned_to UUID REFERENCES users(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  validity_date DATE,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  shared_via VARCHAR(20),
  shared_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  part_number VARCHAR(60),
  part_name VARCHAR(180) NOT NULL,
  part_type VARCHAR(30),
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL
);

-- =========================
-- Orders & Fulfillment
-- =========================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_no VARCHAR(40) UNIQUE NOT NULL,
  lead_id UUID REFERENCES leads(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  assigned_to UUID REFERENCES users(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  source_id UUID REFERENCES lead_sources(id),
  fulfillment_type VARCHAR(20) NOT NULL,
  token_id UUID REFERENCES tokens(id),
  status VARCHAR(40) NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
  sap_invoice_ref VARCHAR(80),
  sap_customer_ref VARCHAR(80),
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  part_number VARCHAR(60),
  sap_item_code VARCHAR(60),
  part_name VARCHAR(180) NOT NULL,
  part_type VARCHAR(30),
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  stock_status VARCHAR(30) NOT NULL DEFAULT 'supplier_check_needed',
  availability_note TEXT,
  expected_availability_date DATE
);

CREATE TABLE inventory_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  check_result VARCHAR(30) NOT NULL,
  expected_date DATE,
  warehouse_note TEXT,
  checked_by UUID REFERENCES users(id),
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Payments
-- =========================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_no VARCHAR(40) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  order_id UUID REFERENCES orders(id),
  payment_mode VARCHAR(30) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'paid',
  receipt_reference VARCHAR(80),
  sap_invoice_number VARCHAR(80),
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  allocated_amount NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Attachments / Audit / SAP Ref
-- =========================
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(30) NOT NULL,
  entity_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(40),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sap_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(30) NOT NULL,
  entity_id UUID NOT NULL,
  sap_doc_type VARCHAR(30),
  sap_doc_no VARCHAR(80),
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(40) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(40) NOT NULL,
  before_data JSONB,
  after_data JSONB,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agent_performance_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  branch_id UUID NOT NULL REFERENCES branches(id),
  snapshot_date DATE NOT NULL,
  leads_handled INT NOT NULL DEFAULT 0,
  quotes_sent INT NOT NULL DEFAULT 0,
  orders_converted INT NOT NULL DEFAULT 0,
  lost_leads INT NOT NULL DEFAULT 0,
  walkins_handled INT NOT NULL DEFAULT 0,
  revenue_closed NUMERIC(14,2) NOT NULL DEFAULT 0,
  avg_first_response_seconds INT,
  conversion_ratio NUMERIC(6,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, snapshot_date)
);

-- Useful indexes
CREATE INDEX idx_leads_status_branch ON leads(status, branch_id);
CREATE INDEX idx_orders_status_branch ON orders(status, branch_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_tokens_status_branch ON tokens(status, branch_id);
CREATE INDEX idx_tasks_due_status ON tasks_followups(due_at, status);
```

---

## 3) Lovable-ready Build Prompt

Use the following prompt in Lovable (or similar AI app builder):

```text
Build a production-ready web app named “Mercedes-Benz Spare Parts Sales, Token & Order Control CRM”.

Goals:
- Multi-channel lead capture (WhatsApp, phone, email, website, walk-in)
- Fast one-screen lead/order capture for sales desk
- Walk-in token queue with live status board
- Quotation, payment, stock-check, and fulfillment tracking
- Multi-agent assignment and performance dashboards
- Branch-aware access control

Tech requirements:
- Frontend: responsive mobile-first UI with role-based dashboards
- Backend: REST API + PostgreSQL
- Auth: email/mobile + password, JWT session, role permissions
- Audit logs for key status and payment changes
- File attachments for VIN images/docs and voice notes

Roles:
Super Admin, Sales Manager, Sales Agent, Counter Staff, Cashier, Warehouse Staff, Delivery Coordinator, Management Read-only.

Must-have modules:
1) Customer Management + customer history
2) Vehicle/Fitment records (VIN, model, engine, OEM refs)
3) Lead Management with source channels and statuses
4) Order Management with full lifecycle statuses
5) Token Queue Management (issue/call/hold/no-show/complete)
6) Quotation module with statuses and share tracking
7) Communication logs + follow-up reminders
8) Agent assignment + KPI dashboards
9) Inventory check layer + SAP references
10) Payment module (split/mixed payments)
11) Pickup/Delivery fulfillment
12) Website lead webhook ingestion
13) Reports and analytics

UX rules:
- Keep data entry very fast (minimal typing, dropdowns, autosuggest)
- Sticky action buttons on detail screens: Quote, Confirm, Paid, Ready, Complete
- Search customer by mobile from anywhere
- Allow repeat-order cloning from customer history

Data model:
Use normalized tables: users, roles, branches, customers, addresses, vehicles, leads, lead_activities, lead_sources, orders, order_items, quotations, quotation_items, tokens, token_logs, payments, payment_allocations, inventory_checks, attachments, tasks_followups, lost_reasons, audit_logs, sap_references, agent_performance_snapshots.

Integrations:
- Website lead webhook endpoint
- Optional WhatsApp and email connectors
- SAP reference storage and sync status (SAP is source of truth for billing/accounting)

Deliverables:
- Fully navigable UI
- CRUD + workflow APIs
- Seed data for demo (branches, users, statuses, reasons)
- Dashboard charts and operational widgets
- Validation and mandatory lost reason on lost/cancelled lead
- Exportable reports (CSV)
```

---

## 4) API Specification (REST v1)

## Auth
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

## Customers
- `GET /api/v1/customers?search=&mobile=&vip=`
- `POST /api/v1/customers`
- `GET /api/v1/customers/{id}`
- `PATCH /api/v1/customers/{id}`
- `GET /api/v1/customers/{id}/history`

## Vehicles
- `POST /api/v1/customers/{id}/vehicles`
- `GET /api/v1/vehicles/{id}`
- `PATCH /api/v1/vehicles/{id}`

## Leads
- `GET /api/v1/leads?status=&source=&assigned_to=&branch_id=&from=&to=`
- `POST /api/v1/leads`
- `GET /api/v1/leads/{id}`
- `PATCH /api/v1/leads/{id}`
- `POST /api/v1/leads/{id}/assign`
- `POST /api/v1/leads/{id}/activities`
- `POST /api/v1/leads/{id}/convert-to-order`
- `POST /api/v1/leads/{id}/mark-lost` (mandatory `lost_reason_id`)

## Tokens
- `GET /api/v1/tokens/live?branch_id=`
- `POST /api/v1/tokens`
- `POST /api/v1/tokens/{id}/call`
- `POST /api/v1/tokens/{id}/hold`
- `POST /api/v1/tokens/{id}/resume`
- `POST /api/v1/tokens/{id}/no-show`
- `POST /api/v1/tokens/{id}/complete`

## Quotations
- `GET /api/v1/quotations?status=&assigned_to=`
- `POST /api/v1/quotations`
- `GET /api/v1/quotations/{id}`
- `PATCH /api/v1/quotations/{id}`
- `POST /api/v1/quotations/{id}/share`
- `POST /api/v1/quotations/{id}/accept`
- `POST /api/v1/quotations/{id}/reject`

## Orders
- `GET /api/v1/orders?status=&payment_status=&fulfillment_type=&branch_id=`
- `POST /api/v1/orders`
- `GET /api/v1/orders/{id}`
- `PATCH /api/v1/orders/{id}`
- `POST /api/v1/orders/{id}/items`
- `POST /api/v1/orders/{id}/status`
- `POST /api/v1/orders/{id}/fulfillment/ready-pickup`
- `POST /api/v1/orders/{id}/fulfillment/out-for-delivery`
- `POST /api/v1/orders/{id}/fulfillment/complete`

## Inventory Checks
- `POST /api/v1/order-items/{id}/inventory-check`
- `GET /api/v1/orders/{id}/inventory-status`

## Payments
- `GET /api/v1/payments?status=&mode=&from=&to=`
- `POST /api/v1/payments`
- `POST /api/v1/payments/{id}/allocate`
- `POST /api/v1/orders/{id}/mark-paid`
- `POST /api/v1/payments/{id}/refund`

## Follow-ups / Tasks
- `GET /api/v1/tasks?assigned_to=&status=&overdue=`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/{id}`
- `POST /api/v1/tasks/{id}/complete`

## Attachments
- `POST /api/v1/attachments` (multipart)
- `GET /api/v1/attachments/{entity_type}/{entity_id}`

## Reports
- `GET /api/v1/reports/management?from=&to=&branch_id=`
- `GET /api/v1/reports/operations?branch_id=`
- `GET /api/v1/reports/agent-performance?from=&to=&branch_id=`
- `GET /api/v1/reports/lost-reasons?from=&to=`
- `GET /api/v1/reports/export.csv?type=`

## Website Lead Ingestion
- `POST /api/v1/integrations/website-leads` (secured with API key/signature)

### Standard API Conventions
- Authentication: `Authorization: Bearer <JWT>`
- Pagination: `?page=1&page_size=25`
- Errors:
  - `400` validation
  - `401` unauthenticated
  - `403` unauthorized
  - `404` not found
  - `409` conflict
  - `422` business rule violation (e.g., lost reason missing)

---

## 5) Full Project Plan

## Phase 0: Discovery & Blueprint (1–2 weeks)
- Confirm branch model, SLA policies, mandatory fields.
- Finalize status dictionaries and role permission matrix.
- Map SAP touchpoints (reference-only in phase 1).
- Deliverables: signed PRD, UX wireframes, ERD, API contract v1.

## Phase 1: MVP Core (6–8 weeks)
**Scope**
- Auth + RBAC
- Customers + Vehicles
- Quick Leads + Activities + Follow-ups
- Orders + Order Items + Status workflows
- Token Queue (issue/call/hold/no-show/complete)
- Basic dashboards

**Milestones**
1. Foundation setup (week 1)
2. CRM core screens (week 2–3)
3. Orders + token operations (week 4–5)
4. QA/UAT + go-live prep (week 6–8)

**Acceptance KPIs**
- Quick lead creation <= 30 sec
- Token issuance <= 10 sec
- 95%+ core workflow completion without admin intervention

## Phase 2: Business Efficiency (4–6 weeks)
**Scope**
- Quotation workflow + approval
- Payment module + split payments
- Warehouse stock check process
- Website lead ingestion
- Lost reason analytics
- Advanced operational reports

**Acceptance KPIs**
- Quote-to-order conversion trackable by agent/channel
- Payment reconciliation visibility per order
- Lost reason capture 100% for lost/cancelled leads

## Phase 3: Integrations & Scale (6–10 weeks)
**Scope**
- WhatsApp integration
- Email sync integration
- Call logging integration
- SAP sync references enhancement
- Delivery coordinator workflows
- SLA breach automation and branch benchmarking

**Acceptance KPIs**
- Omni-channel log coverage > 90%
- SLA breach alerts real-time
- Multi-branch comparative dashboard enabled

## Cross-functional Workstreams
- **Security:** RBAC, audit logging, PII encryption at rest.
- **Data:** migration templates, dedupe by phone/email/WhatsApp.
- **QA:** regression suite for lead→order→payment→fulfillment path.
- **Training:** role-specific SOP videos and quick guides.
- **Change management:** pilot branch rollout, then staged expansion.

## Suggested Team
- Product Manager (1)
- Tech Lead (1)
- Frontend Engineers (2)
- Backend Engineers (2)
- QA Engineers (2)
- UI/UX Designer (1)
- DevOps Engineer (1 shared)

## Risks & Mitigations
- **Low user adoption** → enforce fast-entry UX + mobile-first flow.
- **Data inconsistency** → strict status transitions + audit logs.
- **Integration delays (SAP/WhatsApp)** → keep adapter interfaces and feature flags.
- **Token queue bottlenecks** → live dashboard + manager alert thresholds.

## Go-live Checklist
- Production env hardening complete
- Role permissions validated
- Seed master data loaded (sources/statuses/lost reasons)
- UAT sign-off by sales manager + cashier + warehouse + counter
- Backup/restore tested
- Hypercare support window (2 weeks)

---

This blueprint directly translates the provided specification into implementation-ready design, schema, API contract, and phased execution.
