-- Projects can leave the public archive without being deleted from the CMS.
ALTER TABLE "projects" ADD COLUMN "published" BOOLEAN NOT NULL DEFAULT true;

-- Curate the generated catalog. These records stay in /admin and can be
-- re-published there; src/data/projects.ts (ARCHIVE_HIDDEN_PROJECT_IDS) keeps
-- scripts/sync-projects.ts in agreement with this list.
UPDATE "projects" SET "published" = false WHERE "id" IN (
  -- Placeholders, practice repos, templates, and test workspaces
  'sample',
  'react-practice',
  'test-mautic',
  'template-boiler-plate',
  'comingsoonsite',
  'prompt-testing',
  'prompts',
  'python',
  -- Duplicate copies of projects that are already listed
  'chiari-malformations',
  'cerebralbiz-01',
  'nick-chatbot',
  'sanitary-test',
  'realtime-console',
  -- Upstream open-source code that is not original work
  'devika',
  'realtime',
  'openai-realtime-api-beta-main',
  'promptfoo',
  'mautic',
  'usama-portfolio',
  'voice-assitant',
  'ydlk-core',
  'new-ytdlcore',
  'whatsapp-backup-downloader',
  'listmonk-apis'
);

-- Fix catalog titles that came from folder names with typos or ambiguous wording.
-- Each update only applies while the record still has the generated title, so
-- titles edited in /admin are left alone.
UPDATE "projects" SET
  "title" = 'LinkedIn Scraper',
  "imageAlt" = replace("imageAlt", 'Linkedin Scrapper', 'LinkedIn Scraper'),
  "outcome" = replace("outcome", 'Linkedin Scrapper', 'LinkedIn Scraper')
WHERE "id" = 'linkedin-scrapper' AND "title" = 'Linkedin Scrapper';

UPDATE "projects" SET
  "title" = 'Chatwebby Without Website',
  "imageAlt" = replace("imageAlt", 'Chatwebby Without Werbite', 'Chatwebby Without Website'),
  "outcome" = replace("outcome", 'Chatwebby Without Werbite', 'Chatwebby Without Website')
WHERE "id" = 'chatwebby-without-werbite' AND "title" = 'Chatwebby Without Werbite';

UPDATE "projects" SET
  "title" = 'ShipGPT Website',
  "imageAlt" = replace("imageAlt", 'Ship GPT', 'ShipGPT Website'),
  "outcome" = replace("outcome", 'Ship GPT', 'ShipGPT Website')
WHERE "id" = 'shipgpt' AND "title" = 'Ship GPT';

UPDATE "projects" SET
  "title" = 'ShipGPT',
  "imageAlt" = replace("imageAlt", 'Shipgpt', 'ShipGPT'),
  "outcome" = replace("outcome", 'Shipgpt', 'ShipGPT')
WHERE "id" = 'new-folder-2' AND "title" = 'Shipgpt';

UPDATE "projects" SET
  "title" = 'SiteAudit',
  "imageAlt" = replace("imageAlt", 'OpenClaw Guru Automation Testing', 'SiteAudit'),
  "outcome" = replace("outcome", 'OpenClaw Guru Automation Testing', 'SiteAudit')
WHERE "id" = 'openclaw-guru-automatino-project-testing' AND "title" = 'OpenClaw Guru Automation Testing';

-- Projects without a public repository no longer claim "0 source repositories indexed".
UPDATE "projects"
SET "proof" = jsonb_set("proof", '{0}', '{"value": "Local", "label": "source folder reviewed, no public repository"}'::jsonb)
WHERE "proof" -> 0 ->> 'value' = '0'
  AND "proof" -> 0 ->> 'label' = 'source repositories indexed';

-- A zero is not evidence: projects without detected packages show their documented capabilities instead.
UPDATE "projects"
SET "proof" = jsonb_set("proof", '{1}', jsonb_build_object('value', cardinality("capabilities")::text, 'label', 'capabilities documented'))
WHERE "proof" -> 1 ->> 'value' = '0'
  AND "proof" -> 1 ->> 'label' = 'application packages detected';
