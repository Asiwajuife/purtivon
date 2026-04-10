-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED');

-- Add status column with default DRAFT, map old published=true to PUBLISHED
ALTER TABLE "articles" ADD COLUMN "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT';
UPDATE "articles" SET "status" = 'PUBLISHED' WHERE "published" = true;

-- Convert content from text to jsonb (wrap existing plain-text content in a TipTap paragraph node)
ALTER TABLE "articles" ALTER COLUMN "content" TYPE JSONB USING
  CASE
    WHEN "content" IS NULL OR "content" = '' THEN '{"type":"doc","content":[]}'::jsonb
    ELSE jsonb_build_object(
      'type', 'doc',
      'content', jsonb_build_array(
        jsonb_build_object(
          'type', 'paragraph',
          'content', jsonb_build_array(
            jsonb_build_object('type', 'text', 'text', "content")
          )
        )
      )
    )
  END;

-- Drop old published column
ALTER TABLE "articles" DROP COLUMN "published";

-- Drop old index on published, add index on status
DROP INDEX IF EXISTS "articles_published_idx";
CREATE INDEX "articles_status_idx" ON "articles"("status");
