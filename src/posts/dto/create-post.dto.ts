import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Nuevo post',
    maxLength: 120,
    description: 'Nombre del post (sin espacios al inicio/fin)',
  })
  @IsString({ message: 'name debe ser un string' })
  @IsNotEmpty({ message: 'name no debe estar vacío' })
  @MinLength(1, { message: 'name debe tener al menos 1 carácter' })
  @MaxLength(120, { message: 'name no debe exceder 120 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name: string;

  @ApiProperty({
    example: 'Descripción del nuevo post',
    maxLength: 1000,
    description: 'Descripción del post (sin espacios al inicio/fin)',
  })
  @IsString({ message: 'description debe ser un string' })
  @IsNotEmpty({ message: 'description no debe estar vacía' })
  @MinLength(1, { message: 'description debe tener al menos 1 carácter' })
  @MaxLength(1000, { message: 'description no debe exceder 1000 caracteres' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description: string;
}
