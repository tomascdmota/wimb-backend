import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
            req['company_id'] = (decoded as { cid: string }).cid; // Attach company_id to the request
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
