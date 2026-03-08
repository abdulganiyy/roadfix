/*
  Warnings:

  - Added the required column `severity` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('MINOR', 'MODERATE', 'SEVERE', 'CRITICAL');

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "severity" "Severity" NOT NULL;
