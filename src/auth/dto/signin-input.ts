import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

@InputType()
export class SignInInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
