import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'Código HTTP del error' })
  statusCode: number;

  @ApiProperty({
    example: ['name should not be empty'],
    description: 'Mensaje o lista de mensajes de validación',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request', description: 'Nombre del error HTTP' })
  error: string;
}
