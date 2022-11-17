/*
  Warnings:

  - You are about to drop the `AuthPayload` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthPayload" DROP CONSTRAINT "AuthPayload_userId_fkey";

-- DropTable
DROP TABLE "AuthPayload";

-- CreateTable
CREATE TABLE "_Votes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Votes_AB_unique" ON "_Votes"("A", "B");

-- CreateIndex
CREATE INDEX "_Votes_B_index" ON "_Votes"("B");

-- AddForeignKey
ALTER TABLE "_Votes" ADD CONSTRAINT "_Votes_A_fkey" FOREIGN KEY ("A") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Votes" ADD CONSTRAINT "_Votes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
