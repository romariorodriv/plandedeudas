CREATE TABLE "Feedback" (
  "id" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "category" TEXT,
  "pageUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WaitlistLead" (
  "id" TEXT NOT NULL,
  "contact" TEXT NOT NULL,
  "contactType" TEXT NOT NULL,
  "consent" BOOLEAN NOT NULL,
  "pageUrl" TEXT,
  "utmSource" TEXT,
  "utmMedium" TEXT,
  "utmCampaign" TEXT,
  "referrer" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WaitlistLead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ArticleRating" (
  "id" TEXT NOT NULL,
  "articleSlug" TEXT NOT NULL,
  "helpful" BOOLEAN NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ArticleRating_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt");
CREATE INDEX "WaitlistLead_createdAt_idx" ON "WaitlistLead"("createdAt");
CREATE INDEX "WaitlistLead_contactType_idx" ON "WaitlistLead"("contactType");
CREATE INDEX "ArticleRating_articleSlug_idx" ON "ArticleRating"("articleSlug");
CREATE INDEX "ArticleRating_createdAt_idx" ON "ArticleRating"("createdAt");
