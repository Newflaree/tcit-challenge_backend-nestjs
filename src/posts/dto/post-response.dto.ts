import type { Post } from '../entities/post.entity';

import { ApiProperty } from '@nestjs/swagger';

/**
 * Contrato público de un post (camelCase).
 *
 * Coincide con el tipo `Post` del frontend:
 * `{ id: number; name: string; description: string }`.
 */
export class PostResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Primer post', maxLength: 120 })
  name: string;

  @ApiProperty({ example: 'Contenido del post', maxLength: 1000 })
  description: string;
}

/**
 * Mapper de salida: convierte la entidad `Post` en el DTO público.
 * Devuelve únicamente los campos acordados (`id`, `name`, `description`),
 * evitando exponer detalles internos de TypeORM o columnas no acordadas.
 */
export function toPostResponse(post: Post): PostResponseDto {
  return {
    id: post.id,
    name: post.name,
    description: post.description,
  };
}
