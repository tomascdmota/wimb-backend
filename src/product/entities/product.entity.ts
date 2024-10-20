import { Entity, Column, CreateDateColumn, UpdateDateColumn, Generated, Double } from 'typeorm';

@Entity("products")
export class Product {
    @Column({primary: true})
    @Generated("uuid")
    id: string;

    @Column()
    company_id: string;
    
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    varieties: string;

    @Column()
    region: string;

    @Column("float") // Use "float" or "decimal" for alcohol_content
    alcohol_content: number;

    @Column()
    format: string;

    @Column()
    grapes: string;

    @Column()
    serving_temperature: string;

    @Column()
    taste: string;

    @Column({ nullable: true })
    image_path: string;
}
