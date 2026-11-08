import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../../domain/entities/post.entity';
import { IPostRepository } from '../../../domain/repositories/post.repository';
import { AppLogger } from '../../../../common/logger/logger.service';

@Injectable()
export class TypeOrmPostRepository implements IPostRepository {
  private readonly logger = new AppLogger(TypeOrmPostRepository.name);

  constructor(
    @InjectRepository(Post) private readonly repository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    try {
      this.logger.log('Finding all posts');
      return await this.repository.find({ order: { id: 'DESC' } });
    } catch (error) {
      this.logger.error('Failed to find all posts', (error as Error).stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Post | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Failed to find post ${id}`, (error as Error).stack);
      throw error;
    }
  }

  create(data: { name: string; description: string }): Post {
    return this.repository.create(data);
  }

  async save(post: Post): Promise<Post> {
    try {
      return await this.repository.save(post);
    } catch (error) {
      this.logger.error('Failed to save post', (error as Error).stack);
      throw error;
    }
  }

  async remove(post: Post): Promise<Post> {
    try {
      return await this.repository.remove(post);
    } catch (error) {
      this.logger.error('Failed to remove post', (error as Error).stack);
      throw error;
    }
  }
}
