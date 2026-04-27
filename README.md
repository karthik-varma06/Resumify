# AI Resume Analyzer (Resumind)

An AI-powered resume review application that analyzes uploaded resumes against a target role and returns structured, actionable feedback across ATS compatibility, tone, content, structure, and skills.

---

## Key Features

- PDF resume upload (single file, max 20MB, validated in dropzone)
- Resume PDF to image conversion for preview (`pdfjs-dist`)
- AI-generated scoring across 5 categories plus overall score
- ATS-specific suggestion block with severity styling
- Persisted resume history (home dashboard cards)
- Detailed review page with accordion-based section drill-down
- Puter-based authentication and user-scoped storage
- Wipe route for clearing stored files and KV data

---

## Tech Stack

### Frontend
- React 19
- React Router v7 (`@react-router/dev`, SSR enabled)
- TypeScript 5 (strict mode)
- Vite 8

### State and Utilities
- Zustand (global Puter SDK store/wrappers)
- clsx + tailwind-merge (class composition)

### UI and Styling
- Tailwind CSS v4
- tw-animate-css
- Custom CSS utilities/components in `app/app.css`

### File Handling
- react-dropzone (PDF upload UX)
- pdfjs-dist (first-page PDF rasterization for image preview)

### AI, Storage, and Auth
- Puter.js SDK (`window.puter`) for:
  - auth
  - file storage
  - key-value storage
- OpenRouter Chat Completions API (currently `google/gemma-3-27b-it:free`)

### Deployment
- Node 20
- Docker (multi-stage image)

---

## Project Structure

```text
ai-resume-analyzer/
├── app/
│   ├── components/
│   │   ├── ATS.tsx                # ATS score banner + suggestion list
│   │   ├── Details.tsx            # Expandable category feedback panels
│   │   ├── FileUploader.tsx       # PDF dropzone + file state handoff
│   │   ├── Navbar.tsx             # Top navigation
│   │   ├── ResumeCard.tsx         # Resume list card on home
│   │   ├── ScoreBadge.tsx         # Textual badge (Strong/Good Start/Needs Work)
│   │   ├── ScoreCircle.tsx        # Circular score visual
│   │   ├── ScoreGauge.tsx         # Semi-circular overall score gauge
│   │   ├── Summary.tsx            # Score summary panel
│   │   └── Accordion.tsx          # Custom accordion primitives
│   │
│   ├── lib/
│   │   ├── puter.ts               # Zustand store + Puter wrappers + AI request
│   │   ├── pdf2img.ts             # PDF first-page to PNG conversion
│   │   └── utils.ts               # cn(), formatSize(), UUID helper
│   │
│   ├── routes/
│   │   ├── home.tsx               # Dashboard of saved resume analyses
│   │   ├── auth.tsx               # Login flow via Puter auth
│   │   ├── upload.tsx             # Main analyze pipeline
│   │   ├── resume.$id.tsx         # Detailed review page
│   │   └── wipe.tsx               # Debug route to clear app data
│   │
│   ├── root.tsx                   # Global layout, scripts, Puter init
│   ├── routes.ts                  # Route registration
│   └── app.css                    # Tailwind theme + component classes
│
├── constants/
│   └── index.ts                   # AI response schema + prompt template
├── types/
│   ├── index.d.ts                 # Resume/Feedback domain types
│   ├── puter.d.ts                 # Puter SDK typings
│   └── pdfjs.d.ts                 # pdfjs module declaration
├── public/                        # Static assets/icons/images
├── react-router.config.ts         # SSR toggle and framework config
├── vite.config.ts                 # Vite plugins + path alias
├── tsconfig.json                  # TypeScript strict config
├── Dockerfile                     # Multi-stage production build
└── package.json                   # Scripts and dependencies
```

---

## Workflow / How It Works Internally

### 1) App bootstrap
- `app/root.tsx` mounts layout and injects `https://js.puter.com/v2/`.
- `usePuterStore.init()` polls for Puter SDK readiness and checks auth state.

### 2) Authentication
- Protected routes (`/`, `/resume/:id`, `/wipe`) redirect to `/auth` if unauthenticated.
- `auth.tsx` triggers `puter.auth.signIn()` and returns user to `next` route.

### 3) Upload + analyze pipeline (`/upload`)
1. User submits company, role, job description, and PDF.
2. App verifies auth.
3. PDF file uploaded to Puter FS.
4. PDF converted to PNG (`pdf2img.ts`, currently first page only).
5. PNG uploaded to Puter FS.
6. A UUID is generated and initial record is written to Puter KV.
7. Prompt is generated via `prepareInstructions(...)`.
8. AI call sent to OpenRouter (through `ai.feedback` wrapper).
9. JSON is extracted, cleaned, and parsed.
10. KV record is updated with parsed feedback.
11. User redirected to `/resume/:id`.

### 4) Dashboard (`/`)
- Reads KV keys matching `resume:*`.
- Parses records and renders `ResumeCard` list with overall score.

### 5) Detailed review (`/resume/:id`)
- Loads metadata from KV.
- Reads resume/image blobs from Puter FS.
- Creates object URLs for preview.
- Renders:
  - overall summary,
  - ATS block,
  - detailed per-category tips in accordions.

---

## Setup and Installation

### Prerequisites

- Node.js 20+ (recommended: 20 LTS)
- npm
- A Puter account (for auth/storage)
- OpenRouter API key

### 1) Clone repository

```bash
git clone https://github.com/karthik-varma06/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create a `.env` file in project root:

```bash
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Notes:
- This key is referenced in `app/lib/puter.ts`.
- In Vite, `VITE_*` variables are exposed to client code.

### 4) Run in development

```bash
npm run dev
```

Default dev URL:
- `http://localhost:5173`

### 5) Type-check

```bash
npm run typecheck
```

### 6) Production build and start

```bash
npm run build
npm run start
```

---
