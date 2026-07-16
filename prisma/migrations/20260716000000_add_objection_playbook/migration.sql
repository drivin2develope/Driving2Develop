-- CreateTable
CREATE TABLE "Objection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'REALISTIC',
    "summary" TEXT NOT NULL,
    "whyItHappens" TEXT NOT NULL,
    "recommendedResponse" TEXT NOT NULL,
    "exampleScript" TEXT NOT NULL,
    "relatedTactics" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlaybookEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Objection_slug_key" ON "Objection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlaybookEntry_slug_key" ON "PlaybookEntry"("slug");
