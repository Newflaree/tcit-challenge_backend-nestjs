import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../../../application/dtos/create-post.dto';
import { CreatePostUseCase } from '../../../application/use-cases/create-post/create-post.use-case';
import { PostResponseDto } from '../../../application/dtos/post-response.dto';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';

@ApiTags('Posts')
@Controller('posts')
export class CreatePostController {
  constructor(private readonly useCase: CreatePostUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: 'Post creado',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    type: ErrorResponseDto,
  })
  async handle(@Body() dto: CreatePostDto): Promise<PostResponseDto> {
    return this.useCase.execute(dto);
  }
}
