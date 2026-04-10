-- CreateTable
CREATE TABLE "award_winners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "link" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "award_winners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "award_winners_year_idx" ON "award_winners"("year");
