import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
class ChartFormattedUserDataInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      concatMap((data) => {
        const request = context.switchToHttp().getRequest();
        const type = request.query.type;
        switch (type) {
          case 'month':
            return from(this.formatChartByMonthData(data));
          case 'activated':
            return from(this.formatChartIsActivatedData(data));
          default:
            return from(this.formatChartByMonthData(data));
        }
      }),
    );
  }

  private formatChartByMonthData(data): Observable<any> {
    const labels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const datasets = [
      {
        label: 'User sign up by months',
        data: Array(12).fill(0),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ];
    data.forEach((item) => {
      const index = new Date(item.createdAt).getMonth();
      datasets[0].data[index]++;
    });
    return of({
      labels,
      datasets,
    });
  }

  private formatChartIsActivatedData(data) {
    const labels = ['Activated', 'Unactived'];
    const type = [true, false];
    const datasets = [
      {
        label: 'User activated',
        data: Array(type.length).fill(0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ];
    data.forEach((item) => {
      const index = type.indexOf(item.isActivated);
      datasets[0].data[index]++;
    });

    return of({
      labels,
      datasets,
    });
  }
}

export { ChartFormattedUserDataInterceptor };
