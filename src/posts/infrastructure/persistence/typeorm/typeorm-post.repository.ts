import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../../domain/entities/post.entity';
import { IPostRepository } from '../../../domain/repositories/post.repository';

@Injectable()
export class TypeOrmPostRepository implements IPostRepository {
  constructor(
    @InjectRepository(Post) private readonly repository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.repository.find({ order: { id: 'DESC' } });
  }

  findOne(id: number): Promise<Post | null> {
    return this.repository.findOne({ where: { id } });
  }

  create(data: { name: string; description: string }): Post {
    return this.repository.create(data);
  }

  save(post: Post): Promise<Post> {
    return this.repository.save(post);
  }

  remove(post: Post): Promise<Post> {
    return this.repository.remove(post);
  }
}
