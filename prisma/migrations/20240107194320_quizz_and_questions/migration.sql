/*
  Warnings:

  - You are about to drop the column `questions` on the `Quizz` table. All the data in the column will be lost.
  - Added the required column `numbersOfQuestions` to the `Quizz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quizz" DROP COLUMN "questions",
ADD COLUMN     "numbersOfQuestions" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "questionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isTrue" BOOLEAN NOT NULL,
    "position" INTEGER,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);
