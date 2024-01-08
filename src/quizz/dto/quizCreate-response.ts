import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './../../user/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType()
export class QuizzResponse {
  @IsNotEmpty()
  @IsString()
  @Field()
  message: string;
}
