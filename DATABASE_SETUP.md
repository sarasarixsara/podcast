# Configuración de Base de Datos MySQL con Laragon

## Prerrequisitos
- Tener Laragon instalado y ejecutándose
- MySQL debe estar activo en Laragon

## Pasos para configurar la base de datos

### 1. Verificar que MySQL esté ejecutándose
- Abre Laragon
- Asegúrate de que MySQL esté iniciado (botón Start All)
- MySQL debería estar corriendo en el puerto 3306

### 2. Crear la base de datos
Ejecuta uno de estos métodos:

**Opción A: Usando phpMyAdmin**
1. Ve a `http://localhost/phpmyadmin`
2. Crea una nueva base de datos llamada `podcast`
3. Establece la collation como `utf8mb4_unicode_ci`

**Opción B: Usando el script SQL**
1. Ejecuta el archivo `database/init.sql` en phpMyAdmin o tu cliente MySQL
2. Opcionalmente, ejecuta `database/seed.sql` para insertar datos de prueba

**Opción C: Desde línea de comandos**
```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS podcast CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 3. Configurar variables de entorno
El archivo `.env` ya está configurado con:
```
DATABASE_URL="mysql://root:@localhost:3306/podcast"
```

### 4. Ejecutar migraciones de Prisma
```bash
# Generar el cliente de Prisma
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:migrate

# O usar push para desarrollo (más rápido)
npm run db:push
```

### 5. Scripts disponibles
- `npm run db:generate` - Genera el cliente de Prisma
- `npm run db:push` - Sincroniza el esquema con la base de datos
- `npm run db:migrate` - Ejecuta migraciones
- `npm run db:studio` - Abre Prisma Studio para ver los datos
- `npm run db:reset` - Resetea la base de datos

## Verificación
Para verificar que todo funciona:
1. Ejecuta `npm run db:studio`
2. Debería abrir Prisma Studio en tu navegador
3. Deberías ver las tablas: `User`, `Role`, `Podcast`
4. La tabla `_prisma_migrations` se crea automáticamente por Prisma para rastrear migraciones

## Estructura de las tablas
Las tablas se crean con la siguiente estructura:

**Tabla `User`:**
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(191), UNIQUE)
- `email` (VARCHAR(191), UNIQUE) 
- `role_id` (INT, DEFAULT 1)
- `image` (VARCHAR(191))
- `password` (VARCHAR(191))
- `createdAt` (DATETIME(3), DEFAULT CURRENT_TIMESTAMP)

**Tabla `Role`:**
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(191), UNIQUE)
- `createdAt` (DATETIME(3), DEFAULT CURRENT_TIMESTAMP)

**Tabla `Podcast`:**
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `user_id` (INT)
- `name` (VARCHAR(191), UNIQUE)
- `url` (VARCHAR(191))
- `description` (VARCHAR(191))
- `createdAt` (DATETIME(3), DEFAULT CURRENT_TIMESTAMP)

**Tabla `_prisma_migrations` (creada automáticamente):**
Esta tabla la crea Prisma automáticamente para rastrear qué migraciones se han ejecutado.

## Datos de prueba
El archivo `database/seed.sql` incluye:
- Roles: admin, user, moderator
- Usuario admin: admin@podcast.com (contraseña: admin123)
- Usuario regular: user@podcast.com (contraseña: user123)
- 2 podcasts de ejemplo

**Nota:** Las contraseñas están hasheadas con bcrypt para seguridad.

## Solución de problemas
- Si MySQL no se conecta, verifica que Laragon esté ejecutándose
- Si hay errores de permisos, asegúrate de que el usuario `root` tenga acceso
- Para cambiar la contraseña de MySQL, modifica la `DATABASE_URL` en `.env`
