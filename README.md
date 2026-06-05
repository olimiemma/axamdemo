# AXAM Demo — Offline AI Tutor Preview

[![Live Demo](https://img.shields.io/badge/Live_Demo-https://axamdemo.pages.dev/-2DA0D9?style=for-the-badge&logo=cloudflare&logoColor=white)](https://axamdemo.pages.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A fully static, zero-backend demo of [AXAM](http://axamai.org/) — your offline AI tutor powered by 7,600+ MIT lectures.

> **This is a demo site only.** The full app runs locally with actual LLMs, vector embeddings, and RAG capabilities.

---

## 🎯 Live Demo

**https://axamdemo.pages.dev/**

No installation. No backend. Just click and explore the complete AXAM interface.

---

## 📋 What This Demo Shows

| Feature | Status | Description |
|---------|--------|-------------|
| 🏠 **Home Dashboard** | ✅ Full | Hero section, feature cards, subject explorer |
| 💬 **Chat Interface** | ✅ UI Complete | Sends messages, shows typing animation → explains offline LLM |
| 📚 **Lecture Browser** | ✅ **Fully Functional** | 10 subjects, 20 courses, 70+ real MIT lectures with YouTube links |
| 📝 **Exam Prep** | ✅ UI Complete | Setup form, topic input → explains offline LLM |
| 🎛️ **Model Picker** | ✅ Interactive | 3-tier model selection demo (Gemma 3, Gemma 2, Qwen) |
| 🔍 **Search** | ✅ Working | Filter lectures across all mock data |
| 📱 **Responsive** | ✅ Full | Mobile, tablet, and desktop layouts |

**LLM-dependent features (Chat & Exam generation) show a demo modal explaining the offline AI system — no actual inference happens in this static demo.**

---

## 🗂️ Demo Data (Real MIT OCW Lectures)

The demo includes real lecture metadata from MIT OpenCourseWare:

```
📐 Mathematics (820 lectures, 12 courses)
   ├── MIT 18.01 — Single Variable Calculus
   ├── MIT 18.02 — Multivariable Calculus  
   ├── MIT 18.03 — Differential Equations
   └── MIT 18.06 — Linear Algebra

⚛️ Physics (735 lectures, 11 courses)  
   ├── MIT 8.01 — Classical Mechanics
   ├── MIT 8.02 — Electricity & Magnetism
   └── MIT 8.04 — Quantum Physics I

💻 Computer Science (1,240 lectures, 18 courses)
   ├── MIT 6.006 — Introduction to Algorithms
   ├── MIT 6.042J — Mathematics for CS
   └── MIT 6.034 — Artificial Intelligence

... 7 more subjects (Biology, Chemistry, Economics, Engineering, etc.)
```

Each lecture includes:
- ✅ Real title and description
- ✅ Real YouTube video ID and URL  
- ✅ Real duration and view counts
- ✅ Course code and subject classification

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6) |
| **Icons** | Emoji + custom SVG assets |
| **Deployment** | Cloudflare Pages (static hosting) |
| **Build** | Zero — no bundlers, no transpilers, no dependencies |
| **Security** | DOM-based HTML escaping (`AXAM.esc()`), no `eval()`, no inline injection vectors |

**Zero external APIs.** The demo is 100% self-contained — all data is baked into JavaScript files.

---

## 📁 Repository Structure

```
demo/
├── index.html          # Main SPA with demo banner and modal
├── css/
│   └── styles.css      # Full production styles + demo additions
├── js/
│   ├── app.js          # Core: mock data engine, navigation, model picker
│   ├── chat.js         # Chat UI with demo interception
│   ├── browse.js       # Fully functional lecture browser
│   └── exam.js         # Exam setup UI with demo interception
├── img/
│   ├── icon.png        # AXAM icon
│   ├── logo-circle.png # Circular logo
│   ├── avatar.png      # User avatar
│   └── ...             # All app images
└── README.md           # This file
```

**Total size:** ~2.2 MB (all assets included)

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/olimiemma/axamdemo.git
cd axamdemo

# Serve with Python (or any static server)
python3 -m http.server 8080

# Open http://localhost:8080/demo/
```

No build step. No installation. No environment variables.

---

## 🔒 Security Audit

| Check | Status |
|-------|--------|
| API keys in code | ✅ None present |
| XSS sanitization | ✅ `AXAM.esc()` used everywhere |
| `eval()` usage | ✅ Zero instances |
| External requests | ✅ None (pure static) |
| CSRF protection | ✅ N/A (no forms with side effects) |

The demo is safe to fork, clone, and host anywhere.

---

## 🎨 Demo-Specific Features

### Demo Banner
Persistent top bar explaining this is a preview, with link to the full app.

### Demo Modal
Informational overlay triggered by LLM-dependent features, explaining:
- The 3-tier offline model system (Gemma 3 4B, Gemma 2 2B, Qwen 1.5B)
- RAG pipeline with ChromaDB and BGE-M3 embeddings
- 100% offline operation with no API costs

### Model Picker (Sidebar)
Interactive dropdown showing the three model tiers. Users can switch between them — the UI updates with model descriptions and speed ratings.

---

## 📦 Deployment

This site is deployed on [Cloudflare Pages](https://pages.cloudflare.com/):

1. Push to `main` branch on GitHub
2. Cloudflare automatically builds and deploys
3. Live at: https://axamdemo.pages.dev/

To deploy your own fork:
```bash
# Fork the repo, then in Cloudflare Pages:
# Connect GitHub repo → Select framework preset "None" → Deploy
```

---

## 🔗 Related Links

| Link | Purpose |
|------|---------|
| [axamdemo.pages.dev](https://axamdemo.pages.dev/) | Live demo site |
| [axamai.org](http://axamai.org/) | Full AXAM application |
| [@olimiemma](https://github.com/olimiemma) | Developer GitHub |
| [Buy Me a Coffee](https://buymeacoffee.com/olimiemmas) | Support the project |

---

## 📄 License

MIT — use freely for learning, demos, or as a template for your own static SPA.

---

## 🙏 Acknowledgments

- **MIT OpenCourseWare** — Lecture metadata and YouTube content
- **Emmanuel Olimi Kasigazi** — Creator of AXAM
- **Claude Opus 4.6** — AI assistance for this demo

---

## ⚠️ Disclaimer

This is a **demonstration website** only. The full AXAM application requires local installation with actual LLM models, ChromaDB, and the complete 7,600+ lecture transcript database. The demo contains mock responses for LLM-dependent features and does not perform any actual AI inference.

---

*Built for learning. Made with ❤️ for offline education everywhere.*
```
