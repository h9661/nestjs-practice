import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  signToken(user: Pick<User, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: 'secret',
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

  async registerWithEmail(user: Pick<User, 'email' | 'name' | 'password'>) {
    const hash = await bcrypt.hash(user.password, 12);

    const newUser = await this.usersService.create({
      ...user,
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
}
