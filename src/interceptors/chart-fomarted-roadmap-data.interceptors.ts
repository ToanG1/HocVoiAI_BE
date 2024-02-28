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
class ChartFormattedRoadmapDataInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      concatMap((data) => {
        const request = context.switchToHttp().getRequest();
        const type = request.query.type;
        switch (type) {
          case 'month':
            return from(this.formatChartByMonthData(data));

          case 'category':
            return from(this.formatChartByCategoryData(data));

          case 'roadmap-level':
            return from(this.formatChartByRoadmapLevelData(data));

          case 'roadmap-language':
            return from(this.formatChartByRoadmapLanguageData(data));

          case 'roadmap-type':
            return from(this.formatChartByRoadmapTypeData(data));

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

  private formatChartByRoadmapLevelData(data) {
    const levels = ['unset', 'beginner', 'intermediate', 'advanced'];
    const datasets = [
      {
        label: 'Roadmap by level',
        data: Array(levels.length).fill(0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ];
    data.forEach((item) => {
      const index = levels.indexOf(item.level);
      datasets[0].data[index !== -1 ? index : 0]++;
    });

    return of({
      labels: levels,
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
    const labels = [2022, 2023, 2024];
    const type = [1, 2, 3, 4, 5];
    const datasets = [
      {
        label: 'Roadmap by type in 2022',
        data: Array(type.length).fill(0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Roadmap by type in 2023',
        data: Array(type.length).fill(0),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Roadmap by type in 2024',
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

export { ChartFormattedRoadmapDataInterceptor };
