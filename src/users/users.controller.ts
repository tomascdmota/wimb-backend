import { Controller, Get, Req, Res, HttpStatus, UseGuards, UseInterceptors, Next } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AuthMiddleware } from '../auth/auth.middleware';
import { jwtDecode } from 'jwt-decode';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthMiddleware) // Apply the AuthMiddleware
    @Get('')
    async getUsersByCompany(@Req() req: Request, @Res() res: Response) {
        const company_id: string = req['company_id']; // Get company_id from the request
        console.log("company id",company_id)
        try {
            //TODO UPDATE RESPONSE TO REMOVE SENSITIVE DATA.
            const users = await this.usersService.findByCompanyId(company_id); // Fetch all users for the company
            const filteredUser = {
                id: users.id,
                username: users.username,
                company_id: users.company_id,
                department: users.department,
                position: users.position,
                profile_image_path: users.profile_image_path,
            };
            return res.status(HttpStatus.OK).json({ users: filteredUser }); // No need for additional check
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users' });
        }
    }
}
