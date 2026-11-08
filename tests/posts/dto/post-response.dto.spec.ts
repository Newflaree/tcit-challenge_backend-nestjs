import 'reflect-metadata';
import { Post } from '../../../src/domain/entities/post.entity';
import { toPostResponse } from '../../../src/application/dtos/post-response.dto';

describe('toPostResponse (mapper de salida)', () => {
  it('devuelve únicamente los campos públicos id, name y description', () => {
    const post = Object.assign(new Post(), {
      id: 42,
      name: '  Primer post  ',
      description: 'Contenido',
    });

    const result = toPostResponse(post);

    expect(Object.keys(result)).toEqual(['id', 'name', 'description']);
    expect(result).toEqual({
      id: 42,
      name: '  Primer post  ',
      description: 'Contenido',
    });
  });

  it('no expone propiedades internas de la entidad', () => {
    const post = Object.assign(new Post(), {
      id: 1,
      name: 'Post',
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    });

    const result = toPostResponse(post);

    expect(result).not.toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('updatedAt');
    expect(result).not.toHaveProperty('version');
  });
});
