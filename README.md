# Blood Donation n8n

Modern blood donation request management built with Next.js (App Router), MongoDB, shadcn-style UI components, and n8n automation.

## Features
- Public blood request submission with validation and rate limiting
- Admin dashboard for approvals, rejections, and fulfillment
- Donor response tracking with real-time count polling
- n8n webhooks for broadcast and thank-you workflows

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and update values:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See `.env.example` for the full list. Required for local usage:

- `MONGODB_URI`
- `NEXT_PUBLIC_APP_URL`

Optional (recommended):
- `N8N_WEBHOOK_URL`
- `N8N_THANKYOU_WEBHOOK_URL`
- `N8N_WEBHOOK_SECRET`
- `ADMIN_SECRET`

## API Overview

### Public
- `POST /api/requests`
- `GET /api/requests/[requestId]`
- `POST /api/requests/[requestId]/respond`
- `GET /api/requests/[requestId]/donor-count`

### Admin (protected by `ADMIN_SECRET`)
- `GET /api/admin/requests`
- `PATCH /api/admin/requests/[requestId]/approve`
- `PATCH /api/admin/requests/[requestId]/reject`
- `PATCH /api/admin/requests/[requestId]/fulfill`
- `GET /api/admin/requests/[requestId]/responses`
- `PATCH /api/admin/responses/[responseId]/accept`

### Webhooks
- `POST /api/webhooks/n8n/broadcast-success`
- `POST /api/webhooks/n8n/broadcast-failure`

## Notes
- Public request details only expose approved/fulfilled requests.
- Contact info is returned only on admin routes.
- n8n webhook verification uses the `x-n8n-secret` header.
