/*
  Warnings:

  - You are about to drop the column `parentCommitId` on the `Commit` table. All the data in the column will be lost.
  - Added the required column `content` to the `Commit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Commit" DROP CONSTRAINT "Commit_parentCommitId_fkey";

-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "parentCommitId",
ADD COLUMN     "content" TEXT NOT NULL;
