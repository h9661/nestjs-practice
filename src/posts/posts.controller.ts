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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorators/user.decorator';
import { PaginatePostDto } from './dto/paginate-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create')
  @UseGuards(AccessTokenGuard)
  create(@User('id') id, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto, id);
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
