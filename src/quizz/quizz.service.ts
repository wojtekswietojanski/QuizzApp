import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/prisma/prisma.service';
import { QuizzInput } from './dto/quizzCreate-input';
import { FetchQuizzInput } from './dto/fetchQuizz-input';
import { ChechQuizzInput } from './dto/checkQuiz-input';

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

  async fetchQuizz(fetchInput: FetchQuizzInput) {
    //finding specific quizz

    const quizz = await this.prisma.quizz.findUnique({
      where: { InviteCode: fetchInput.inviteCode },
    });

    if (!quizz) {
      throw new Error('No quizz with that invite code');
    }

    //finding specific set of questions
    const questions = [];
    for (let i = 0; i < quizz.numbersOfQuestions; i++) {
      let questionId = fetchInput.inviteCode.toString() + i.toString();
      let question = await this.prisma.question.findFirst({
        where: { id: questionId },
      });
      questions.push(question);
    }

    // finding specific set of answers
    const answersArray = [];
    for (let i = 0; i < quizz.numbersOfQuestions; i++) {
      let questionId = fetchInput.inviteCode.toString() + i.toString();
      let answers = await this.prisma.answer.findMany({
        where: { questionId: questionId },
      });
      answersArray.push(answers);
    }

    const responseObject = {
      name: quizz.name,
      inviteCode: quizz.InviteCode,
      questions: questions,
      answers: answersArray,
    };

    return responseObject;
  }

  async checkAnswers(checkInput: ChechQuizzInput) {
    let punctacion = 0;
    //Input validation
    const quizz = await this.prisma.quizz.findUnique({
      where: { InviteCode: checkInput.inviteCode },
    });

    if (!quizz) {
      throw new Error(`There is no quizz with such a inviteCode`);
    }

    if (quizz.numbersOfQuestions != checkInput.answers.length) {
      throw new Error(
        `The number of answer sets should be equal to the number of questions in a quizz`,
      );
    }

    //finding questions related to specific quizz
    const questions = [];
    for (let i = 0; i < quizz.numbersOfQuestions; i++) {
      let questionId = checkInput.inviteCode.toString() + i.toString();
      let question = await this.prisma.question.findFirst({
        where: { id: questionId },
      });
      questions.push(question);
    }

    // checking if the provided answer is right
    for (let i = 0; i < questions.length; i++) {
      let pointsObtained = 0;
      let questionCode = checkInput.inviteCode.toString() + i.toString();
      let question = questions[i];
      let providedAnswers = checkInput.answers[i];
      let dataBasaAnswers = await this.prisma.answer.findMany({
        where: { questionId: questionCode },
      });
      //Handling questions cases
      if (question.type == 'text') {
        if (providedAnswers.length == 1) {
          for (let index = 0; index < dataBasaAnswers.length; index++) {
            if (
              dataBasaAnswers[index].content.toLowerCase() ==
              providedAnswers[0].content.toLowerCase()
            ) {
              pointsObtained = 1;
            }
          }
        }
      }
      if (question.type == 'choose') {
        pointsObtained = 1;
        let trueAnswersCount = await this.prisma.answer.count({
          where: {
            questionId: questionCode,
            isTrue: true,
          },
        });
        if (trueAnswersCount != providedAnswers.length) {
          pointsObtained = 0;
        }
        for (let index = 0; index < providedAnswers.length; index++) {
          const element = providedAnswers[index];
          let ifMatch = await this.prisma.answer.findFirst({
            where: {
              questionId: questionCode,
              content: element.content,
            },
          });
          if (!ifMatch) {
            pointsObtained = 0;
          }
        }
      }
      if (question.type == 'sort') {
        pointsObtained = 1;
        if (providedAnswers.length != dataBasaAnswers.length) {
          pointsObtained = 0;
        }
        for (let index = 0; index < providedAnswers.length; index++) {
          const element = providedAnswers[index];
          let ifMatch = await this.prisma.answer.findFirst({
            where: {
              questionId: questionCode,
              position: element.position,
            },
          });
          if (!ifMatch) {
            pointsObtained = 0;
          }
        }
      }
      punctacion += pointsObtained;
    }
    return {
      yourPoints: punctacion,
      maxPoints: quizz.numbersOfQuestions,
    };
  }
}
