import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { QuizzService } from './quizz.service';
import { QuizzResponse } from './dto/quizCreate-response';
import { QuizzInput } from './dto/quizzCreate-input';

@Resolver()
export class QuizzResolver {
  constructor(private readonly quizzService: QuizzService) {}

  @Mutation(() => QuizzResponse)
  createQuizz(@Args('quizzInput') quizzInput: QuizzInput) {
    return this.quizzService.createQuizz(quizzInput);
  }
}
