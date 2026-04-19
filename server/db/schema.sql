-- IELTS Mock Test Platform - SQLite Schema
-- Flexible: each question stores a JSON payload so any IELTS question type is supported.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student', -- student | admin
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- A "test" is a full IELTS mock test of a single skill type
-- e.g. "Cambridge IELTS 20 Academic Reading Test 4"
CREATE TABLE IF NOT EXISTS tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  skill TEXT NOT NULL,                  -- reading | listening | writing | speaking
  description TEXT,
  duration_min INTEGER NOT NULL DEFAULT 60,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- A section is a passage (reading), part (listening), task (writing), or part (speaking)
CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT,
  instructions TEXT,
  body TEXT,                -- passage text for reading; prompt for writing/speaking; transcript for listening (optional)
  audio_path TEXT,          -- listening parts
  image_path TEXT,          -- writing task 1 diagrams / speaking cards
  extra_json TEXT,          -- free-form JSON for type-specific metadata
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Questions live inside a section. For writing/speaking a section may have one "question" that is the long-form response.
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,        -- order within section
  number INTEGER,                       -- IELTS question number (1..40 for reading/listening)
  type TEXT NOT NULL,                   -- see supported types below
  prompt TEXT,                          -- the question text or blank stem
  data_json TEXT,                       -- JSON with type-specific fields: options, headings list, paragraph refs, word_limit, etc.
  answer_json TEXT,                     -- JSON with the correct answer(s). Writing/speaking have null (human/AI scored).
  points INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Supported question type values (stored in questions.type):
--  READING:
--    reading_matching_headings, reading_tfng, reading_ynng, reading_mcq_single, reading_mcq_multi,
--    reading_summary_completion, reading_sentence_completion, reading_short_answer,
--    reading_matching_information, reading_matching_features, reading_diagram_labelling
--  LISTENING:
--    listening_form_completion, listening_note_completion, listening_table_completion,
--    listening_flowchart_completion, listening_summary_completion, listening_sentence_completion,
--    listening_mcq_single, listening_mcq_multi, listening_matching, listening_map_labelling,
--    listening_short_answer
--  WRITING:
--    writing_task_1, writing_task_2
--  SPEAKING:
--    speaking_part_1, speaking_part_2, speaking_part_3

-- An attempt is one student's run of a test.
CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  test_id INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  submitted_at TEXT,
  score INTEGER,                 -- number of correct answers (reading/listening)
  total INTEGER,                 -- total possible
  band REAL,                     -- IELTS band estimate (0.0-9.0)
  feedback TEXT                  -- JSON with per-question correctness, writing/speaking feedback
);

CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id INTEGER NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  response_json TEXT,            -- JSON - user's response (string, array, or text)
  audio_path TEXT,               -- speaking attempts
  correct INTEGER,               -- 1/0/NULL (null for writing/speaking)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_sections_test ON sections(test_id);
CREATE INDEX IF NOT EXISTS idx_questions_section ON questions(section_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_answers_attempt ON answers(attempt_id);
