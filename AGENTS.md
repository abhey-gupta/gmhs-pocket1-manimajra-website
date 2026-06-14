# AGENTS.md

Welcome! This document provides context, architectural guidelines, and codebase mappings for AI coding agents and automated developers working on the **GMHS Pocket 1 Manimajra School Website** repository.

---

## 1. Project Context & Tech Stack

This project is a modern web application for the Government Model High School (GMHS) Pocket 1, Manimajra.

* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS & Vanilla CSS (via CSS Modules / global stylesheets)
* **Database**: Supabase (PostgreSQL)
* **State Management & Querying**: TanStack React Query (client-side)
* **File Storage**: Local Server Filesystem (served statically from Next.js `public/` directory)
* **Package Manager**: `pnpm`

---

## 2. Directory Structure & Codebase Map

```
├── app/                      # Next.js App Router Pages and API routes
│   ├── activities/           # Dynamic routes for scanning & viewing activities
│   ├── admin/                # Admin dashboard and login flows
│   ├── announcement/         # Individual announcement detail pages
│   ├── api/                  # Backend API routes (upload, announcements)
│   ├── cbse/                 # CBSE public disclosures and compliance pages
│   ├── info/                 # Infrastructure and uniform static info pages
│   ├── layout.tsx            # Global site layout, font loading, providers
│   └── page.tsx              # Main homepage of the school website
├── components/               # Reusable React components
│   ├── admin/                # Admin-specific modal dialogs and uploads
│   ├── loaders/              # Loading animations (e.g. OvalLoader)
│   ├── ui/                   # Shadcn/UI boilerplate components (JS/JSX)
│   └── Announcements.tsx     # Home dashboard announcements lists
├── lib/                      # Base system utility helpers and clients
│   ├── supabase.ts           # Supabase JS client instance setup
│   └── utils.ts              # CSS class merger wrapper (`cn`)
├── public/                   # Static files (images, logos, uploaded assets)
│   └── gmhspkt1/             # Root target namespace for uploaded files
│       ├── announcements/    # Local uploads for announcements files
│       └── activities/       # Local uploads for activity images
├── sections/                 # Main homepage landing page sections
├── utils/                    # Global utility helper files
└── shims.d.ts                # TypeScript wildcard declarations for JS modules
```

---

## 3. Data Schema & Models

### `announcements` Table (Supabase / PostgreSQL)

Stores announcements made by the school administration.

| Column | Type | Default | Nullable | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | `gen_random_uuid()` | No | Primary Key |
| `title` | `text` | - | No | Title of the announcement |
| `description`| `text` | - | Yes | Text description / content |
| `file` | `text` | - | Yes | Relative URL path to local attachment |
| `flagged` | `boolean` | `false` | No | Highlights/flags the announcement |
| `created_at` | `timestamptz`| `now()` | No | Timestamp of creation |
| `updated_at` | `timestamptz`| `now()` | No | Timestamp of last update |

**Note**: Row-Level Security (RLS) should be enabled with select permissions set to public (`true`) and insert/update permissions set to public or restricted via admin token headers.

---

## 4. Key Workflows

### A. File Upload Workflow (Local Server Storage)
The application handles file storage locally instead of cloud storage services:
1. **Single File Upload**: A `POST` request to `/api/upload` uploads a document. The server writes the file to `public/gmhspkt1/announcements/[timestamp]_[filename]` and returns the relative path (e.g., `/gmhspkt1/announcements/...`).
2. **Multiple Files Upload**: A `POST` request to `/api/upload/multiple` uploads several images for an activity. The server recursively creates directory structures under `public/gmhspkt1/activities/[category]/[year]/[title]/` and writes files locally.

### B. Fetching Activities (Server-Side Scan)
* Inside [app/activities/\[name\]/page.tsx](file:///app/activities/%5Bname%5D/page.tsx), files are scanned from the server storage using Node.js `fs.readdir`.
* S3 key formats are emulated (e.g. `gmhspkt1/activities/[category]/[year]/[title]/[file]`) to keep directory splitting and image path generation intact.

### C. Creating and Fetching Announcements
* Announcements are managed via the `/api/announcements` route (`GET` by ID, `POST` to insert) and `/api/announcements/fetch-all` (`GET` list).
* The homepage queries lists using TanStack Query in [Announcements.tsx](file:///components/Announcements.tsx).

---

## 5. Environment Variables

Create a `.env.local` file in the project root with the following configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>

# Admin Authentication Settings
NEXT_PUBLIC_ADMIN_TOKEN=C6FBF298277FE9FE474F1FBFD18D7
NEXT_PUBLIC_ADMIN_EMAIL=rameshgupta001@gmail.com
NEXT_PUBLIC_ADMIN_PASSWORD=gmhs@pkt1
```

---

## 6. Core Developer Commands

All standard development tasks should run through `pnpm`:

* **Start dev server**: `pnpm run dev`
* **Build project**: `pnpm run build`
* **TypeScript type check**: `pnpm exec tsc --noEmit`
* **Format/Lint**: `pnpm run lint`

---

## 7. Guidelines for AI Coding Agents

* **TypeScript & JS Resolution**:
  * Shadcn/UI components reside in `components/ui/` as `.js`/`.jsx` files. Do not force convert them to TypeScript to avoid adding unnecessary type declarations. Wildcard module shims are declared in `shims.d.ts` to type-cast imports from `@/components/ui/*` as `any`.
  * If a file uses UI components, prefix the file with `// @ts-nocheck` to skip JSX property type checks since Shadcn components lack typescript definitions.
* **Next.js Prerendering**:
  * Supabase client initialization checks environment variables. To ensure `next build` does not fail when compiling in environments lacking env variables, the client falls back to placeholders and emits console warnings instead of throwing.
* **Working with CSS**:
  * Tailwind CSS scans source files for class compiling. When adding or refactoring files, ensure their extensions (`.ts`, `.tsx`, `.js`, `.jsx`) are listed in the `content` array inside `tailwind.config.js` to ensure styling updates build correctly.
