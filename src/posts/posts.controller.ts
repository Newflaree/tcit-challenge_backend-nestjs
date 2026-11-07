import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post as PostDecorator,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
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
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
    type: ErrorResponseDto,
  })
  async findAll(): Promise<PostResponseDto[]> {
    return this.postsService.findAll();
  }

  @PostDecorator()
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
  async create(@Body() dto: CreatePostDto): Promise<PostResponseDto> {
    return this.postsService.create(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un post por id' })
  @ApiParam({ name: 'id', type: Number, description: 'Identificador del post' })
  @ApiResponse({
    status: 200,
    description: 'Post eliminado',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Id inválido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post no encontrado',
    type: ErrorResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostResponseDto> {
    return this.postsService.remove(id);
  }
}
