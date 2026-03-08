import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { GetReportsDto } from './dto/get-reports.dto';
import { GeocodeService } from '../geocode/geocode.service';

@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private geocodeService: GeocodeService,
  ) {}

  async createReport(dto: CreateReportDto) {
    const { photo, ...data } = dto;

    const location = await this.geocodeService.reverse(
      dto.latitude,
      dto.longitude,
    );

    return this.prisma.report.create({
      data: {
        ...data,
        address: location.address,
        images: {
          create: {
            url: photo,
          },
        },
      },
    });
  }

  async getReports(query: GetReportsDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.problemType) {
      where.problemType = query.problemType;
    }

    if (query.severity) {
      where.severity = query.severity;
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: query.sort
          ? {
              [query.sort]: query.order || 'desc',
            }
          : {
              createdAt: 'desc',
            },
        include: {
          images: true,
        },
      }),

      this.prisma.report.count({ where }),
    ]);

    return {
      data: reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getReport(id: string) {
    return this.prisma.report.findFirst({
      where: {
        id,
      },
    });
  }
}
