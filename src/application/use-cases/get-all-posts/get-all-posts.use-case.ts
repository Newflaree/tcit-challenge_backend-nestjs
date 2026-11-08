import { Inject, Injectable } from '@nestjs/common';
import { PostResponseDto, toPostResponse } from '../../dtos/post-response.dto';
import type { IPostRepository } from '../../../domain/repositories/post.repository';

@Injectable()
export class GetAllPostsUseCase {
  constructor(
    @Inject('IPostRepository') private readonly repository: IPostRepository,
  ) {}

  async execute(): Promise<PostResponseDto[]> {
    const posts = await this.repository.findAll();
    return posts.map(toPostResponse);
  }
}
