import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req.qr) throw new Error('QueryRunner가 없습니다.');

    return req.qr;
  },
);
