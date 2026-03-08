import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { ProblemType, Severity } from 'generated/prisma/enums';

export class GetReportsDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  cursor?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  lat?: string;

  @IsOptional()
  lng?: string;

  @IsOptional()
  radius?: string;

  @IsOptional()
  sort?: string;

  @IsOptional()
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsEnum(ProblemType)
  problemType?: ProblemType;

  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;
}
