-- CreateEnum
CREATE TYPE "WidgetTypeNames" AS ENUM ('SCHEDULES', 'POLLS', 'SHOUTOUTS', 'FAN_ART', 'MERCHANDISE', 'CONTESTS', 'HIGHLIGHTS', 'RANKINGS');

-- CreateTable
CREATE TABLE "widgets" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

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
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "widgets" ADD CONSTRAINT "widgets_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "widget_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
