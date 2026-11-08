import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllPostsUseCase } from '../../../application/use-cases/get-all-posts/get-all-posts.use-case';
import { PostResponseDto } from '../../../application/dtos/post-response.dto';

@ApiTags('Posts')
@Controller('posts')
export class GetAllPostsController {
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
    return this.useCase.execute();
  }
}
