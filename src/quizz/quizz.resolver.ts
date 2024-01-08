import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { QuizzService } from './quizz.service';
import { QuizzResponse } from './dto/quizCreate-response';
import { QuizzInput } from './dto/quizzCreate-input';
import { Query } from '@nestjs/common';
import { Public } from '@src/auth/decorators/public.decorator';
import { FetchQuizzResponse } from './dto/fetchQuizz-response';
import { FetchQuizzInput } from './dto/fetchQuizz-input';
import { ChechQuizzResponse } from './dto/checkQuizz-response';
import { ChechQuizzInput } from './dto/checkQuiz-input';

@Resolver()
export class QuizzResolver {
  constructor(private readonly quizzService: QuizzService) {}

  @Mutation(() => QuizzResponse)
  createQuizz(@Args('quizzInput') quizzInput: QuizzInput) {
    return this.quizzService.createQuizz(quizzInput);
  }

  @Public()
  @Mutation(() => FetchQuizzResponse)
  fetchQuizz(@Args('fetchQuizzInput') fetchQuizzInput: FetchQuizzInput) {
    return this.quizzService.fetchQuizz(fetchQuizzInput);
  }

  @Public()
  @Mutation(() => ChechQuizzResponse)
  checkAnswers(@Args('chechQuizzInput') checkInput: ChechQuizzInput) {
    return this.quizzService.checkAnswers(checkInput);
  }
}
