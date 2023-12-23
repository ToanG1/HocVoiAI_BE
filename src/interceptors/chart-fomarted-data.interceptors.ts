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
class ChartFormattedDataInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      concatMap((data) => {
        const request = context.switchToHttp().getRequest();
        const type = request.query.type;
        if (type === 'month') {
          return from(this.formatChartByMonthData(data));
        } else if (type === 'category') {
          return from(this.formatChartByCategoryData(data));
        } else {
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
        label: 'Roadmap created by months',
        data: Array(12).fill(0),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ];
    data.forEach((item) => {
      const index = new Date(item.createdAt).getMonth() - 1;
      datasets[0].data[index]++;
    });
    return of({
      labels,
      datasets,
    });
  }

  private async formatChartByCategoryData(data) {
    const categories = await this.prismaService.category.findMany({
      select: {
        name: true,
      },
    });
    const labels = categories.map((item) => item.name);
    const datasets = [
      {
        label: 'Roadmap created by categories',
        data: Array(labels.length).fill(0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderWidth: 1,
      },
    ];
    data.forEach((item) => {
      const index = labels.indexOf(item.category.name);
      datasets[0].data[index]++;
    });
    return {
      labels,
      datasets,
    };
  }
}

export { ChartFormattedDataInterceptor };
