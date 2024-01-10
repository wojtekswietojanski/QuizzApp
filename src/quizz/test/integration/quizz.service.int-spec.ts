import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/prisma/prisma.service';
import { QuizzService } from '@src/quizz/quizz.service';
import { ExampleAnswers, ExampleObject } from './testingObjects';

describe('QuizzService Int', () => {
  let prisma: PrismaService;
  let quizzService: QuizzService;
  let currentDescribeName = '';
  // function used to clear DB
  async function clearDatabase() {
    try {
      await prisma.$queryRaw`TRUNCATE TABLE "Quizz" RESTART IDENTITY CASCADE;`;
      await prisma.$queryRaw`TRUNCATE TABLE "Question" RESTART IDENTITY CASCADE;`;
      await prisma.$queryRaw`TRUNCATE TABLE "Answer" RESTART IDENTITY CASCADE;`;

      console.log(
        'Database cleared successfully, integration test for quizz service running',
      );
    } catch (error) {
      console.error('Error clearing the database:', error);
    }
  }
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    quizzService = moduleRef.get(QuizzService);
    await clearDatabase();
  });

  describe('funcionalities', () => {
    it('should create a Quizz', async () => {
      //Testing quizz object
      const quizz = await quizzService.createQuizz(ExampleObject);
      expect(quizz.message).toBe('Quizz created successfully');
      const quizzObject = await prisma.quizz.findUnique({
        where: { InviteCode: ExampleObject.inviteCode },
      });
      expect(quizzObject.name).toBe(ExampleObject.name);
      expect(quizzObject.numbersOfQuestions).toBe(
        ExampleObject.questions.length,
      );
      expect(quizzObject.InviteCode).toBe(ExampleObject.inviteCode);
      // testing questions
      for (let i = 0; i < ExampleObject.questions.length; i++) {
        let element = ExampleObject.questions[i];
        let questionIndex = quizzObject.InviteCode.toString() + i.toString();
        let question = await prisma.question.findUnique({
          where: { id: questionIndex },
        });
        expect(question.content).toBe(element.content);
        expect(question.type).toBe(element.type);
      }
      //testing answers
      for (let i = 0; i < ExampleObject.answers.length; i++) {
        let questionIndex = quizzObject.InviteCode.toString() + i.toString();
        var answers = await prisma.answer.findMany({
          where: { questionId: questionIndex },
        });
        expect(ExampleObject.answers[i].length).toBe(answers.length);
      }
    });
    //testing fetching quizz
    it('should fetch a quizz', async () => {
      const responseObject = await quizzService.fetchQuizz({
        inviteCode: ExampleObject.inviteCode,
      });
      expect(ExampleObject.name).toBe(responseObject.name);
      expect(ExampleObject.inviteCode).toBe(responseObject.inviteCode);
      expect(responseObject.answers.length).toBe(ExampleObject.answers.length);

      for (let i = 0; i < responseObject.questions.length; i++) {
        let element = responseObject.questions[i];
        expect(element.content).toBe(ExampleObject.questions[i].content);
        expect(element.type).toBe(ExampleObject.questions[i].type);
      }

      for (let i = 0; i < responseObject.answers.length; i++) {
        let element = responseObject.answers[i];
        for (let x = 0; x < element.length; x++) {
          expect(element[x].content).toBe(ExampleObject.answers[i][x].content);
          expect(element[x].isTrue).toBe(ExampleObject.answers[i][x].isTrue);
        }
      }
    });
    it('should check quizz', async () => {
      const quizzResult = await quizzService.checkAnswers(ExampleAnswers);
      expect(quizzResult.maxPoints && quizzResult.yourPoints).toBe(3);
    });
  });
  beforeEach(() => {
    currentDescribeName = expect.getState().currentTestName;
  });

  afterEach(() => {
    console.log(`Test successful for ` + currentDescribeName);
  });
});
