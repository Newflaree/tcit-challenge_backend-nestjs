# TCIT Posts — Backend: puesta en marcha

API REST del challenge de Posts. Construida con NestJS, TypeORM y PostgreSQL.

- Puerto por defecto: `3000`
- Prefijo global de la API: `/api`
- Origen permitido por CORS: `http://localhost:4200` (configurable)
- Swagger/OpenAPI: `http://localhost:3000/api/docs`

## Requisitos

- Node.js 24 o superior.
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

El servicio de `docker-compose.yml` usa `postgres:16-alpine`, toma las
credenciales de `.env` y crea:

- la base de desarrollo indicada por `DB_NAME` (`tcit_posts` por defecto);
- la base de tests indicada por `TEST_DB_NAME` (`tcit_posts_test` por defecto).

### Opción B: PostgreSQL local

Crear las bases manualmente y completar `.env` con host, puerto, usuario y
contraseña.

## Variables de entorno

| Variable | Obligatoria | Valor por defecto |
|---|---|---|
| `NODE_ENV` | No | `development` |
| `PORT` | No | `3000` |
| `FRONTEND_URL` | No | `http://localhost:4200` |
| `DB_HOST` | Sí | — |
| `DB_PORT` | Sí | — |
| `DB_USER` | Sí | — |
| `DB_PASSWORD` | Sí | — |
| `DB_NAME` | Sí | — |
| `TEST_DB_NAME` | No | `tcit_posts_test` |

## Scripts

- `pnpm start:dev` — modo desarrollo con watch.
- `pnpm build` — compila a `dist/`.
- `pnpm start:prod` — ejecuta la build compilada.
- `pnpm migration:run` — aplica migraciones.
- `pnpm migration:revert` — revierte la última migración.
- `pnpm db:up` / `pnpm db:down` — levanta/baja Postgres con Docker.
- `pnpm test` — tests unitarios.
- `pnpm test:e2e` — tests e2e.
- `pnpm test:cov` — cobertura (100%).
- `pnpm lint`, `pnpm format`, `pnpm typecheck`.

## Colección Postman

Archivo: `TCIT-Posts.postman_collection.json` (en la raíz del repo).

Importarlo en Postman (Import → File). Variables:

- `baseUrl` = `http://localhost:3000/api`
- `postId` = id del post a eliminar

Incluye: Listar posts (`GET /posts`), Crear post (`POST /posts`),
Eliminar post (`DELETE /posts/{{postId}}`).
