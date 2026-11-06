import 'reflect-metadata';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';

describe('PostsService', () => {
  let service: PostsService;
  let findMock: jest.Mock;

  beforeEach(() => {
    findMock = jest.fn();
    const repository = { find: findMock } as unknown as Repository<Post>;
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
});
