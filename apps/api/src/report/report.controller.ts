import { Controller, Body, Post, Get, Param, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsDto } from './dto/get-reports.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  createReportDto(@Body() dto: CreateReportDto) {
    return this.reportService.createReport(dto);
  }

  @Get()
  async getReports(@Query() query: GetReportsDto) {
    // const results = await this.reportService.getReports(query);
    // console.log(results);
    return await this.reportService.getReports(query);
  }

  @Get(':id')
  getReport(@Param('id') id: string) {
    return this.reportService.getReport(id);
  }
}
