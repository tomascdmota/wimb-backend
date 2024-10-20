import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity'; // Import the Product entity

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Register Product entity in the TypeOrmModule
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}