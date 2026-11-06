import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { toPostResponse, type PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      order: { id: 'DESC' },
    });

    return posts.map(toPostResponse);
  }
}
