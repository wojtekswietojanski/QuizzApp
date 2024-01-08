import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class QuestionInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field()
  @IsNotEmpty()
  type: string;
}

@InputType()
export class AnswerInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field()
  @IsNotEmpty()
  isTrue: boolean;

  @Field(() => Int, { nullable: true })
  position?: number;
}

@InputType()
export class QuizzInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  inviteCode: string;

  @Field(() => [QuestionInput])
  @IsNotEmpty({ each: true })
  questions: QuestionInput[];

  @Field(() => [[AnswerInput]])
  @IsNotEmpty({ each: true })
  answers: AnswerInput[][];
}
