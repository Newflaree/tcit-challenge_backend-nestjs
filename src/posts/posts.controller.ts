import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<PostResponseDto[]> {
    return this.postsService.findAll();
  }
}
