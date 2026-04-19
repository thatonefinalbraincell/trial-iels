# IELTS Mock Test Platform

End-to-end IELTS practice platform built with **Nuxt 3 (Nitro backend) + SQLite + local file storage**. Replicates the full computer-delivered IELTS UI for Reading, Listening, Writing and Speaking tests, with a full admin dashboard for uploading your own passages, audio, images and questions.

## Features

- Full IELTS-style test-taking UI (top bar with timer, split-panel passage + questions, bottom question navigator).
- All four skill types supported end-to-end:
  - **Reading** — 3 passages, 40 questions, auto-graded.
  - **Listening** — 4 parts, audio player, 40 questions, auto-graded.
  - **Writing** — 2 tasks with word-count tracking (human/AI graded).
  - **Speaking** — 3 parts with in-browser microphone recording and audio upload.
- All 20+ IELTS question types (matching headings, TFNG/YNNG, MCQ single/multi, summary/sentence/note/table/form/flow-chart/map/diagram completion, matching features/information, short answer, cue cards).
- **Admin dashboard** — create/edit/delete tests, sections, and questions; upload audio (.mp3, .wav) and images (chart/diagram/map); bulk add questions via JSON.
- **SQLite** database with a flexible JSON payload per question so adding new question types never requires a schema migration.
- **Local file storage** at `public/uploads/{audio,images}/` — everything stays on disk for easy migration later.
- **Automatic answer validation** with IELTS-standard tolerance (trim, lowercase, alternative acceptable answers with `|`).
- **Rough band-score estimation** (Cambridge conversion table for 40-item tests).
- **Simple admin authentication** via HMAC-signed cookie; student attempts may be anonymous.
- **Cloudflare Workers compatible** — swap the SQLite adapter for D1 and set `NITRO_PRESET=cloudflare-pages` to deploy.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and adjust the admin password / JWT secret if you wish
cp .env.example .env

# 3. Seed one complete Cambridge-style mock test per skill
npm run seed

# 4. Run dev server
npm run dev
# → http://localhost:3000

# Admin:
# → http://localhost:3000/admin/login
# → default password: admin123  (override via ADMIN_PASSWORD env var)
```

## Project layout

```
ielts-platform/
├── assets/css/main.css         IELTS-style UI theming (topbar, split, nav, timer)
├── components/
│   ├── QuestionRenderer.vue    Universal question renderer (all 20+ types)
│   ├── SpeakingRecorder.vue    Browser mic recorder with upload
│   └── admin/
│       ├── TestEditor.vue      Unified test editor (used by all 4 skills)
│       └── SkillList.vue       Per-skill test listing
├── layouts/
│   ├── default.vue             Landing/tests layout with topbar
│   ├── test.vue                Bare layout used by test-taking pages
│   └── admin.vue               Admin sidebar + main
├── pages/
│   ├── index.vue               Landing
│   ├── tests/
│   │   ├── index.vue           All published tests, grouped by skill
│   │   ├── reading/[id].vue    Reading test UI (split panels)
│   │   ├── listening/[id].vue  Listening test UI (audio player)
│   │   ├── writing/[id].vue    Writing test UI (editor + word count)
│   │   └── speaking/[id].vue   Speaking test UI (recorder per question)
│   ├── results/[id].vue        Score, band estimate, question-by-question review
│   └── admin/                  Admin dashboard
│       ├── login.vue           Admin password gate
│       ├── index.vue           Dashboard
│       ├── tests.vue           All tests CRUD
│       ├── reading/[id].vue    → delegates to AdminTestEditor
│       ├── listening/[id].vue
│       ├── writing/[id].vue
│       └── speaking/[id].vue
├── server/
│   ├── plugins/db.ts           Initialises SQLite on Nitro startup
│   ├── db/schema.sql           SQLite schema
│   ├── utils/
│   │   ├── db.ts               getDb() with auto-migration
│   │   ├── auth.ts             Sessions (HMAC cookie), bcrypt helpers
│   │   └── validate.ts         Per-type answer validator + band-score table
│   └── api/
│       ├── auth/               login, logout, register, me
│       ├── tests/              Public test listing + fetch (no answers)
│       ├── attempts/           start, submit, fetch results
│       └── admin/              All admin CRUD + login + upload
├── scripts/seed.ts             Seeds 1 full test per skill (Reading/Listening/Writing/Speaking)
├── public/uploads/audio/       Uploaded audio files served at /uploads/audio/*
├── public/uploads/images/      Uploaded images served at /uploads/images/*
├── data/ielts.sqlite           Auto-created SQLite database
└── nuxt.config.ts
```

## Admin workflow

1. Log in at `/admin/login`.
2. Click **Tests → + New Test**, choose a skill, and set a title.
3. Open the test, click **+ Add Passage/Part/Task** to create a section.
4. Fill in the section body (passage text, transcript, writing prompt, etc.). Upload audio (Listening) or image (Writing Task 1 / Listening maps) with the file pickers.
5. Click **+ Add Question**, pick a question type from the dropdown, and fill in the prompt/options/answer.
6. Repeat for all questions in the test.
7. The test is immediately available to students at `/tests` once its `published` flag is set (it is by default).

## Adding real Cambridge content

Cambridge IELTS test content is copyrighted. This platform ships with original, Cambridge-style mock content that mirrors the structure and question types of Cambridge IELTS 20 Academic Test 4 so you can test the full end-to-end flow. Use the admin dashboard to upload the real Cambridge content that you legally license — everything is schema-compatible.

## Deploying to Cloudflare Workers

1. Replace `better-sqlite3` with a Cloudflare D1 adapter in `server/utils/db.ts` (keep the same `getDb()` interface — most of the code already uses prepared statements).
2. Set `NITRO_PRESET=cloudflare-pages` in your `.env`.
3. `npm run build && wrangler pages deploy .output/public`.
4. Uploads (audio/images) should be re-pointed to R2 or KV; the `/api/admin/upload` handler is the only place to swap.

## Supported question types (stored in `questions.type`)

**Reading:** `reading_matching_headings`, `reading_tfng`, `reading_ynng`, `reading_mcq_single`, `reading_mcq_multi`, `reading_summary_completion`, `reading_sentence_completion`, `reading_short_answer`, `reading_matching_information`, `reading_matching_features`, `reading_diagram_labelling`.

**Listening:** `listening_form_completion`, `listening_note_completion`, `listening_table_completion`, `listening_flowchart_completion`, `listening_summary_completion`, `listening_sentence_completion`, `listening_mcq_single`, `listening_mcq_multi`, `listening_matching`, `listening_map_labelling`, `listening_short_answer`.

**Writing:** `writing_task_1`, `writing_task_2`.

**Speaking:** `speaking_part_1`, `speaking_part_2`, `speaking_part_3`.

## Environment variables

| Var | Default | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | `admin123` | Password for `/admin/login` |
| `JWT_SECRET` | (demo) | HMAC signing secret for session cookies |
| `DB_PATH` | `./data/ielts.sqlite` | SQLite file location |
| `UPLOAD_DIR` | `./public/uploads` | Upload destination |

## License

The code in this repo is free for you to use and modify. Any third-party content you upload via the admin panel remains subject to its own copyright.
