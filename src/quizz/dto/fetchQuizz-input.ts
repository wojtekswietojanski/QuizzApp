import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FetchQuizzInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}
