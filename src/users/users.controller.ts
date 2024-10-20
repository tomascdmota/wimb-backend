import { Controller, Get, Req, Res, HttpStatus, UseGuards, UseInterceptors, Next } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../auth/auth.middleware';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthMiddleware) // Apply the AuthMiddleware
    @Get('')
    async getUsersByCompany(@Req() req: Request, @Res() res: Response) {
        const company_id: string = req['company_id']; // Get company_id from the request
    
        try {
            const users = await this.usersService.findByCompanyId(company_id); // Fetch all users for the company
            return res.status(HttpStatus.OK).json({ users }); // No need for additional check
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users' });
        }
    }
    
}
