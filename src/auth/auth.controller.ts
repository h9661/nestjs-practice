import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  loginEmail(@Request() req) {
    const email = req.user.email;
    const password = req.user.password;
    return this.authService.loginWithEmail({ email, password });
  }

  @Post('register/email')
  registerEmail(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerWithEmail(registerUserDto);
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  getAccessToken(@Request() req) {
    const newToken = this.authService.rotateToken(req.token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  getRefreshToken(@Request() req) {
    const newToken = this.authService.rotateToken(req.token, true);

    return {
      refreshToken: newToken,
    };
  }
}
