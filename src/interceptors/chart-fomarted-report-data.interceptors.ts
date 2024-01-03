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
class ChartFormattedReportDataInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      concatMap((data) => {
        const request = context.switchToHttp().getRequest();
        const type = request.query.type;
        switch (type) {
          case 'month':
            return from(this.formatChartByMonthData(data));

          case 'report-type':
            return from(this.formatChartByTypeData(data));

          case 'progress':
            return from(this.formatChartByProgressData(data));

          // case 'roadmap-language':
          //   return from(this.formatChartByRoadmapLanguageData(data));

          // case 'roadmap-type':
          //   return from(this.formatChartByRoadmapTypeData(data));

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
        label: 'Roadmap created by months',
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

  private formatChartByTypeData(data) {
    const labels = [
      'USER_REPORT',
      'ROADMAP_REPORT',
      'QUESTION_REPORT',
      'QUESTION_REPLY_REPORT',
      'QUESTION_COMMENT_REPORT',
    ];
    const datasets = [
      {
        label: 'Roadmap created by type',
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
      const index = labels.indexOf(item.type);
      datasets[0].data[index]++;
    });
    return of({
      labels,
      datasets,
    });
  }

  private formatChartByProgressData(data) {
    const labels = ['Un-Accepted', 'Accepted', 'Solved'];
    const datasets = [
      {
        label: 'Roadmap by level',
        data: Array(labels.length).fill(0),
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
      const index = item.isAccepted ? (item.isSolved ? 2 : 1) : 0;
      datasets[0].data[index]++;
    });

    return of({
      labels,
      datasets,
    });
  }

  private formatChartByRoadmapLanguageData(data) {
    const languages = [
      'unset',
      'vietnamese',
      'english',
      'japan',
      'chinese',
      'portuguese',
    ];
    const datasets = [
      {
        label: 'Roadmap by language',
        data: Array(languages.length).fill(0),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ];
    data.forEach((item) => {
      const index = languages.indexOf(item.language);
      datasets[0].data[index !== -1 ? index : 0]++;
    });

    return of({
      labels: languages,
      datasets,
    });
  }

  private formatChartByRoadmapTypeData(data) {
    const labels = [2021, 2022, 2023];
    const type = [1, 2, 3, 4, 5];
    const datasets = [
      {
        label: 'Roadmap by type in 2021',
        data: Array(type.length).fill(0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Roadmap by type in 2022',
        data: Array(type.length).fill(0),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Roadmap by type in 2023',
        data: Array(type.length).fill(0),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ];

    data.forEach((item) => {
      const index = type.indexOf(item.type);
      const indexYear = labels.indexOf(new Date(item.createdAt).getFullYear());
      datasets[indexYear].data[index]++;
    });
    return of({
      labels: type,
      datasets,
    });
  }
}

export { ChartFormattedReportDataInterceptor };
