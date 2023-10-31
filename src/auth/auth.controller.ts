import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  loginEmail(@Headers('Authorization') authorization: string) {
    const token = this.authService.extractTokenFromHeader(authorization, false);
    const { email, password } = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail({ email, password });
  }

  @Post('register/email')
  registerEmail(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    return this.authService.registerWithEmail({ email, password, name });
  }
}
