import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser()); 

  app.enableCors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  });

  // Serve static files (images) from the assets directory
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/', // Set the prefix for accessing images
  });

  await app.listen(4001); // Ensure the correct port
}

bootstrap();
