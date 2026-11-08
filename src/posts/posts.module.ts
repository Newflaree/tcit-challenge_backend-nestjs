import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './domain/entities/post.entity';
import { TypeOrmPostRepository } from './infrastructure/persistence/typeorm/typeorm-post.repository';
import { CreatePostUseCase } from './application/use-cases/create-post/create-post.use-case';
import { GetAllPostsUseCase } from './application/use-cases/get-all-posts/get-all-posts.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post/delete-post.use-case';
import { CreatePostController } from './infrastructure/http/controllers/create-post.controller';
import { GetAllPostsController } from './infrastructure/http/controllers/get-all-posts.controller';
import { DeletePostController } from './infrastructure/http/controllers/delete-post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [
    CreatePostController,
    GetAllPostsController,
    DeletePostController,
  ],
  providers: [
    TypeOrmPostRepository,
    { provide: 'IPostRepository', useExisting: TypeOrmPostRepository },
    CreatePostUseCase,
    GetAllPostsUseCase,
    DeletePostUseCase,
  ],
  exports: [TypeOrmPostRepository],
})
export class PostsModule {}
