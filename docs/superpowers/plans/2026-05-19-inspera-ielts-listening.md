# Inspera-Style IELTS Listening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Inspera-style IELTS listening experience with Cambridge 17 Listening Test 1 content, practice/test modes, one-shot test audio, replayable practice audio, and admin support for similar question sets.

**Architecture:** Keep the existing Nuxt/D1 schema and extend question JSON payloads rather than migrating the database. Rework the listening test page into an Inspera-like shell, enhance the shared question renderer for choice chips/word-bank gap interactions, and seed Cambridge content through the existing local SQLite-to-D1 pipeline.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, D1-compatible SQL, TypeScript seed scripts, CSS in `assets/css/main.css`, Node built-in test runner for small helper behavior.

---

### Task 1: Mode and Audio Behavior

**Files:**
- Create: `utils/listeningMode.ts`
- Test: `tests/listeningMode.test.ts`
- Modify: `package.json`

- [ ] Add a helper that normalizes `practice` / `test` mode, reports whether audio controls/replay are allowed, and builds mode-specific routes.
- [ ] Write Node tests for default mode, replay rules, and invalid mode fallback.
- [ ] Add `npm test` using Node's built-in test runner.

### Task 2: Question Rendering Patterns

**Files:**
- Modify: `components/QuestionRenderer.vue`
- Modify: `assets/css/main.css`

- [ ] Add Inspera-style compact number gaps, word-bank choice chips, selectable answer assignment, and keep text-input fallback for completion questions.
- [ ] Keep radio/checkbox/select support for existing IELTS question types.
- [ ] Add renderer CSS that is scoped by question classes and does not break reading/writing/speaking.

### Task 3: Listening Student UI

**Files:**
- Modify: `pages/tests/listening/[id].vue`
- Modify: `assets/css/main.css`

- [ ] Replace the current navy test UI with an Inspera-like white IELTS header.
- [ ] Add practice/test mode switch from query string: `?mode=practice` or `?mode=test`.
- [ ] In test mode, block the page with a Play overlay, play audio once, hide native controls, prevent replay, and show “Audio is Playing”.
- [ ] In practice mode, show normal audio controls and allow replay.
- [ ] Add bottom navigator, previous/next controls, table-of-contents/review screen, submit confirmation, and attempted/current states.

### Task 4: Cambridge 17 Listening Test 1 Seed

**Files:**
- Modify: `scripts/seed.ts`
- Create: `scripts/extract-cambridge17-audio.ts`

- [ ] Add a real Cambridge 17 Listening Test 1 dataset from the licensed PDF text and answer key.
- [ ] Use `data_json.word_bank` where a question group needs selectable/movable choices.
- [ ] Set `extra_json` with source metadata and any discovered audio URLs.
- [ ] Add script support for decoding QR/audio links where possible and downloading linked audio to `public/uploads/audio` when a direct URL is found.

### Task 5: Admin Support

**Files:**
- Modify: `components/admin/TestEditor.vue`
- Modify: `pages/admin/listening/[id].vue` if needed

- [ ] Expose mode/source metadata guidance in the listening editor.
- [ ] Add word-bank editing for completion questions so admins can create drag/move-style prompts.
- [ ] Preserve all current CRUD flows.

### Task 6: Verification and Deploy

**Files:**
- Build output only

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run local preview or dev server and verify listening UI in browser for practice and test modes.
- [ ] Run deployment command if Cloudflare credentials are already available.
