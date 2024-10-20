import {IsNotEmpty, IsString } from 'class-validator';


export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    varieties: string;

    @IsNotEmpty()
    @IsString()
    region: string;

    @IsNotEmpty()
    alcohol_content: number;

    @IsNotEmpty()
    @IsString()
    format: string;

    @IsNotEmpty()
    @IsString()
    grapes: string;

    @IsNotEmpty()
    @IsString()
    serving_temperature: string;

    @IsNotEmpty()
    @IsString()
    taste: string;

    @IsString()
    image_path: string;
}
