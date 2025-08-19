-- Script para insertar datos de prueba en la base de datos
-- Ejecuta este script después de crear las tablas

USE podcast;

-- Insertar roles si no existen
INSERT IGNORE INTO `Role` (`name`) VALUES 
('admin'),
('user'),
('moderator');

-- Insertar usuario administrador de prueba (contraseña: "admin123" hasheada con bcrypt)
INSERT IGNORE INTO `User` (`name`, `email`, `role_id`, `image`, `password`) VALUES 
('admin', 'admin@podcast.com', 1, 'https://via.placeholder.com/150', '$2b$10$lMpTJnxhFPUyJQaLCpoeAuPiSBeD611g91IYeXneAtCdcLKwG55oy');

-- Insertar usuario regular de prueba (contraseña: "user123" hasheada con bcrypt)
INSERT IGNORE INTO `User` (`name`, `email`, `role_id`, `image`, `password`) VALUES 
('testuser', 'user@podcast.com', 2, 'https://via.placeholder.com/150', '$2b$10$I6NRzEfBpczyHQhDPCDrB.gBf87GXij5yRahvepGtLIp6R.RoxuNy');

-- Insertar podcast de prueba
INSERT IGNORE INTO `Podcast` (`user_id`, `name`, `url`, `description`) VALUES 
(1, 'Mi Primer Podcast', 'https://example.com/podcast1', 'Un podcast de prueba sobre tecnología'),
(2, 'Podcast de Usuario', 'https://example.com/podcast2', 'Podcast creado por usuario regular');

-- Verificar datos insertados
SELECT 'Roles creados:' as info;
SELECT * FROM `Role`;

SELECT 'Usuarios creados:' as info;
SELECT `id`, `name`, `email`, `role_id`, `createdAt` FROM `User`;

SELECT 'Podcasts creados:' as info;
SELECT * FROM `Podcast`;
