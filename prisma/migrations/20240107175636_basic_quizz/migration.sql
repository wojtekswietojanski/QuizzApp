-- CreateTable
CREATE TABLE "Quizz" (
    "id" SERIAL NOT NULL,
    "questions" TEXT[],
    "name" TEXT NOT NULL,
    "InviteCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quizz_pkey" PRIMARY KEY ("id")
);
