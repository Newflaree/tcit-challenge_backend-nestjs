import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostResponseDto, toPostResponse } from '../../dtos/post-response.dto';
import type { IPostRepository } from '../../../domain/repositories/post.repository';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject('IPostRepository') private readonly repository: IPostRepository,
  ) {}

  async execute(id: number): Promise<PostResponseDto> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('id debe ser un entero positivo');
    }
    const post = await this.repository.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post con id ${id} no encontrado`);
    }
    const response = toPostResponse(post);

    await this.repository.remove(post);

    return response;
  }
}
