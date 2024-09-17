import { Controller, Get, Param } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('main/:storeId')
  @Auth()
  async getMainStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getMainStatistics(storeId);
  }

  @Get('middle/:storeId')
  @Auth()
  async getMiddleStatistics(@Param('storeId') storeId: string) {
    return this.statisticsService.getMiddleStatistics(storeId);
  }
}
