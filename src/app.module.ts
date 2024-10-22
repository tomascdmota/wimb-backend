import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // This will load the .env file
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}', User],
      logging: true,
      synchronize: process.env.DB_SYNC === 'true',
    }),
    UsersModule,
    AuthModule,
    ProductModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
