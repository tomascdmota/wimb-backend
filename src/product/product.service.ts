import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from "./entities/product.entity";
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Update create function to accept image_path and company_id
  create(createProductDto: CreateProductDto, image_path: string, company_id: string) {
    const product = this.productRepository.create({
      ...createProductDto,
      id: uuidv4(),
      image_path, // Include the image path
      company_id,  // Include the company ID
    });
    return this.productRepository.save(product);
  }

  findAll(company_id: string) {
    console.log('Finding products for company_id:', company_id); // Log the company ID

    return this.productRepository.find({ where: { company_id } });
  }

  findById(id: string): Promise<Product | undefined> {
    return this.productRepository.findOne({ where: { id } });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    // This function can be implemented to update the product
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    // This function can be implemented to remove the product
    return `This action removes a #${id} product`;
  }
}

