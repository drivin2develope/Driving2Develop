-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'REP',
    "industry" TEXT,
    "experienceLevel" TEXT,
    "goal" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "managerId" TEXT,
    CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredTalkingPoints" TEXT NOT NULL,
    "homeownerScript" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "transcript" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PracticeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PracticeSession_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "wordsPerMinute" REAL NOT NULL DEFAULT 0,
    "paceVariance" REAL NOT NULL DEFAULT 0,
    "fillerWordCount" INTEGER NOT NULL DEFAULT 0,
    "fillerWordRate" REAL NOT NULL DEFAULT 0,
    "pauseCount" INTEGER NOT NULL DEFAULT 0,
    "avgPauseLengthMs" REAL NOT NULL DEFAULT 0,
    "volumeVariation" REAL NOT NULL DEFAULT 0,
    "monotoneScore" REAL NOT NULL DEFAULT 0,
    "talkListenRatio" REAL NOT NULL DEFAULT 0,
    "clarityScore" REAL NOT NULL DEFAULT 0,
    "keywordAdherenceScore" REAL NOT NULL DEFAULT 0,
    "objectionHandledScore" REAL,
    "closingStrengthScore" REAL NOT NULL DEFAULT 0,
    "confidenceScore" REAL NOT NULL DEFAULT 0,
    "overallScore" REAL NOT NULL DEFAULT 0,
    "transcriptConfidence" TEXT NOT NULL DEFAULT 'HIGH',
    "tipsJson" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "Metric_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PracticeSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "managerId" TEXT NOT NULL,
    "repId" TEXT NOT NULL,
    "scenarioId" TEXT,
    "note" TEXT NOT NULL,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Assignment_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_repId_fkey" FOREIGN KEY ("repId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_managerId_idx" ON "User"("managerId");

-- CreateIndex
CREATE INDEX "PracticeSession_userId_idx" ON "PracticeSession"("userId");

-- CreateIndex
CREATE INDEX "PracticeSession_scenarioId_idx" ON "PracticeSession"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Metric_sessionId_key" ON "Metric"("sessionId");

-- CreateIndex
CREATE INDEX "Metric_sessionId_idx" ON "Metric"("sessionId");

-- CreateIndex
CREATE INDEX "Assignment_managerId_idx" ON "Assignment"("managerId");

-- CreateIndex
CREATE INDEX "Assignment_repId_idx" ON "Assignment"("repId");
