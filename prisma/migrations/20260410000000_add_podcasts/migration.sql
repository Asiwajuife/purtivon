-- CreateTable: podcasts
CREATE TABLE IF NOT EXISTS "podcasts" (
  "id"          TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "youtubeUrl"  TEXT NOT NULL,
  "videoId"     TEXT NOT NULL,
  "thumbnail"   TEXT,
  "category"    TEXT,
  "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "podcasts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "podcasts_publishedAt_idx" ON "podcasts"("publishedAt");
