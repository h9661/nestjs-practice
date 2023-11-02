import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req.user) {
      throw new InternalServerErrorException('there is no user on the request');
    }

    switch (data) {
      case 'id':
        return req.user.id;
      case 'email':
        return req.user.email;
      case 'role':
        return req.user.role;
      default:
        return req.user;
    }
  },
);
