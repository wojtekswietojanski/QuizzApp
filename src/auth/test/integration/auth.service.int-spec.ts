import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { AuthService } from '@src/auth/auth.service';
import { PrismaService } from '@src/prisma/prisma.service';
import { ExampleUser, ExampleLogin } from './exampleUserObject';
import * as argon from 'argon2';

describe('authService Int', () => {
  let prisma: PrismaService;
  let authService: AuthService;
  let refreshTokenContainer = '';
  let userIdContainer = 0;
  let currentDescribeName = '';
  //function used to clear database before tests
  async function clearDatabase() {
    try {
      await prisma.$queryRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
      console.log(
        'Database cleared successfully, integration test for authentication service running',
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
    authService = moduleRef.get(AuthService);
    await clearDatabase();
  });

  // signup funcionality testing
  describe('signup()', () => {
    it('should create a user', async () => {
      //Creating and finding created user
      const user = await authService.signup(ExampleUser);
      const userCreated = await prisma.user.findUnique({
        where: { email: ExampleUser.email },
      });
      //Getting tokens
      const { accessToken, refreshToken } = await authService.createTokens(
        userCreated.id,
        userCreated.email,
      );

      expect(user.accessToken).toBe(accessToken);
      expect(user.refreshToken).toBe(refreshToken);
      expect(userCreated.email).toBe(ExampleUser.email);
      expect(userCreated.username).toBe(ExampleUser.username);
      expect(
        await argon.verify(userCreated.hashedPassword, ExampleUser.password),
      ).toBe(true);
    });
  });
  // signin funcionality testing
  describe('signin()', () => {
    it('should signin a user', async () => {
      const signInUser = await authService.signin(ExampleLogin);
      const userCreated = await prisma.user.findUnique({
        where: { email: ExampleUser.email },
      });
      // saving refresh token for the next test
      refreshTokenContainer = signInUser.refreshToken;
      userIdContainer = signInUser.user.id;
      expect(
        await argon.verify(
          userCreated.hashedRefreshToken,
          signInUser.refreshToken,
        ),
      ).toBe(true);
      expect({
        createdAt: signInUser.user.createdAt,
        email: signInUser.user.email,
        hashedPassword: signInUser.user.hashedPassword,
        id: signInUser.user.id,
        updatedAt: signInUser.user.updatedAt,
        username: signInUser.user.username,
      }).toStrictEqual({
        createdAt: userCreated.createdAt,
        email: userCreated.email,
        hashedPassword: userCreated.hashedPassword,
        id: userCreated.id,
        updatedAt: userCreated.updatedAt,
        username: userCreated.username,
      });
    });
  });
  // geting new token funcionality testing
  describe('getNewTokens()', () => {
    it('should get new token', async () => {
      const refreshedTokens = await authService.getNewTokens(
        userIdContainer,
        refreshTokenContainer,
      );
      const refreshedUser = await prisma.user.findUnique({
        where: { id: userIdContainer },
      });
      expect(
        await argon.verify(
          refreshedUser.hashedRefreshToken,
          refreshedTokens.refreshToken,
        ),
      ).toBe(true);
    });
  });
  // logout fucionality testing
  describe('logout()', () => {
    it('should logout a user', async () => {
      const logoutOperation = await authService.logout(userIdContainer);
      expect(logoutOperation.loggedOut).toBe(true);
    });
  });
  beforeEach(() => {
    currentDescribeName = expect.getState().currentTestName;
  });

  afterEach(() => {
    console.log(`Test successful for ` + currentDescribeName);
  });
});
