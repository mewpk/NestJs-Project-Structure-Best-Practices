import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { successResponse, errorResponse } from '@utils/response.utils';

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


  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.authService.getUserById(id);
      if (!user) {
        return errorResponse(`User with ID ${id} not found`);
      }
      return successResponse(user);
    } catch (error) {
      return errorResponse('Failed to fetch user', error.code);
    }
  }
}
