import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * 요청이 들어올 때 req 요청이 들어온 타임 스탬프를 찍는다.
     * [REQ]: 2021-01-01 00:00:00 /api/user
     *
     * 응답이 들어올 때 res 요청이 들어온 타임 스탬프를 찍는다.
     * [RES]: 2021-01-01 00:00:00 /api/user
     */

    const req = context.switchToHttp().getRequest();

    const path = req.originalUrl;
    const now = Date.now();

    console.log(`[REQ]: ${now} ${path}`);

    // return next.handle() 수행하는 순간
    // 라우트의 로직이 전부 실행되고 응답이 반환된다.
    // observable을 반환한다.

    return next.handle().pipe(
      tap((observable) => {
        console.log(`[RES]: ${Date.now() - now} ${path}`);
      }),

      map((data) => ({
        message: '응답 변경',
        response: data,
      })),
    );
  }
}
