/*
  Warnings:

  - You are about to drop the column `embedding` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "embedding";

-- CreateTable
CREATE TABLE "PageChunks" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "PageChunks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PageChunks" ADD CONSTRAINT "PageChunks_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
