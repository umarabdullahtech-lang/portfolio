-- Expand the project table from a card summary into the complete case-study model.
-- Defaults protect existing installations; scripts/sync-projects.ts replaces these
-- temporary values with the reviewed catalog content after the migration.
ALTER TABLE "projects"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "kicker" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "shortDescription" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Engineering System',
  ADD COLUMN "role" TEXT NOT NULL DEFAULT 'Product and systems engineering',
  ADD COLUMN "period" TEXT NOT NULL DEFAULT 'Documented',
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'Documented',
  ADD COLUMN "imageAlt" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "proof" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "challenge" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "system" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "outcome" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "capabilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "architecture" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "engineeringNotes" JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN "verification" TEXT NOT NULL DEFAULT '';

-- Existing IDs are unique and make a safe temporary route until catalog sync runs.
UPDATE "projects" SET "slug" = "id" WHERE "slug" IS NULL;
UPDATE "projects" SET "techStack" = ARRAY[]::TEXT[] WHERE "techStack" IS NULL;

ALTER TABLE "projects"
  ALTER COLUMN "slug" SET NOT NULL,
  ALTER COLUMN "techStack" SET NOT NULL;

CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");
