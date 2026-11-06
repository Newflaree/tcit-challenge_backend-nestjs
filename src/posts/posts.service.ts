import { Injectable, NotFoundException } from '@nestjs/common';
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
    const result: Post[] = [];
    const posts = await this.postRepository.find({
      order: { id: 'DESC' },
    });
    for (const post of posts as unknown[]) {
      result.push(post as Post);
    }
    return result.map(toPostResponse);
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post con id ${id} no encontrado`);
    }
    const typed: Post = Object.assign(new Post(), post);
    return typed;
  }
}
