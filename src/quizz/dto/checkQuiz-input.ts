import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CheckAnswerInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => Int, { nullable: true })
  position?: number;
}

@InputType()
export class ChechQuizzInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  inviteCode: string;

  @Field(() => [[CheckAnswerInput]])
  @IsNotEmpty({ each: true })
  answers: CheckAnswerInput[][];
}
