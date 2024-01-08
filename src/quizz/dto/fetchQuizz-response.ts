import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class FetchAnswerResponse {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => Int, { nullable: true })
  position?: number;
}

@ObjectType()
export class FetchQuestionResponse {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;
}

@ObjectType()
export class FetchQuizzResponse {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  inviteCode: string;

  @Field(() => [FetchQuestionResponse])
  @IsNotEmpty({ each: true })
  questions: FetchQuestionResponse[];

  @Field(() => [[FetchAnswerResponse]])
  @IsNotEmpty({ each: true })
  answers: FetchAnswerResponse[][];
}
