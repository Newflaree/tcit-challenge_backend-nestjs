import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePostDto } from '../../../src/application/dtos/create-post.dto';

describe('CreatePostDto', () => {
  it('recorta espacios en name y description (string)', async () => {
    const dto: any = plainToInstance(CreatePostDto, {
      name: '  Hola  ',
      description: '  Mundo  ',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.name).toBe('Hola');
    expect(dto.description).toBe('Mundo');
  });

  it('mantiene el valor si no es string (Transform)', async () => {
    const dto: any = plainToInstance(CreatePostDto, {
      name: 123 as unknown as string,
      description: 456 as unknown as string,
    });
    // Transform returns the value unchanged when not a string
    expect(dto.name).toBe(123);
    expect(dto.description).toBe(456);
  });

  it('falla si name está vacío', async () => {
    const dto: any = plainToInstance(CreatePostDto, { name: '   ', description: 'Desc' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('falla si name excede 120 caracteres', async () => {
    const dto: any = plainToInstance(CreatePostDto, {
      name: 'a'.repeat(121),
      description: 'Desc',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('falla si description excede 1000 caracteres', async () => {
    const dto: any = plainToInstance(CreatePostDto, {
      name: 'Nombre',
      description: 'a'.repeat(1001),
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
