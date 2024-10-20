import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity'; // Ensure this path is correct
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use a strong secret and consider moving to .env
      signOptions: { expiresIn: '60d' }, // Token expiration
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
