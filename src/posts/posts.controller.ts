import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post as PostDecorator,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsService } from './posts.service';

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

  @PostDecorator()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un post' })
  @ApiResponse({
    status: 201,
    description: 'Post creado',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreatePostDto): Promise<PostResponseDto> {
    return this.postsService.create(dto);
  }
}
