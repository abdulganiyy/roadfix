import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ProblemType, Severity } from 'generated/prisma/enums';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  gpsAccuracy: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsEnum(ProblemType)
  problemType: ProblemType;

  @IsEnum(Severity)
  severity: Severity;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photo: string;
}
