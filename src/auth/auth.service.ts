import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const username = loginUserDto.username.toLowerCase()
    const user = await this.usersService.findByUsername(username);
    console.log(process.env.JWT_SECRET)
    if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
      const payload = { cid: user.company_id, id: user.id};
      return {
        access_token: this.jwtService.sign(payload, { expiresIn: '30d' }), // 1-hour expiry
      };
    }
    throw new Error('Invalid credentials');
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      id: uuidv4(),
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

    async refreshAccessToken(refreshToken: string): Promise<string> {
        try {
        const decoded = this.jwtService.verify(refreshToken);
        const user = await this.usersService.findById(decoded.id);
    
        if (!user) {
            throw new Error('User not found');
        }
    
        // Generate a new access token
        const payload = { username: user.username, id: user.id, company_id: user.company_id };
        return this.jwtService.sign(payload);
        } catch (error) {
        throw new Error('Invalid refresh token');
        }
    }
}

