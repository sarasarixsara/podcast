-- Script para crear la base de datos en MySQL (Laragon)
-- Ejecuta este script en phpMyAdmin o tu cliente MySQL preferido

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS podcast CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE podcast;

-- Crear tabla user
CREATE TABLE `User` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`email` VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`role_id` INT(10) NOT NULL DEFAULT '1',
	`image` VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`password` VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `User_name_key` (`name`) USING BTREE,
	UNIQUE INDEX `User_email_key` (`email`) USING BTREE
);

-- Crear tabla role
CREATE TABLE `Role` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `Role_name_key` (`name`) USING BTREE
);

-- Crear tabla podcast
CREATE TABLE `Podcast` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`user_id` INT(10) NOT NULL,
	`name` VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`url` VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`description` VARCHAR(191) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `Podcast_name_key` (`name`) USING BTREE
);

-- Insertar roles básicos
INSERT INTO `Role` (`name`) VALUES 
('admin'),
('user');

-- Verificar que las tablas se crearon correctamente
SHOW TABLES;
