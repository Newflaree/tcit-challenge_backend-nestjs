import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../domain/entities/post.entity';

export class PostResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
}

export function toPostResponse(post: Post): PostResponseDto {
  return { id: post.id, name: post.name, description: post.description };
}
