import { Controller, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';

@Controller('api/stream')
export class NotificationController {
  @Sse('')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({ data: { hello: 'world' } }) as MessageEvent),
    );
  }
}
