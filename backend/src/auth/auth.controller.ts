import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { User } from '../database/schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto.lastName);
    return {
      user: {
        id: result.user.id,
        lastName: result.user.lastName,
        knowledgeTokens: result.user.knowledgeTokens,
      },
      token: result.token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      lastName: user.lastName,
      knowledgeTokens: user.knowledgeTokens,
    };
  }
}
