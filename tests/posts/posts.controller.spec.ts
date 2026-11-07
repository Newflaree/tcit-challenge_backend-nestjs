/* eslint-disable @typescript-eslint/unbound-method */
import 'reflect-metadata';
import { PostsController } from '../../src/posts/posts.controller';
import { PostsService } from '../../src/posts/posts.service';
import { CreatePostDto } from '../../src/posts/dto/create-post.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: jest.Mocked<PostsService>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<PostsService>;

    controller = new PostsController(service);
  });

  it('findAll delega en el servicio', async () => {
    const expected = [{ id: 1, name: 'Post', description: 'Desc' }];
    service.findAll.mockResolvedValue(expected);

    const result = await controller.findAll();

    const findAllSpy = service.findAll as jest.Mock;
    expect(findAllSpy).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it('create delega en el servicio con el DTO', async () => {
    const dto: CreatePostDto = { name: 'Nuevo', description: 'Desc' };
    const expected = { id: 2, name: 'Nuevo', description: 'Desc' };
    service.create.mockResolvedValue(expected);

    const result = await controller.create(dto);

    const createSpy = service.create as jest.Mock;
    expect(createSpy).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('remove delega en el servicio con el id', async () => {
    const expected = { id: 3, name: 'Borrado', description: 'Desc' };
    service.remove.mockResolvedValue(expected);

    const result = await controller.remove(3);

    const removeSpy = service.remove as jest.Mock;
    expect(removeSpy).toHaveBeenCalledWith(3);
    expect(result).toEqual(expected);
  });
});
