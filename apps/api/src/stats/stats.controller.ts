import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAllStats() {
    return this.statsService.getAllStats();
  }
}
