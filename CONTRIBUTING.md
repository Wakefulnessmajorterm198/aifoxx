# Contributing to AIFOXX 🦊

First time contributing to open source? **Welcome — this is a great place to start.**

## 🧭 Before You Start

- Browse [open issues](https://github.com/withkarann/aifoxx/issues) before starting major work
- Keep changes focused — small PRs get merged faster
- **Never fabricate tool data.** Use `null` where schema allows it

## ⚙️ Local Setup

```bash
git clone https://github.com/withkarann/aifoxx.git
cd aifoxx
npm install
npm run dev
```

## ✅ Required Checks Before PR

Run all of these:

```bash
npm run validate   # validate tools.json schema
npm run lint       # check code style
npm run build      # ensure no build errors
npm run test       # run unit tests
```

## 📋 Data Contribution Rules

When editing `src/data/tools.json`:

- ✅ All required schema fields must be present
- ✅ Use consistent `category` / `subcategory` naming
- ✅ URLs must be real and verified
- ❌ No duplicate slugs or tool names
- ❌ No fabricated pricing or compliance data — use `null`

## 🔀 Pull Request Guidelines

- Use a clear, descriptive title
- Explain **what** changed and **why**
- Include screenshots for UI changes
- Note any schema or data migration impact

## 💬 Questions?

[Open a Discussion](https://github.com/withkarann/aifoxx/discussions) — we're friendly. 🙌
