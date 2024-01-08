import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { QuizzService } from './quizz.service';
import { QuizzResolver } from './quizz.resolver';

@Module({
  providers: [PrismaService, QuizzService, QuizzResolver],
})
export class QuizzModule {}
