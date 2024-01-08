/*
  Warnings:

  - A unique constraint covering the columns `[InviteCode]` on the table `Quizz` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quizz_InviteCode_key" ON "Quizz"("InviteCode");
