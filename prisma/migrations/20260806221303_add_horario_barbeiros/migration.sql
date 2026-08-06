-- AlterTable
ALTER TABLE "barbeiros" ADD COLUMN     "fimExpediente" TEXT NOT NULL DEFAULT '18:00',
ADD COLUMN     "inicioExpediente" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN     "intervaloMinutos" INTEGER NOT NULL DEFAULT 45;
