# AI Resume Analyzer (Resumind)

An AI-powered resume review application that analyzes uploaded resumes against a target role and returns structured, actionable feedback across ATS compatibility, tone, content, structure, and skills.

---

## Project Overview

Recruiters receive high volumes of resumes, and most candidates do not know why their resumes are rejected by Applicant Tracking Systems (ATS) before a human even reads them. This project solves that gap by giving users immediate, category-wise feedback tied to a specific job title and description.

Instead of a generic “resume score,” the app stores each submission and provides explainable feedback that users can iterate on.

### Problem Statement

Candidates need a fast, practical way to:
- assess ATS-readiness before applying,
- understand weaknesses in resume quality by category,
- improve resumes based on role-specific expectations.

### Real-World Relevance

- ATS filtering is a real gate in modern hiring pipelines.
- Tailoring resumes to job descriptions improves callback probability.
- A clear feedback loop reduces guesswork and speeds up application readiness.

---

## Solution Explanation

This app implements a complete resume-analysis pipeline in a web UI:

1. User uploads a PDF resume and enters job metadata (company, role, description).
2. PDF is converted to an image preview for rendering.
3. Resume assets are uploaded to Puter file storage.
4. A structured prompt is sent to an LLM (via OpenRouter) requesting strict JSON output.
5. Parsed feedback is persisted in Puter KV as a resume record.
6. User is redirected to a detailed review page with scores and expandable tips.

### Core Idea

Use a strict feedback schema (`overallScore`, `ATS`, `toneAndStyle`, `content`, `structure`, `skills`) so AI output is consistently displayable and comparable between submissions.

### Why this approach works

- Enforces machine-readable output (JSON-first prompt design).
- Keeps user history in per-user KV records (`resume:<uuid>`).
- Separates storage (Puter FS + KV) from UI rendering logic.
- Supports progressive enhancement: users can upload, revisit, and compare multiple resumes.

---

## Why This Project Stands Out

1. **No custom backend required for core flow**
   - Uses Puter SDK (auth, filesystem, KV) directly from client/runtime.
   - Useful for rapid prototyping and portfolio demonstration.

2. **Structured AI feedback, not plain text**
   - Prompt enforces category-wise JSON schema.
   - UI can reliably render scores + tips + explanations.

3. **End-to-end user journey**
   - Auth, upload, processing, persistence, listing, and detailed review are all implemented.

4. **Role-contextual analysis**
   - Job title and description are injected into prompt context to make feedback more relevant.

5. **Production-oriented scaffolding**
   - React Router v7 SSR mode, TypeScript strict mode, and multi-stage Docker build.

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

## Docker Setup

Build image:

```bash
docker build -t ai-resume-analyzer .
```

Run container:

```bash
docker run -p 3000:3000 --env VITE_OPENROUTER_API_KEY=your_key ai-resume-analyzer
```

---

## Usage

1. Open the app and sign in via Puter auth.
2. Go to Upload Resume.
3. Fill in:
   - Company name,
   - Job title,
   - Job description,
   - Resume PDF.
4. Click Analyze Resume.
5. Wait for status pipeline:
   - upload file → convert pdf → upload image → analyze.
6. Review generated feedback on the detailed page.
7. Return home to see historical submissions.

---

## API Documentation

### OpenRouter endpoint used
- `POST https://openrouter.ai/api/v1/chat/completions`

### Request behavior
- Sends prompt requesting strict JSON with mandatory fields.
- Parses either OpenRouter-style or Puter-style response shape fallback.

### Data persistence model
- Files: Puter FS paths (`resumePath`, `imagePath`)
- Metadata + feedback: Puter KV (`resume:<uuid>`)

---

## Potential Improvements / Future Scope

1. Move AI calls server-side
   - Prevent exposing API key in browser bundle.
   - Add request signing and rate-limiting.

2. Schema-validated AI parsing
   - Add Zod (or equivalent) to reject malformed AI output deterministically.

3. Multi-page resume support
   - Current implementation converts only page 1.
   - Could evaluate all pages and aggregate results.

4. Robust error handling and retries
   - Explicit handling for 429/rate limits and model timeouts.
   - Add user-visible retry actions.

5. Comparative analytics
   - Resume versioning and score-delta history over time.

6. Job-match scoring
   - Keyword overlap and semantic alignment with provided job description.

7. Testing coverage
   - Unit tests for parsing and prompt formatting.
   - Integration tests for upload/analyze flow.
   - End-to-end tests for auth and protected routes.

8. Security hardening
   - Validate uploaded files beyond extension.
   - Add anti-abuse constraints and audit logging.

9. Accessibility improvements
   - Keyboard navigation and ARIA audit for custom accordion and uploader.

---

## Acknowledgements

Built with React Router, Vite, Tailwind, Puter SDK, PDF.js, and OpenRouter.
