# AXAM Demo Site — Session Report

**Date:** 2026-04-13
**Author:** Emmanuel (Developer) + Claude Opus 4.6 (AI Assistant)
**Deployed at:** https://axamdemo.pages.dev/
**Repository:** https://github.com/olimiemma/axamdemo
**Full App:** http://axamai.org/

---

## 1. Objective

Create a static, publicly-hostable demo website for the AXAM offline AI tutor. The demo must:

- Replicate the full AXAM UI and UX exactly as it appears in the desktop app
- Allow users to navigate all pages and interact with all controls
- Work without any backend, LLM models, or heavy vector/transcript data
- Gracefully inform users when they hit an LLM-dependent feature (chat, exam generation)
- Be deployable on GitHub Pages or Cloudflare Pages with zero build step
- Not modify or delete any existing files in the main `axam-app/` project

---

## 2. Architecture Overview

### Production App (for reference)
```
Python FastAPI server (server.py)
├── RAG Engine (rag_engine.py) — ChromaDB + BGE-M3 embeddings + LLM inference
├── Exam Engine (exam_engine.py) — LLM-powered question generation
├── Lecture Index (lecture_index.py) — 7,600+ lectures from transcript_mapping.json
├── Config (config.py) — 3-tier LLM model system (Gemma 3 4B / Gemma 2 2B / Qwen 2.5 1.5B)
└── Static Frontend (static/) — HTML/CSS/JS SPA
    ├── index.html
    ├── css/styles.css
    ├── js/app.js (routing, status polling, model picker)
    ├── js/chat.js (streaming RAG chat)
    ├── js/browse.js (subject/course/lecture hierarchy)
    └── js/exam.js (exam generation & quiz UI)
```

### Demo Site (what we built)
```
demo/ (2.2 MB total, purely static)
├── index.html — Main SPA with demo banner + demo modal
├── css/styles.css — Full production styles + demo-specific additions
├── js/app.js — Mock data engine, navigation, model picker, demo modal
├── js/chat.js — Chat UI with demo interception
├── js/browse.js — Fully functional lecture browser (mock data)
├── js/exam.js — Exam setup UI with demo interception
└── img/ — All app images (icon, logo variants, avatar, favicon)
```

**Key design decision:** The demo is a self-contained static site with NO backend dependency. All data is baked into JavaScript. No `fetch()` calls, no API endpoints, no server required.

---

## 3. What Was Built — File-by-File

### 3.1 `index.html`
**Source reference:** Mirrors `static/index.html` from the production app.

**Changes from production:**
- Removed the loading screen (no server to wait for — app shows immediately)
- Added `<div id="demo-banner">` — persistent top bar with "DEMO" badge, explanation text, and link to http://axamai.org/
- Added `<div id="demo-modal">` — overlay modal triggered by LLM-dependent features
- Changed all asset paths from `/static/...` to relative paths (`img/...`, `css/...`, `js/...`) for static hosting compatibility
- Model picker `<select>` is no longer disabled — populated dynamically by JS
- HTML entity references used instead of raw emoji (for cross-platform consistency)

### 3.2 `css/styles.css`
**Source reference:** Copy of `static/css/styles.css` with additions.

**Identical sections:** All production styles preserved verbatim — reset, layout, sidebar, cards, buttons, inputs, breadcrumbs, badges, tabs, toasts, spinners, empty states, home page, chat page, browse page, exam page, lecture detail, responsive breakpoints.

**Additions:**
- `--demo-orange` and `--demo-banner-h` CSS variables
- `#demo-banner` — 38px fixed top bar (gradient background, orange accent border)
- `.demo-banner-badge` — "DEMO" pill label
- `.demo-modal-overlay` / `.demo-modal` — centered modal with backdrop blur, slide-up animation
- `#main-app` height adjusted to `calc(100vh - var(--demo-banner-h))` to account for banner
- `.demo-footer-tag` — orange "Demo Mode" label in sidebar footer
- Responsive rule hides banner text on mobile (keeps badge visible)

### 3.3 `js/app.js` — Core Application (Mock Data Engine)
**Source reference:** Reimplements `static/js/app.js` without any API calls.

**Mock data (`MOCK_SUBJECTS` array):**
- 10 subjects: Mathematics, Physics, Computer Science, Biology, Chemistry, Economics, Engineering, Brain & Cognitive Sciences, Earth & Environmental Sciences, Humanities & Arts
- 20 courses across those subjects (e.g., MIT 18.01, 18.02, 18.03, 18.06, 8.01, 8.02, 8.04, 6.006, 6.042J, 6.034, 7.012, 7.013, 5.111, 14.01, 14.02, 6.002, 9.00SC, 12.001, 24.261, 21L.011)
- 70+ individual lectures with **real data** from `transcript_mapping.json`:
  - Real YouTube video IDs
  - Real YouTube URLs (e.g., `https://www.youtube.com/watch?v=7K1sB05pE0A`)
  - Real durations and view counts
  - Real lecture titles
- Subject-level counts reflect the full app totals (e.g., Mathematics: 820 lectures, 12 courses)
- Flat indices `ALL_LECTURES` and `LECTURE_BY_ID` built at load time for search

**Removed from production:**
- `pollStatus()` — no server to poll
- `api()` / `apiPost()` — no backend
- `loadModels()` via API — replaced with static model list
- `ragReady` flag — not needed

**Added for demo:**
- `showDemoModal(feature, icon)` — displays the informational overlay explaining the offline model system
- `closeDemoModal(event)` — closes on button click or overlay click (not inner modal click)
- `initModelPicker()` — populates the select with 3 model tiers, handles change events
- `switchModel(key)` — updates info panel, shows toast notification
- `MODELS` array — static list of {key, name, tier, requires_gpu, speed, desc}

**Public API:** `navigate`, `homeSearch`, `switchModel`, `toast`, `showDemoModal`, `closeDemoModal`, `formatDuration`, `formatViews`, `esc`, `MOCK_SUBJECTS`, `ALL_LECTURES`, `LECTURE_BY_ID`, `currentPage`

### 3.4 `js/chat.js` — Chat Module (Demo Mode)
**Source reference:** Reimplements `static/js/chat.js` without streaming/API.

**Behavior:**
1. User types a message or clicks a suggestion
2. User message is displayed with "U" avatar (identical to production)
3. Assistant placeholder appears with typing animation (3 bouncing dots)
4. After 1.2 seconds, the typing indicator is replaced with a demo explanation message
5. The demo modal opens explaining the LLM feature

**Preserved from production:** `appendMessage()`, `renderMarkdown()` (with `AXAM.esc()` for XSS safety), `scrollToBottom()`, auto-resize textarea behavior.

**Removed:** Streaming SSE reader, `fetch()` to `/api/chat/stream`, source citation rendering, `isStreaming` state management, `ragReady` check.

### 3.5 `js/browse.js` — Browse Module (Fully Functional)
**Source reference:** Reimplements `static/js/browse.js` using mock data instead of API calls.

**Fully working features:**
- Subject grid with icons, lecture/course counts
- Drill-down: Subject → Courses → Lectures → Lecture Detail
- Breadcrumb navigation at every level
- Search with 300ms debounce — filters across all mock lectures by title
- Lecture detail page with duration, view count, subject badge, course code
- **YouTube links** — "Watch on YouTube (online)" link on each lecture detail page
- Cross-module actions: "Chat about this lecture" → opens Chat + sends message; "Generate exam questions" → opens Exam + prefills topic

**Data flow:** Instead of `AXAM.api('/api/subjects')`, calls `AXAM.MOCK_SUBJECTS` directly. No caching layer needed since data is in-memory.

### 3.6 `js/exam.js` — Exam Module (Demo Mode)
**Source reference:** Reimplements `static/js/exam.js` setup form only.

**Behavior:**
1. Renders the full exam setup form (topic input, question count select, question type select)
2. User fills in topic and clicks "Generate Questions"
3. Loading spinner appears for 1.5 seconds ("Generating N questions...")
4. Form re-renders with topic preserved, demo modal opens
5. `prefill(topic, videoId)` works when called from Browse → "Generate exam questions"

**Not included (LLM-dependent):** Quiz rendering, option selection, answer evaluation, results/scoring, retake functionality. These require actual generated questions from the LLM.

### 3.7 `img/`
Copied verbatim from `static/img/`:
- `icon.png` — AXAM icon (sidebar, chat avatar, favicon)
- `logo-circle.png` — Circular logo (home hero, loading screen)
- `logo-full.png` — Full logo with text
- `logo.png` — Standard logo
- `avatar.png` — User avatar
- `favicon.png` — Browser tab icon

---

## 4. Security Audit

Audited against the security checklist in `/home/legend/Pictures/Seciuri/` (5 screenshots covering: exposed API keys, rate limiting, input sanitization, row-level security, and a pre-ship checklist).

### 4.1 Exposed API Keys
**Status: PASS**

- No API keys, tokens, secrets, passwords, or credentials anywhere in the codebase
- No `.env` files, no `config` files with sensitive values
- No backend communication at all — zero `fetch()`, `XMLHttpRequest`, or `eval()` calls
- The repo is safe for public GitHub — nothing to leak

### 4.2 Rate Limiting
**Status: N/A (no server)**

- The demo is purely static HTML/CSS/JS served by Cloudflare Pages
- Cloudflare provides its own DDoS protection and rate limiting at the CDN level
- No API endpoints exist to abuse

### 4.3 Input Sanitization (XSS Prevention)
**Status: PASS**

All user-provided text is sanitized before DOM insertion:

- **`AXAM.esc(str)`** — Used consistently throughout all modules. Creates a `<div>`, sets `textContent`, reads `innerHTML` — this is the standard DOM-based HTML escaping pattern. Converts `<`, `>`, `&`, `"` to safe entities.
- **Chat messages:** User input goes through `AXAM.esc()` inside `renderMarkdown()` before any `innerHTML` assignment (chat.js:65). Markdown formatting is applied only via safe regex replacements on already-escaped text.
- **Search queries:** Escaped via `AXAM.esc()` before display in breadcrumbs (browse.js:164) and "no results" messages (browse.js:299).
- **Exam topic:** Escaped via `AXAM.esc()` before display in loading screen (exam.js:86-87).
- **Lecture titles/metadata:** All rendered through `AXAM.esc()` in browse.js detail views.
- **`jsStr()` helper:** Used for values injected into `onclick` attributes — escapes backslashes, single quotes, and double quotes to prevent attribute injection.
- **No `eval()`** — Zero instances in the codebase.
- **No `document.write()`** — Zero instances.
- **No inline script injection vectors** — All dynamic content goes through escaping.

**One minor note:** The `renderMarkdown()` function in chat.js applies regex-based formatting (bold, italic, code) to already-escaped text. Since the text is escaped first, this is safe — the regex only matches literal `*` and `` ` `` characters that were in the original user text, not injected HTML.

### 4.4 Row-Level Security (RLS)
**Status: N/A**

- No database, no user accounts, no authentication
- All data is static and public (MIT OCW lecture metadata)
- No user-specific data exists to protect

### 4.5 Pre-Ship Checklist
| Check | Status |
|---|---|
| API keys in `.env`, not in code | N/A — no keys |
| `.env` in `.gitignore` | N/A — no `.env` |
| Rate limiting on public endpoints | N/A — no endpoints (Cloudflare CDN handles) |
| User input validated server-side | N/A — no server |
| RLS enabled on all tables | N/A — no database |
| Tested with a second account | N/A — no accounts |

### 4.6 Additional Security Observations

- **External links:** YouTube URLs use `target="_blank"` but do not include `rel="noopener noreferrer"`. Modern browsers handle this safely (noopener is default since Chrome 88+, Firefox 79+, Safari 12.1+), but adding it explicitly would be best practice.
- **CSP headers:** The production app sets Content-Security-Policy headers via middleware. The static demo relies on Cloudflare's default headers. A `<meta>` CSP tag could be added to `index.html` for defense-in-depth.
- **No cookies or localStorage:** The demo stores no persistent data whatsoever.

---

## 5. Deployment

### GitHub
- Repository: https://github.com/olimiemma/axamdemo
- Branch: `main`
- Single commit: `064baec` — "Initial commit: AXAM demo site for GitHub Pages"

### Cloudflare Pages
- Live URL: https://axamdemo.pages.dev/
- Deployed directly from the GitHub repo
- No build step — Cloudflare serves the static files as-is
- Automatic HTTPS via Cloudflare

---

## 6. User Experience Flow

```
User visits https://axamdemo.pages.dev/
    │
    ├── Sees DEMO banner at top ("You're viewing a live demo...")
    │
    ├── HOME PAGE
    │   ├── AXAM logo + tagline
    │   ├── Search bar (routes to Browse or Chat)
    │   ├── 3 feature cards (Chat, Browse, Exam)
    │   └── 10 subject cards (clickable → Browse)
    │
    ├── CHAT PAGE
    │   ├── Welcome screen with 4 suggestion pills
    │   ├── User types or clicks suggestion
    │   ├── Message appears → typing dots → demo response
    │   └── Demo modal opens explaining offline LLM
    │
    ├── BROWSE PAGE
    │   ├── 10 Subject cards with icons
    │   ├── Click → Course list (e.g., MIT 18.01, 18.02...)
    │   ├── Click → Lecture list with duration/views
    │   ├── Click → Lecture detail with YouTube link
    │   ├── Breadcrumb navigation throughout
    │   └── Search bar filters across all lectures
    │
    ├── EXAM PAGE
    │   ├── Setup form (topic, count, type)
    │   ├── Click Generate → loading spinner
    │   └── Demo modal opens explaining offline LLM
    │
    └── MODEL PICKER (sidebar)
        ├── Dropdown with 3 tiers (T1: Gemma 3 4B, T2: Gemma 2 2B, T3: Qwen 2.5 1.5B)
        ├── Switch between models → info panel updates
        └── Toast notification on switch
```

---

## 7. Technical Decisions & Rationale

| Decision | Rationale |
|---|---|
| Bake data into JS, not JSON fetch | Eliminates CORS issues, works on `file://`, zero network requests |
| Use real lecture data from `transcript_mapping.json` | Authenticity — real titles, real YouTube URLs, real view counts |
| Keep only a sample (~70 lectures) not all 7,600+ | Demo needs to stay under a few hundred KB; subject counts still show full numbers |
| Show typing animation before demo message | Makes chat feel real for 1.2 seconds before the explanation |
| Preserve exam setup form after demo modal | User doesn't lose their topic input |
| Model picker is interactive (not just display) | Lets users understand the 3-tier system by clicking through |
| Separate `demo/` directory, no changes to existing files | Zero risk to production codebase |

---

## 8. Files NOT Modified

No existing files in `axam-app/` were modified or deleted. The entire demo lives in the new `demo/` directory. The following production files were only **read** for reference:

- `server.py` — API routes and endpoints
- `main.py` — Entry point and server startup
- `config.py` — Model definitions and hardware detection
- `lecture_index.py` — Subject/course hierarchy logic
- `static/index.html` — UI structure
- `static/css/styles.css` — Design system
- `static/js/app.js` — Core app logic
- `static/js/chat.js` — Chat streaming logic
- `static/js/browse.js` — Browse hierarchy logic
- `static/js/exam.js` — Exam generation and quiz logic
- `OCW Extract/transcript_mapping.json` — Real lecture data (for YouTube URLs)

---

## 9. For Future Developers / AI Agents

### To update the demo:
1. Edit files in `demo/` — it's a self-contained static site
2. Push to `main` on `olimiemma/axamdemo` — Cloudflare auto-deploys
3. To add more lectures, add entries to the `MOCK_SUBJECTS` array in `demo/js/app.js`

### To add a custom domain:
1. In Cloudflare Pages dashboard → Custom Domains → add your domain
2. Update DNS to point to Cloudflare Pages

### To convert to a full interactive demo (with mock LLM responses):
1. In `chat.js`, replace the demo modal trigger with pre-written sample responses
2. In `exam.js`, add a `MOCK_QUESTIONS` array and render the full quiz UI
3. The quiz/results UI code from `static/js/exam.js` can be copied directly — it's all client-side

### Key patterns to preserve:
- Always use `AXAM.esc()` before inserting user text into the DOM
- Always use `jsStr()` for values in `onclick` attribute strings
- Keep all data in the JS files — no external fetches
- Test with `python3 -m http.server 8080` in the `demo/` directory
