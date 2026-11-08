import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from '../../../application/dtos/create-post.dto';
import { CreatePostUseCase } from '../../../application/use-cases/create-post/create-post.use-case';
import { PostResponseDto } from '../../../application/dtos/post-response.dto';
import { ErrorResponseDto } from '../../../../common/dto/error-response.dto';
import { AppLogger } from '../../../../common/logger/logger.service';

@ApiTags('Posts')
@Controller('posts')
export class CreatePostController {
  private readonly logger = new AppLogger(CreatePostController.name);

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
    try {
      this.logger.log('Handling POST /posts');
      return await this.useCase.execute(dto);
    } catch (error) {
      this.logger.error('POST /posts failed', (error as Error).stack);
      throw error;
    }
  }
}
