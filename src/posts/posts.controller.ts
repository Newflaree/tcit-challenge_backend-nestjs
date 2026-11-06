import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos los posts' })
  @ApiResponse({
    status: 200,
    description: 'Listado de posts ordenado por id descendente',
    type: [PostResponseDto],
  })
  async findAll(): Promise<PostResponseDto[]> {
    return this.postsService.findAll();
  }
}
