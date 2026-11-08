import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostController } from '../../src/posts/infrastructure/http/controllers/create-post.controller';
import { GetAllPostsController } from '../../src/posts/infrastructure/http/controllers/get-all-posts.controller';
import { DeletePostController } from '../../src/posts/infrastructure/http/controllers/delete-post.controller';
import { CreatePostUseCase } from '../../src/posts/application/use-cases/create-post/create-post.use-case';
import { GetAllPostsUseCase } from '../../src/posts/application/use-cases/get-all-posts/get-all-posts.use-case';
import { DeletePostUseCase } from '../../src/posts/application/use-cases/delete-post/delete-post.use-case';
import { CreatePostDto } from '../../src/posts/application/dtos/create-post.dto';

describe('GetAllPostsController', () => {
  it('delega en el use case', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue([{ id: 1 }]) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllPostsController],
      providers: [{ provide: GetAllPostsUseCase, useValue: useCase }],
    }).compile();
    const controller = module.get(GetAllPostsController);
    const result = await controller.handle();
    expect(useCase.execute).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1 }]);
  });
});

describe('CreatePostController', () => {
  it('delega en el use case', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue({ id: 1 }) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatePostController],
      providers: [{ provide: CreatePostUseCase, useValue: useCase }],
    }).compile();
    const controller = module.get(CreatePostController);
    const dto = new CreatePostDto();
    dto.name = 'A';
    dto.description = 'D';
    const result = await controller.handle(dto);
    expect(useCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1 });
  });
});

describe('DeletePostController', () => {
  it('delega en el use case', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue({ id: 3 }) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeletePostController],
      providers: [{ provide: DeletePostUseCase, useValue: useCase }],
    }).compile();
    const controller = module.get(DeletePostController);
    const result = await controller.handle(3);
    expect(useCase.execute).toHaveBeenCalledWith(3);
    expect(result).toEqual({ id: 3 });
  });
});
