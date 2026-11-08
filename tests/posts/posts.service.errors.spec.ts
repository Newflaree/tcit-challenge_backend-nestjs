import 'reflect-metadata';
import { Repository } from 'typeorm';
import { Post } from '../../src/posts/domain/entities/post.entity';
import { CreatePostDto } from '../../src/posts/application/dtos/create-post.dto';
import { CreatePostUseCase } from '../../src/posts/application/use-cases/create-post/create-post.use-case';
import { GetAllPostsUseCase } from '../../src/posts/application/use-cases/get-all-posts/get-all-posts.use-case';
import { DeletePostUseCase } from '../../src/posts/application/use-cases/delete-post/delete-post.use-case';
import { IPostRepository } from '../../src/posts/domain/repositories/post.repository';

describe('CreatePostUseCase - error', () => {
  it('propaga el error cuando el repositorio falla', async () => {
    const repository: IPostRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(() => { throw new Error('boom'); }),
      save: jest.fn(),
      remove: jest.fn(),
    };
    const useCase = new CreatePostUseCase(repository);
    const dto = Object.assign(new CreatePostDto(), { name: 'A', description: 'D' });
    await expect(useCase.execute(dto)).rejects.toThrow('boom');
  });
});

describe('GetAllPostsUseCase - error', () => {
  it('propaga el error cuando el repositorio falla', async () => {
    const repository: IPostRepository = {
      findAll: jest.fn().mockRejectedValue(new Error('boom')),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    const useCase = new GetAllPostsUseCase(repository);
    await expect(useCase.execute()).rejects.toThrow('boom');
  });
});

describe('DeletePostUseCase - error', () => {
  it('propaga el error cuando findOne falla', async () => {
    const repository: IPostRepository = {
      findAll: jest.fn(),
      findOne: jest.fn().mockRejectedValue(new Error('boom')),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    const useCase = new DeletePostUseCase(repository);
    await expect(useCase.execute(1)).rejects.toThrow('boom');
  });
});
