import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Adjust the path based on your project structure

describe('AuthModule (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/signup (POST)', async () => {
    const username = 'testuser';
    const email = 'testuser@example.com';
    const password = 'testpassword';

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            signup(signUpInput: {
              username: "${username}",
              email: "${email}",
              password: "${password}"
            }) {
              accessToken
              refreshToken
              user {
                id
                username
                email
              }
            }
          }
        `,
      })
      .expect(200);

    const { body } = response;

    expect(body.data.signup.accessToken).toBeDefined();
    expect(body.data.signup.refreshToken).toBeDefined();
    expect(body.data.signup.user.id).toBeDefined();
    expect(body.data.signup.user.username).toBe(username);
    expect(body.data.signup.user.email).toBe(email);
  });
});
