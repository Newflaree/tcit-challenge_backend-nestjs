import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeletePostUseCase } from '../../../application/use-cases/delete-post/delete-post.use-case';
import { PostResponseDto } from '../../../application/dtos/post-response.dto';
import { ErrorResponseDto } from '../../../../common/dto/error-response.dto';
import { AppLogger } from '../../../../common/logger/logger.service';

@ApiTags('Posts')
@Controller('posts')
export class DeletePostController {
  private readonly logger = new AppLogger(DeletePostController.name);

  constructor(private readonly useCase: DeletePostUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un post por id' })
  @ApiParam({ name: 'id', type: Number })
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
  async handle(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostResponseDto> {
    try {
      this.logger.log(`Handling DELETE /posts/${id}`);
      return await this.useCase.execute(id);
    } catch (error) {
      this.logger.error(`DELETE /posts/${id} failed`, (error as Error).stack);
      throw error;
    }
  }
}
