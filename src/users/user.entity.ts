import { Entity, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID generator

@Entity("users")
export class User {
  @Column({ primary: true })
  @Generated("uuid")
  id: string; // Change this to string

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  @Generated("uuid")
  company_id: string;

  @Column()
  department: string;

  @Column()
  position: string;

  @Column()
  invited_by: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
    length: any;

  // Constructor to set the UUID for the id field
  constructor() {
    this.id = uuidv4(); // Generate a random UUID when creating a new user
  }
}
