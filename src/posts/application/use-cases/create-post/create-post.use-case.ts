import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../../dtos/create-post.dto';
import { PostResponseDto, toPostResponse } from '../../dtos/post-response.dto';
import type { IPostRepository } from '../../../domain/repositories/post.repository';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject('IPostRepository') private readonly repository: IPostRepository,
  ) {}

  async execute(dto: CreatePostDto): Promise<PostResponseDto> {
    const post = this.repository.create({
      name: dto.name.trim(),
      description: dto.description.trim(),
    });
    const saved = await this.repository.save(post);
    return toPostResponse(saved);
  }
}
