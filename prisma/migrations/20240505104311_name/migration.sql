/*
  Warnings:

  - You are about to drop the `PageChunks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PageChunks" DROP CONSTRAINT "PageChunks_pageId_fkey";

-- DropTable
DROP TABLE "PageChunks";

-- CreateTable
CREATE TABLE "page_chunks" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "meta" JSONB NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "page_chunks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "page_chunks" ADD CONSTRAINT "page_chunks_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
