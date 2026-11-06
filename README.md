# TCIT Posts — Backend

API REST del challenge de Posts. Construida con NestJS, TypeORM y PostgreSQL.

- Puerto por defecto: `3000`
- Prefijo global de la API: `/api`
- Origen permitido por CORS: `http://localhost:4200` (configurable)
- Documentación del proyecto: [`../README.md`](../README.md)

## Requisitos

- Node.js 20 o superior.
- pnpm 10 o superior.
- PostgreSQL 15 o superior (la conexión se configura en la HU-02).

## Instalación

```bash
pnpm install
cp .env.example .env
```

Completar `.env` con los valores locales. El archivo `.env` está ignorado por Git.

## Variables de entorno

| Variable | Obligatoria | Valor por defecto | Descripción |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development`, `production` o `test` |
| `PORT` | No | `3000` | Puerto HTTP del backend |
| `FRONTEND_URL` | No | `http://localhost:4200` | Origen permitido por CORS |
| `DB_HOST` | Sí | — | Host de PostgreSQL |
| `DB_PORT` | Sí | — | Puerto de PostgreSQL |
| `DB_USER` | Sí | — | Usuario de PostgreSQL |
| `DB_PASSWORD` | Sí | — | Contraseña de PostgreSQL |
| `DB_NAME` | Sí | — | Nombre de la base de datos |

La aplicación valida estas variables al iniciar. Si falta una variable obligatoria
o un valor es inválido, el proceso termina con un mensaje que indica el problema.

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

# tests unitarios
pnpm run test

# tests end-to-end
pnpm run test:e2e

# cobertura
pnpm run test:cov
```

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
    env.validation.ts   # Esquema y validación de variables de entorno
  app.controller.ts
  app.module.ts
  app.service.ts
  main.ts               # Puerto, prefijo /api y CORS
test/
  setup-env.ts          # Variables mínimas para e2e
```

## Convenciones

- TypeScript estricto.
- API y propiedades TypeScript en `camelCase`.
- Columnas PostgreSQL en `snake_case`.
- Un commit atómico por cada punto de checklist de la HU.
- Formato de commit: `[TIPO]: descripción`.

Las historias de usuario y el flujo de ramas están en `../docs/hu/README.md`.
