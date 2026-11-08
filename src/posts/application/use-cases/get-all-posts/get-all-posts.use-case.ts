import { Inject, Injectable } from '@nestjs/common';
import { PostResponseDto, toPostResponse } from '../../dtos/post-response.dto';
import type { IPostRepository } from '../../../domain/repositories/post.repository';
import { AppLogger } from '../../../../common/logger/logger.service';

@Injectable()
export class GetAllPostsUseCase {
  constructor(
    @Inject('IPostRepository') private readonly repository: IPostRepository,
  ) {}

  private readonly logger = new AppLogger(GetAllPostsUseCase.name);

  async execute(): Promise<PostResponseDto[]> {
    try {
      this.logger.log('Fetching all posts');
      const posts = await this.repository.findAll();
      return posts.map(toPostResponse);
    } catch (error) {
      this.logger.error('Failed to fetch posts', (error as Error).stack);
      throw error;
    }
  }
}
