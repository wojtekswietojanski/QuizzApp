import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumberString } from 'class-validator';

@ObjectType()
export class ChechQuizzResponse {
  @Field()
  @IsNotEmpty()
  @IsNumberString()
  yourPoints: number;

  @Field()
  @IsNotEmpty()
  @IsNumberString()
  maxPoints: number;
}
