import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorators/user.decorator';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageType } from 'src/common/entities/image.entity';
import { DataSource } from 'typeorm';
import { PostImageService } from './image/images.service';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorators/qr.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postImageService: PostImageService,
  ) {}

  @Post('/create')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async create(
    @User('id') id,
    @QueryRunner() qr,
    @Body() createPostDto: CreatePostDto,
  ) {
    const post = await this.postsService.create(createPostDto, id, qr);

    for (let i = 0; i < createPostDto.images.length; i++) {
      await this.postImageService.createPostImage(
        {
          post,
          order: i,
          path: createPostDto.images[i],
          type: ImageType.POST_IMAGE,
        },
        qr,
      );
    }

    return this.postsService.findOne(post.id);
  }

  @Get()
  findAll(@Query() paginatePostDto: PaginatePostDto) {
    return this.postsService.paginatePosts(paginatePostDto, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id/update')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id/delete')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
