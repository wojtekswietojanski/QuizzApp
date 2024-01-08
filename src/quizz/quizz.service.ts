import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/prisma/prisma.service';
import { QuizzInput } from './dto/quizzCreate-input';

@Injectable()
export class QuizzService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createQuizz(quizzInput: QuizzInput) {
    // Checking if invite code is unique
    const ifInviteCodeUnique = await this.prisma.quizz.findUnique({
      where: { InviteCode: quizzInput.inviteCode },
    });
    if (ifInviteCodeUnique) {
      return { message: 'Quizz invite code is already in the database' };
    }

    //checking if each question have answers

    if (quizzInput.questions.length != quizzInput.answers.length) {
      return { message: 'for each question there should be an answer/s' };
    }

    try {
      const quizz = await this.prisma.quizz.create({
        data: {
          InviteCode: quizzInput.inviteCode,
          name: quizzInput.name,
          numbersOfQuestions: quizzInput.questions.length,
        },
      });

      for (let i = 0; i < quizzInput.questions.length; i++) {
        const question = quizzInput.questions[i];
        // input validation
        if (!question.content || !question.type) {
          throw new Error(`Invalid question structure at index ${i}`);
        }

        if (
          question.type != 'text' &&
          question.type != 'sort' &&
          question.type != 'choose'
        ) {
          throw new Error(`Invalid question structure at index ${i}`);
        }

        //
        let questionId = quizzInput.inviteCode.toString() + i.toString();

        await this.prisma.question.create({
          data: {
            id: questionId,
            content: question.content,
            type: question.type,
          },
        });

        for (let x = 0; x < quizzInput.answers[i].length; x++) {
          const answer = quizzInput.answers[i][x];
          let answerPosition;
          if (!answer.position) {
            answerPosition = null;
          }
          await this.prisma.answer.create({
            data: {
              questionId: questionId,
              isTrue: answer.isTrue,
              content: answer.content,
              position: answerPosition,
            },
          });
        }
      }

      return { message: 'Quizz created successfully' };
    } catch (error) {
      throw new Error('An error occurred during creating the quizz:');
    }
  }
}
