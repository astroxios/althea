/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WidgetTypeNames" AS ENUM ('SCHEDULES', 'POLLS', 'SHOUTOUTS', 'FAN_ART', 'MERCHANDISE', 'CONTESTS', 'HIGHLIGHTS', 'RANKINGS');

-- CreateTable
CREATE TABLE "widgets" (
    "id" SERIAL NOT NULL,
    "typeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "widgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "widget_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "widget_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "widget_types_name_key" ON "widget_types"("name");

-- AddForeignKey
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "widget_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
