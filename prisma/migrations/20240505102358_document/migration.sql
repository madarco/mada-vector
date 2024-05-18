/*
  Warnings:

  - You are about to drop the column `content` on the `PageChunks` table. All the data in the column will be lost.
  - Added the required column `document` to the `PageChunks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageChunks" DROP COLUMN "content",
ADD COLUMN     "document" TEXT NOT NULL;
