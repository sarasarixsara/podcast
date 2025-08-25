/*
  Warnings:

  - You are about to drop the column `date` on the `cita` table. All the data in the column will be lost.
  - Added the required column `horario_disponible_id` to the `Cita` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cita` DROP COLUMN `date`,
    ADD COLUMN `horario_disponible_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Cita` ADD CONSTRAINT `Cita_horario_disponible_id_fkey` FOREIGN KEY (`horario_disponible_id`) REFERENCES `HorarioDisponible`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
