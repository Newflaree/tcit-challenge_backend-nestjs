import 'reflect-metadata';
import { Repository } from 'typeorm';
import { Post } from '../../src/posts/domain/entities/post.entity';
import { CreatePostDto } from '../../src/posts/application/dtos/create-post.dto';
import { CreatePostUseCase } from '../../src/posts/application/use-cases/create-post/create-post.use-case';
import { GetAllPostsUseCase } from '../../src/posts/application/use-cases/get-all-posts/get-all-posts.use-case';
import { DeletePostUseCase } from '../../src/posts/application/use-cases/delete-post/delete-post.use-case';
import { IPostRepository } from '../../src/posts/domain/repositories/post.repository';

describe('CreatePostUseCase', () => {
  it('crea y devuelve el post mapeado', async () => {
    const post = Object.assign(new Post(), { id: 1, name: 'A', description: 'D' });
    const repository: IPostRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(() => post),
      save: jest.fn().mockResolvedValue(post),
      remove: jest.fn(),
    };
    const useCase = new CreatePostUseCase(repository);
    const dto = Object.assign(new CreatePostDto(), { name: '  A  ', description: '  D  ' });

    const result = await useCase.execute(dto);

    expect(repository.create).toHaveBeenCalledWith({ name: 'A', description: 'D' });
    expect(result).toEqual({ id: 1, name: 'A', description: 'D' });
  });
});

describe('GetAllPostsUseCase', () => {
  it('devuelve todos los posts mapeados', async () => {
    const posts = [Object.assign(new Post(), { id: 2, name: 'B', description: 'D2' })];
    const repository: IPostRepository = {
      findAll: jest.fn().mockResolvedValue(posts),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    const useCase = new GetAllPostsUseCase(repository);

    const result = await useCase.execute();

    expect(result).toEqual([{ id: 2, name: 'B', description: 'D2' }]);
  });
});

describe('DeletePostUseCase', () => {
  it('elimina y devuelve el post', async () => {
    const post = Object.assign(new Post(), { id: 5, name: 'A borrar', description: 'Desc' });
    const repository: IPostRepository = {
      findAll: jest.fn(),
      findOne: jest.fn().mockResolvedValue(post),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn().mockResolvedValue(post),
    };
    const useCase = new DeletePostUseCase(repository);

    const result = await useCase.execute(5);

    expect(repository.findOne).toHaveBeenCalledWith(5);
    expect(repository.remove).toHaveBeenCalledWith(post);
    expect(result).toEqual({ id: 5, name: 'A borrar', description: 'Desc' });
  });

  it('lanza BadRequestException si el id no es válido', async () => {
    const repository: IPostRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    const useCase = new DeletePostUseCase(repository);

    await expect(useCase.execute(0)).rejects.toThrow('id debe ser un entero positivo');
  });

  it('lanza NotFoundException si el post no existe', async () => {
    const repository: IPostRepository = {
      findAll: jest.fn(),
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    const useCase = new DeletePostUseCase(repository);

    await expect(useCase.execute(999)).rejects.toThrow('Post con id 999 no encontrado');
  });

});
