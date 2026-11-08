import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../domain/entities/post.entity';

export class PostResponseDto {
  @ApiProperty({ example: 1, description: 'Identificador único del post' })
  id: number;

  @ApiProperty({
    example: 'Mi primer post',
    description: 'Nombre del post',
    maxLength: 120,
  })
  name: string;

  @ApiProperty({
    example: 'Contenido del post',
    description: 'Descripción del post',
    maxLength: 1000,
  })
  description: string;
}

export function toPostResponse(post: Post): PostResponseDto {
  return { id: post.id, name: post.name, description: post.description };
}
