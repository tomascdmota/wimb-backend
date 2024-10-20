import { Body, Controller, Post, Res, Req, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response, Request } from 'express'; // Import Response and Request

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const { access_token } = await this.authService.login(loginUserDto);
      // Instead of setting the cookie, return the token in the response body
      return res.status(HttpStatus.OK).json({
        access_token, // Return the access token here
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: error.message,
      });
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    try {
      const refreshToken = req.cookies['refresh_token'];

      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }

      const newAccessToken = await this.authService.refreshAccessToken(refreshToken);

      res.cookie('access_token', newAccessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60 * 1000, // Short-lived, e.g., 30 minutes
        sameSite: 'lax',
      });

      return res.status(HttpStatus.OK).json({ access_token: newAccessToken });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
    }
  }
}
