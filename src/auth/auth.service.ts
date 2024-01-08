import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { SignUpInput } from './dto/signup-input';
import { SignInInput } from './dto/signin-input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  //Sign up function
  async signup(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: signUpInput.username,
          hashedPassword,
          email: signUpInput.email,
        },
      });
      const { accessToken, refreshToken } = await this.createTokens(
        user.id,
        user.email,
      );
      await this.updateRefreshToken(user.id, refreshToken);
      // console.log({ accessToken, refreshToken, user });
      return { accessToken, refreshToken, user };
    } catch (error) {
      // handling not unique email input
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email must be unique');
      }
      console.error(error);
      throw new Error('An error occurred during signup');
    }
  }

  // Sign in function
  async signin(signInInput: SignInInput) {
    const hashedPassword = await argon.hash(signInInput.password);
    const user = await this.prisma.user.findUnique({
      where: { email: signInInput.email },
    });

    if (!user) {
      throw new ForbiddenException('There is no user with that email');
    }

    //Checking if the password match with the one in DB (Im using argon beacouse the password in DB is hashed )
    const ifPasswordCorrect = await argon.verify(
      user.hashedPassword,
      signInInput.password,
    );

    if (!ifPasswordCorrect) {
      throw new ForbiddenException('The password is wrong');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  //Creating jwt tokens
  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );
    return { accessToken, refreshToken };
  }

  //updating user in DB with token
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  //Handling logout
  async logout(userId: number) {
    // there is a requirement that hashedRefreshToken isnt null to avoid spaming database with mutations
    // Im using update many beacouse of hashedRefreshToken: {not: null} is not unique
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: { hashedRefreshToken: null },
    });
    return { loggedOut: true };
  }

  async getNewTokens(userId: number, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new ForbiddenException('No such a user');
    }
    console.log(user.hashedRefreshToken);
    console.log(rt);

    const ifTokenMatch = await argon.verify(user.hashedRefreshToken, rt);

    if (!ifTokenMatch) {
      throw new ForbiddenException('tokens do not match');
    }

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }
}
