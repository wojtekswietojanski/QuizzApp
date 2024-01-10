const ExampleObject = {
  name: 'YourQuizName',
  inviteCode: 'YourInviteCode1',
  questions: [
    {
      content: 'Question 1 Content',
      type: 'choose',
    },
    {
      content: 'Question 2 Content',
      type: 'text',
    },
    {
      content: 'Question 3 Content',
      type: 'sort',
    },
  ],
  answers: [
    [
      {
        content: 'Answer 1 for Question 1',
        isTrue: true,
      },
      {
        content: 'Answer 2 for Question 1',
        isTrue: false,
      },
    ],
    [
      {
        content: 'Answer for Question 2',
        isTrue: true,
      },
    ],
    [
      {
        content: 'Answer 1 for Question 3',
        isTrue: true,
        position: 1,
      },
      {
        content: 'Answer 2 for Question 3',
        isTrue: false,
        position: 2,
      },
    ],
  ],
};

const ExampleAnswers = {
  inviteCode: 'YourInviteCode1',
  answers: [
    [
      {
        content: 'Answer 1 for Question 1',
      },
    ],
    [
      {
        content: 'Answer for Question 2',
      },
    ],
    [
      {
        content: 'Answer 1 for Question 3',
        position: 1,
      },
      {
        content: 'Answer 2 for Question 3',
        position: 2,
      },
    ],
  ],
};

export { ExampleObject, ExampleAnswers };
