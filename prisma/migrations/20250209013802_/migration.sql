/*
  Warnings:

  - You are about to drop the column `roomId` on the `CodeDocument` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Commit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `CodeDocument` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `CodeDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `CodeDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CodeDocument_roomId_key";

-- AlterTable
ALTER TABLE "CodeDocument" DROP COLUMN "roomId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "teamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "timestamp";

-- CreateIndex
CREATE UNIQUE INDEX "CodeDocument_name_key" ON "CodeDocument"("name");

-- AddForeignKey
ALTER TABLE "CodeDocument" ADD CONSTRAINT "CodeDocument_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
