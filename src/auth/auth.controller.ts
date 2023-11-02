import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  loginEmail(@Headers('Authorization') authorization: string, @Request() req) {
    const email = req.user.email;
    const password = req.user.password;
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

  @Post('token/access')
  getAccessToken(@Headers('Authorization') authorization: string) {
    const token = this.authService.extractTokenFromHeader(authorization, true);
    const newToken = this.authService.rotateToken(token, false);

    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  getRefreshToken(@Headers('Authorization') authorization: string) {
    const token = this.authService.extractTokenFromHeader(authorization, true);
    const newToken = this.authService.rotateToken(token, true);

    return {
      refreshToken: newToken,
    };
  }
}
