import 'reflect-metadata';
import { Repository } from 'typeorm';
import { PostsService } from '../../src/posts/posts.service';
import { Post } from '../../src/posts/entities/post.entity';
import { CreatePostDto } from '../../src/posts/dto/create-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let findMock: jest.Mock;
  let saveMock: jest.Mock;
  let createMock: jest.Mock;
  let removeMock: jest.Mock;
  let findOneMock: jest.Mock;

  beforeEach(() => {
    findMock = jest.fn();
    saveMock = jest.fn();
    createMock = jest.fn((data: Partial<Post>) =>
      Object.assign(new Post(), data),
    );
    removeMock = jest.fn();
    findOneMock = jest.fn();
    const repository = {
      find: findMock,
      save: saveMock,
      create: createMock,
      remove: removeMock,
      findOne: findOneMock,
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

  it('elimina y devuelve el post mapeado', async () => {
    const post = Object.assign(new Post(), {
      id: 5,
      name: 'A borrar',
      description: 'Desc',
    });
    findOneMock.mockResolvedValue(post);
    removeMock.mockResolvedValue(post);

    const result = await service.remove(5);

    expect(findOneMock).toHaveBeenCalledWith({ where: { id: 5 } });
    expect(removeMock).toHaveBeenCalledWith(post);
    expect(result).toEqual({ id: 5, name: 'A borrar', description: 'Desc' });
  });

  it('lanza BadRequestException si el id no es válido', async () => {
    await expect(service.remove(0)).rejects.toThrow('id debe ser un entero positivo');
    await expect(service.remove(-1)).rejects.toThrow('id debe ser un entero positivo');
  });

  it('lanza NotFoundException si el post no existe', async () => {
    findOneMock.mockResolvedValue(null);

    await expect(service.remove(999)).rejects.toThrow(
      'Post con id 999 no encontrado',
    );
  });
});
