import { Controller, Post, Body, Get, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';  
import { successResponse, errorResponse } from '@utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.createUser(createUserDto);
      return successResponse(user, 'User successfully registered');
    } catch (error) {
      return errorResponse('User registration failed', error.code);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const result = await this.authService.login(loginUserDto);
      return successResponse(result, 'Login successful');
    } catch (error) {
      throw new HttpException(errorResponse('Login failed', error.code), HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const userId = req.user.userId;
    const user = await this.authService.getProfile(userId);
    return successResponse(user, 'Profile fetched successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    const userId = req.user.userId;
    await this.authService.logout(userId);
    return successResponse(null, 'Logged out successfully');
  }
}
