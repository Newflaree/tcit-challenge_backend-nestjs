import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllPostsUseCase } from '../../../application/use-cases/get-all-posts/get-all-posts.use-case';
import { PostResponseDto } from '../../../application/dtos/post-response.dto';
import { AppLogger } from '../../../../common/logger/logger.service';

@ApiTags('Posts')
@Controller('posts')
export class GetAllPostsController {
  private readonly logger = new AppLogger(GetAllPostsController.name);

  constructor(private readonly useCase: GetAllPostsUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los posts' })
  @ApiResponse({
    status: 200,
    description: 'Listado de posts',
    type: [PostResponseDto],
  })
  async handle(): Promise<PostResponseDto[]> {
    try {
      this.logger.log('Handling GET /posts');
      return await this.useCase.execute();
    } catch (error) {
      this.logger.error('GET /posts failed', (error as Error).stack);
      throw error;
    }
  }
}
