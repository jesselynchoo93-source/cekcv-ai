# N8N to APP

This project converts existing n8n workflows into production web apps. It's a single Next.js application with a dashboard that lists all workflow-powered apps, each accessible as its own view.

## Stack

- **Frontend**: Next.js (App Router), React, TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: n8n webhooks (self-hosted, Docker)
- **Deployment**: GitHub → Vercel (auto-deploy on push)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Dashboard (lists all apps)
│   │   └── apps/
│   │       └── [slug]/
│   │           └── page.tsx    # Individual workflow app view
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── apps/              # Workflow-specific components
│   ├── lib/
│   │   ├── n8n.ts             # n8n webhook client helpers
│   │   └── utils.ts           # General utilities
│   └── config/
│       └── workflows.ts       # Registry of workflow apps (name, slug, webhook URL, description)
├── public/
├── .env.local                 # N8N_BASE_URL and secrets (never commit)
└── CLAUDE.md
```

## Workflow: Adding a New App

Follow these three phases in order:

### Phase 1 — Audit the n8n Workflow
1. Use the n8n MCP to inspect the target workflow
2. Verify it starts with a **Webhook trigger** node (POST method)
3. Confirm the webhook accepts a clear JSON input shape
4. Confirm the last node returns a structured JSON response
5. If the workflow needs changes, fix it before moving on

### Phase 2 — Build the Frontend
1. Add the workflow to `src/config/workflows.ts` (name, slug, webhook URL, description, input/output field definitions)
2. Create a component in `src/components/apps/` for the workflow's form and response display
3. Test locally against the n8n webhook
4. Keep components simple — one file per workflow app unless complexity demands splitting

### Phase 3 — Deploy
1. Push changes to GitHub (use GitHub MCP)
2. Vercel auto-deploys from the connected repo
3. Verify the deployed app works against the production n8n webhook URL

## n8n Conventions

- Every workflow exposed as an app **must** start with a Webhook node set to POST
- Webhook input: flat JSON object (avoid deeply nested structures)
- Webhook output: JSON with a clear `success` field and the result data
- Use "Respond to Webhook" node as the final step to send data back
- Webhook URLs go in `.env.local`, referenced via `workflows.ts` config

## Frontend Conventions

- Use shadcn/ui components for all UI elements
- One component file per workflow app in `src/components/apps/`
- File naming: kebab-case (e.g., `invoice-generator.tsx`)
- All n8n calls go through `src/lib/n8n.ts` — never call webhooks directly from components
- Show loading states and error handling for every webhook call
- Keep forms simple and match the webhook's expected input shape exactly

## Environment Variables

```
N8N_BASE_URL=http://localhost:5678   # Base URL of n8n instance
```

Individual webhook paths are stored in `src/config/workflows.ts`, not as separate env vars.

## Available Tools

- **n8n MCP**: Inspect workflows, read node configs, modify workflows
- **n8n Skill** (`/n8n`): Reference for n8n node types and patterns
- **Front-end Designer Skill**: UI/UX guidance for app layouts
- **GitHub MCP**: Push code, manage repos, create PRs

## Commands

```bash
npm run dev        # Local dev server
npm run build      # Production build
npm run lint       # Lint check
```
