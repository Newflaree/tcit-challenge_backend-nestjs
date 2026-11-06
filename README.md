# TCIT Posts — Backend

API REST del challenge de Posts. Construida con NestJS, TypeORM y PostgreSQL.

- Puerto por defecto: `3000`
- Prefijo global de la API: `/api`
- Origen permitido por CORS: `http://localhost:4200` (configurable)
- Documentación del proyecto: [`../README.md`](../README.md)

## Requisitos

- Node.js 20 o superior.
- pnpm 10 o superior.
- PostgreSQL 15 o superior, o Docker con Docker Compose para levantar una
  instancia local.

## Instalación

```bash
pnpm install
cp .env.example .env
```

Completar `.env` con los valores locales. El archivo `.env` está ignorado por Git.

## Base de datos local

### Opción A: Docker Compose

```bash
cp .env.example .env
pnpm db:up
pnpm migration:run
```

El servicio de [`docker-compose.yml`](docker-compose.yml) usa
`postgres:16-alpine`, toma las credenciales de `.env` y crea:

- la base de desarrollo indicada por `DB_NAME` (`tcit_posts` por defecto);
- la base de tests indicada por `TEST_DB_NAME` (`tcit_posts_test` por defecto).

El puerto del host se toma de `DB_PORT` (por defecto `5432`). Si ese puerto ya
está ocupado, cambiá `DB_PORT` en `.env` antes de ejecutar `pnpm db:up`.

```bash
# detener el contenedor conservando los datos
pnpm db:down

# detener y borrar el volumen (reinicia las bases)
docker compose down -v
```

### Opción B: PostgreSQL instalado

Crear las dos bases con un usuario con permisos:

```sql
CREATE DATABASE tcit_posts;
CREATE DATABASE tcit_posts_test;
```

También se pueden crear con `createdb`:

```bash
createdb -U postgres tcit_posts
createdb -U postgres tcit_posts_test
```

Luego ajustar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y
`TEST_DB_NAME` en `.env`.

## Variables de entorno

| Variable | Obligatoria | Valor por defecto | Descripción |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development`, `production` o `test` |
| `PORT` | No | `3000` | Puerto HTTP del backend |
| `FRONTEND_URL` | No | `http://localhost:4200` | Origen permitido por CORS |
| `DB_HOST` | Sí | — | Host de PostgreSQL (`localhost` en desarrollo) |
| `DB_PORT` | Sí | — | Puerto de PostgreSQL |
| `DB_USER` | Sí | — | Usuario de PostgreSQL |
| `DB_PASSWORD` | Sí | — | Contraseña de PostgreSQL |
| `DB_NAME` | Sí | — | Nombre de la base de desarrollo |
| `TEST_DB_NAME` | No | `tcit_posts_test` | Base dedicada a tests; debe terminar en `_test` |

La aplicación valida las variables al iniciar. Si falta una variable obligatoria
o un valor es inválido, el proceso termina con un mensaje que indica el problema.
Si PostgreSQL no está disponible, el arranque falla con un mensaje que incluye
host, puerto y base usados.

`DB_HOST` es configurable para que CI pueda apuntar al servicio de PostgreSQL.
En desarrollo local se usa `localhost`.

## Migraciones

El esquema se controla exclusivamente con migraciones. `synchronize` está
deshabilitado en todos los entornos y `migrationsRun` también: las migraciones
se ejecutan de forma explícita, nunca al arrancar la aplicación.

```bash
# ver el estado de las migraciones
pnpm migration:show

# ejecutar las pendientes
pnpm migration:run

# revertir la última aplicada
pnpm migration:revert

# generar una migración comparando entidades y base
pnpm migration:generate src/database/migrations/DescripcionDelCambio
```

La configuración de la CLI vive en
[`src/database/data-source.ts`](src/database/data-source.ts) y comparte las
opciones con la aplicación desde
[`src/config/typeorm.config.ts`](src/config/typeorm.config.ts).

Para operar sobre la base de tests:

```bash
DB_NAME=tcit_posts_test pnpm migration:run
DB_NAME=tcit_posts_test pnpm migration:revert
```

Revisar siempre el SQL generado antes de ejecutarlo. En producción las
migraciones deben ejecutarse como paso explícito del despliegue, nunca de forma
automática al iniciar la aplicación.

## Comandos

```bash
# desarrollo con recarga
pnpm run start:dev

# compilar y ejecutar en producción
pnpm run build
pnpm run start:prod

# verificar tipos sin generar archivos
pnpm run typecheck

# lint
pnpm run lint

# tests unitarios (no requieren base de datos)
pnpm run test

# tests de integración y e2e (requieren la base de tests)
pnpm run test:e2e

# cobertura
pnpm run test:cov

# PostgreSQL local
pnpm db:up
pnpm db:down

# migraciones
pnpm migration:run
pnpm migration:revert
pnpm migration:show
pnpm migration:generate src/database/migrations/DescripcionDelCambio
```

## Testing de base de datos

`pnpm run test:e2e` usa `TEST_DB_NAME` (por defecto `tcit_posts_test`). La
variable debe terminar en `_test`; el setup rechaza cualquier otro nombre para
evitar borrar datos de desarrollo. Antes de cada suite, la base de tests se
reinicia y la migración inicial se ejecuta desde cero.

Los tests de integración verifican:

- conexión a PostgreSQL y ejecución de migraciones;
- existencia de la tabla `posts` con sus columnas, PK y restricciones;
- reversión de la última migración y nueva ejecución sobre una base limpia.

## Integración continua

El workflow [`.github/workflows/backend-ci.yml`](.github/workflows/backend-ci.yml)
levanta un servicio PostgreSQL, ejecuta `migration:run`, `migration:revert` y
`migration:run` nuevamente, y luego corre typecheck, tests unitarios y e2e.
Nunca se conecta a una base productiva.

## API

Con el servidor en `3000`:

```bash
curl http://localhost:3000/api
```

Respuesta esperada: `Hello World!` con estado `200`.

El prefijo `/api` se aplica globalmente, por lo que los endpoints del challenge
quedarán bajo `http://localhost:3000/api/posts`.

## Smoke test

Con el backend en `3000` y el frontend en `4200`:

```bash
pnpm run smoke
```

El script verifica que `http://localhost:4200` y `http://localhost:3000/api`
respondan con un estado HTTP exitoso.

## Estructura

```text
src/
  config/
    env.validation.ts        # Esquema y validación de variables de entorno
    typeorm.config.ts        # Opciones compartidas de TypeORM y ConfigService
  database/
    data-source.ts           # DataSource para la CLI de TypeORM
    migrations/              # Migraciones versionadas
  app.controller.ts
  app.module.ts              # ConfigModule + TypeOrmModule.forRootAsync
  app.service.ts
  main.ts                    # Puerto, prefijo /api y CORS
docker/
  postgres/init/             # Crea la base de tests al inicializar el volumen
test/
  database/                  # Tests de integración de TypeORM y migraciones
  setup-env.ts               # Variables mínimas y protección de la base de tests
```

## Convenciones

- TypeScript estricto.
- API y propiedades TypeScript en `camelCase`.
- Columnas PostgreSQL en `snake_case`.
- Un commit atómico por cada punto de checklist de la HU.
- Formato de commit: `[TIPO]: descripción`.

Las historias de usuario y el flujo de ramas están en `../docs/hu/README.md`.
