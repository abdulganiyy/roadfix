import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RoleName } from 'generated/prisma/enums';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getAllStats() {
    const now = new Date();

    const startDate = new Date();
    startDate.setDate(now.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const [totalRreporters, reportersPerDay] = await this.prisma.$transaction([
      this.prisma.user.count({
        where: {
          userRoles: {
            some: {
              role: {
                name: RoleName.user,
              },
            },
          },
        },
      }),

      // Reporters per day
      this.prisma.$queryRaw<{ date: Date; count: number }[]>`
  SELECT
    d::date AS date,
    COALESCE(COUNT(u.id), 0)::int AS count
  FROM generate_series(
    ${startDate}::date,
    NOW()::date,
    INTERVAL '1 day'
  ) d
  LEFT JOIN "User" u
    ON u."createdAt" >= d
    AND u."createdAt" < d + INTERVAL '1 day'
  LEFT JOIN "UserRole" ur
    ON ur."userId" = u.id
  LEFT JOIN "Role" r
    ON r.id = ur."roleId"
    AND r.name = 'user'
  GROUP BY d
  ORDER BY d ASC
`,
    ]);

    return { totalRreporters, reportersPerDay };
  }
}
