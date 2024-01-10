
## Description
Quiz App I Nest.js learning assignment

## Installation

```bash
$ npm install
```

## Running the app

```bash
# Running docker container
$ docker compose up

# prisma migration
$ npx prisma migrate dev

# Starting the app
$ npm run start:prod
```

## Test

```bash
# prepering app for tests
$ npm run beforetest:int

# running tests covering all important funcionalities
$ npm run test:int

```

## Requirements
The API should have the following capabilities:
  - Create a new quiz ✓
  - Get questions for a quizz ✓
  - Check answers ✓
The quizz questions can be of a diffirent type:
  - single/multiple correct answer/s ✓
  - sort answers ✓
  - plain text answer ✓
Other requriements:
  - Implement a GraphQL-based API using NestJS and TypeScript. ✓
  - Cover the relevant parts of the code with unit tests .✓
  - Use the PostgreSQL database and Docker to run it. ✓
  - No authentication is required. ✓
  - Provide instructions on how to run the application. ✓
  - Provide examples of GraphQL queries and mutations for each operation. ✓
  - All quizzes, including questions and answers, must be created within a single GraphQL mutation and a corresponding database transaction. Avoid splitting this operation into three separate mutations. ✓
  - Import database config from .env file. ✓
  - Make frequent commits following the commit naming conventions ✓


## Tests
![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/5554a93c-00d4-4dd8-8ea7-71bb0abd3526)
![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/fb7e22eb-0cda-4703-8ce9-a26af66e104d)


## Examples of graphQL mutations for each operation:
Create a quizz:
Fetch a quizz:
Check answers for a quizz:
Registration:
Login:
Getting new access tokens (they are needed for mutations that are not mark as public):
Logout:

Nest is [MIT licensed](LICENSE).
