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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '185.97.146.17',
      port: 5432,
      username: 'tomascdmota', // Your PostgreSQL username
      password: 'Tcdm.2021', // Your PostgreSQL password
      database: 'wimb', // Your PostgreSQL database name
      entities: [__dirname + '/**/*.entity{.ts,.js}', User],
      logging: true, 
      synchronize: true, // Set to false for production
    }),
    UsersModule,
    AuthModule,
    ProductModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}