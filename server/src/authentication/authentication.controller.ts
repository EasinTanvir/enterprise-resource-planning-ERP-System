import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService, type SafeUser } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '../common/auth/current-user.decorator';
import { Public } from '../common/auth/public.decorator';
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authenticationService.login(
      await this.authenticationService.validateCredentials(
        dto.email,
        dto.password,
      ),
    );
  }
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  google() {
    return;
  }
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@CurrentUser() user: SafeUser) {
    return this.authenticationService.login(user);
  }
  @Get('me') me(@CurrentUser() user: SafeUser) {
    return user;
  }
  @Get('health') health(@CurrentUser() user: SafeUser) {
    return { authenticated: true, userId: user.id };
  }
}
