import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../../dtos/create-post.dto';
import { PostResponseDto, toPostResponse } from '../../dtos/post-response.dto';
import type { IPostRepository } from '../../../domain/repositories/post.repository';
import { AppLogger } from '../../../../common/logger/logger.service';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject('IPostRepository') private readonly repository: IPostRepository,
  ) {}

  private readonly logger = new AppLogger(CreatePostUseCase.name);

  async execute(dto: CreatePostDto): Promise<PostResponseDto> {
    try {
      this.logger.log('Creating post');
      const post = this.repository.create({
        name: dto.name.trim(),
        description: dto.description.trim(),
      });
      const saved = await this.repository.save(post);
      this.logger.log('Post created');
      return toPostResponse(saved);
    } catch (error) {
      this.logger.error('Failed to create post', (error as Error).stack);
      throw error;
    }
  }
}
