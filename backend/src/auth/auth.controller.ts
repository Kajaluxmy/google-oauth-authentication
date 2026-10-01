import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('google')
  async googleLogin(
    @Body() body: { idToken: string },
  ) {
    return this.authService.loginWithGoogle(
      body.idToken,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() request: any) {
    return this.authService.getCurrentUser(
      request.user.sub,
    );
  }
}