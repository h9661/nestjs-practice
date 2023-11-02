import { PickType } from '@nestjs/mapped-types';
import { User } from 'src/users/entities/user.entity';

export class RegisterUserDto extends PickType(User, [
  'name',
  'email',
  'password',
]) {}
