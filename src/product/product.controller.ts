import { Controller, Get, Post, Body, Req, Res, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp'; 
import { v4 as uuidv4 } from 'uuid'; 
import { jwtDecode } from "jwt-decode";
import { Request, Response } from 'express';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('add')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products', // Save in products folder
        filename: (req, file, cb) => {
          const ext = extname(file.originalname); // Get the file extension
          const filename = `${Date.now()}${ext}`; // Filename with timestamp
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createProductDto: CreateProductDto, 
    @Req() req: Request, 
    @Res() res: Response
  ) {
    // Ensure the uploads/products directory exists
    const uploadDir = join(__dirname, '..', '..', 'uploads', 'products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    const webpFilename = `${uuidv4()}.webp`; // Use UUID for unique naming
    const webpPath = join(uploadDir, webpFilename);

    const token = req.headers['authorization']?.split(' ')[1]; // Extract JWT token from Authorization header

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Access token not provided' });
    }

    if (file) {
      // Convert image to webp format with sharp
      await sharp(file.path)
        .webp({ quality: 90 })
        .toFile(webpPath);

      // Optional: Delete the original file after conversion
      fs.unlinkSync(file.path);
    }

    // Create imagePath for saving in DB, or set to null if no image is uploaded
    const imagePath = file ? `/uploads/products/${webpFilename}` : null;

    let company_id: string;
    try {
      const decoded = jwtDecode<{ id: string; cid: string }>(token); // Decode the JWT to get company_id
      company_id = decoded.cid;
      console.log('Extracted company_id:', company_id); // Log the company_id for debugging
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }

    try {
      const product = await this.productService.create({ ...createProductDto }, imagePath, company_id); // Create product with the provided data and image path

      return res.status(HttpStatus.CREATED).json({
        message: 'Product created successfully',
        product,
      });
    } catch (error) {
      console.error('Error creating product:', error); // Log any errors for debugging
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating product' });
    }
  }

  @Get('')
  async findAll(@Req() req: Request, @Res() res: Response) {
    const token = req.headers['authorization']?.split(' ')[1];
    let company_id: string;
  
    try {
      const decoded = jwtDecode<{ cid: string }>(token); // Decode the token to get company_id
      company_id = decoded.cid;
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
  
    try {
      const products = await this.productService.findAll(company_id); // Fetch all products for the company
      return res.status(HttpStatus.OK).json({ products: products.length ? products : [] });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching products' });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
