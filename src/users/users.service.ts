import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ){}

    async create(createUserDto: CreateUserDto): Promise<User>{
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({...createUserDto, password: hashedPassword});

        return this.usersRepository.save(user);
    }

    // Promise of type user | undefined, where it is undefined in case if the user is not found/ doesn't exist
    async findByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({where: {username}});
    }

    async findById(id: string): Promise<User | undefined> {
        return this.usersRepository.findOne({where: {id}});
    }

    async findByCompanyId(company_id: string): Promise<User | undefined> {
        const users = await this.usersRepository.find({ where: { company_id } });
        return users.length > 0 ? users[0] : undefined;
    }
    
}
