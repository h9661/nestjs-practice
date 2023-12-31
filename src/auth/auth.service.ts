import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  signToken(user: Pick<User, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<User, 'email' | 'id'>) {
    const accessToken = this.signToken(user, false);
    const refreshToken = this.signToken(user, true);

    return {
      accessToken,
      refreshToken,
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<User, 'email' | 'password'>,
  ) {
    const exUser = await this.usersService.getUserByEmail(user.email);

    if (!exUser) {
      throw new UnauthorizedException('not exist user');
    }

    const isMatch = await bcrypt.compare(user.password, exUser.password);

    if (!isMatch) {
      throw new UnauthorizedException('wrong password');
    }

    return exUser;
  }

  async loginWithEmail(user: Pick<User, 'email' | 'password'>) {
    const exUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(exUser);
  }

  async registerWithEmail(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;

    const hash = await bcrypt.hash(
      password,
      this.configService.get('HASH_ROUND'),
    );

    const newUser = await this.usersService.create({
      name,
      email,
      password: hash,
    });

    return this.loginUser(newUser);
  }

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');

    if (splitToken.length !== 2) {
      throw new UnauthorizedException('wrong header');
    }

    const prefix = splitToken[0];
    if (
      (isBearer && prefix !== 'Bearer') ||
      (!isBearer && prefix !== 'Basic')
    ) {
      throw new UnauthorizedException('wrong header');
    }

    const token = splitToken[1];

    return token;
  }

  decodeBasicToken(token: string) {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    if (!email || !password) throw new UnauthorizedException('wrong token');

    return { email, password };
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.verifyToken(token);

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        'accessToken is only published with refresh token',
      );
    }

    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException('token is expired or invalid token');
    }
  }
}
