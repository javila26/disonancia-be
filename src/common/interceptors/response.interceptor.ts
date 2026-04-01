import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        // If response already has data/meta structure
        if (response && typeof response === 'object' && 'data' in response) {
          return {
            success: true,
            ...response,
          };
        }

        // Default wrapper
        return {
          success: true,
          data: response,
        };
      }),
    );
  }
}
