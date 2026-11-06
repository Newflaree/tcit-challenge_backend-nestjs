import 'reflect-metadata';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let findMock: jest.Mock;
  let saveMock: jest.Mock;
  let createMock: jest.Mock;

  beforeEach(() => {
    findMock = jest.fn();
    saveMock = jest.fn();
    createMock = jest.fn((data: Partial<Post>) =>
      Object.assign(new Post(), data),
    );
    const repository = {
      find: findMock,
      save: saveMock,
      create: createMock,
    } as unknown as Repository<Post>;
    service = new PostsService(repository);
  });

  it('devuelve el listado mapeado ordenado por id descendente', async () => {
    const posts = [
      Object.assign(new Post(), {
        id: 2,
        name: 'Segundo',
        description: 'Desc 2',
      }),
      Object.assign(new Post(), {
        id: 1,
        name: 'Primero',
        description: 'Desc 1',
      }),
    ];
    findMock.mockResolvedValue(posts);

    const result = await service.findAll();

    expect(findMock).toHaveBeenCalledWith({ order: { id: 'DESC' } });
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 2,
      name: 'Segundo',
      description: 'Desc 2',
    });
    expect(result[1]).toEqual({
      id: 1,
      name: 'Primero',
      description: 'Desc 1',
    });
  });

  it('devuelve [] si el repositorio está vacío', async () => {
    findMock.mockResolvedValue([]);

    const result = await service.findAll();

    expect(result).toEqual([]);
  });

  it('guarda y devuelve el post mapeado con valores normalizados', async () => {
    const dto: CreatePostDto = {
      name: '  Nuevo post  ',
      description: '  Desc  ',
    };
    const saved = Object.assign(new Post(), {
      id: 3,
      name: 'Nuevo post',
      description: 'Desc',
    });
    saveMock.mockResolvedValue(saved);

    const result = await service.create(dto);

    expect(createMock).toHaveBeenCalledWith({
      name: 'Nuevo post',
      description: 'Desc',
    });
    expect(saveMock).toHaveBeenCalled();
    expect(result).toEqual({ id: 3, name: 'Nuevo post', description: 'Desc' });
  });
});
