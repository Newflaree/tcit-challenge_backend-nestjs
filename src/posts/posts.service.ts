import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
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

  async findOne(id: number): Promise<Post> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('id debe ser un entero positivo');
    }

    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post con id ${id} no encontrado`);
    }

    return post;
  }

  async create(dto: CreatePostDto): Promise<PostResponseDto> {
    const post = this.postRepository.create({
      name: dto.name.trim(),
      description: dto.description.trim(),
    });

    const saved = await this.postRepository.save<Post>(post);

    return toPostResponse(saved);
  }

  async remove(id: number): Promise<PostResponseDto> {
    const post = await this.findOne(id);

    const response = toPostResponse(post);

    await this.postRepository.remove(post);

    return response;
  }
}
