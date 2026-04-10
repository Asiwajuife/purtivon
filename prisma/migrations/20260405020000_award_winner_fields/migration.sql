-- Add quarter, company, region, featured fields to award_winners
ALTER TABLE "award_winners" ADD COLUMN "quarter" INTEGER;
ALTER TABLE "award_winners" ADD COLUMN "company" TEXT;
ALTER TABLE "award_winners" ADD COLUMN "region" TEXT;
ALTER TABLE "award_winners" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "award_winners_featured_idx" ON "award_winners"("featured");
