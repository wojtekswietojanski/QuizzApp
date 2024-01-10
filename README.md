
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
$ npm run start
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
![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/7b4779da-c25d-4503-b517-18d0596f70c6)

Fetch a quizz:
![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/b10563f1-ca96-44c8-bdce-54ab4bb353bd)

Check answers for a quizz:
![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/90d64d8b-c881-4f90-bb45-5b40e0e07a9b)

Registration:
![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/996906b0-f125-426c-8079-30b02fcc2ffd)

Login:
![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/4a96922f-173a-44c1-aeaf-22ff9585d86d)

Getting new access tokens (they are needed for mutations that are not marked as public):
![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/ecc833cd-65e6-4517-b3d1-173293296e94)

Logout:

![image](https://github.com/wojtekswietojanski/QuizzApp/assets/125148871/4174e7d8-eec7-4a60-9369-f07db5a71821)


