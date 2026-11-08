import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostResponseDto, toPostResponse } from '../../dtos/post-response.dto';
import type { IPostRepository } from '../../../domain/repositories/post.repository';
import { AppLogger } from '../../../../common/logger/logger.service';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject('IPostRepository') private readonly repository: IPostRepository,
  ) {}

  private readonly logger = new AppLogger(DeletePostUseCase.name);

  async execute(id: number): Promise<PostResponseDto> {
    try {
      this.logger.log(`Deleting post ${id}`);
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException('id debe ser un entero positivo');
      }
      const post = await this.repository.findOne(id);
      if (!post) {
        throw new NotFoundException(`Post con id ${id} no encontrado`);
      }
      const response = toPostResponse(post);
      await this.repository.remove(post);
      this.logger.log('Post deleted');
      return response;
    } catch (error) {
      this.logger.error('Failed to delete post', (error as Error).stack);
      throw error;
    }
  }
}
