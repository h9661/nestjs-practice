import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { basename, join } from 'path';
import {
  POST_IMAGE_PATH,
  PUBLIC_FOLDER_PATH,
} from 'src/common/const/paths.const';
import { promises } from 'fs';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly commonService: CommonService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const post = this.postsRepository.create({
      user: {
        id: userId,
      },
      content: createPostDto.content,
      title: createPostDto.title,
    });

    return this.postsRepository.save(post);
  }

  async createPostImage(createPostDto: CreatePostDto) {
    const tempFilePath = join(PUBLIC_FOLDER_PATH, createPostDto.image);

    try {
      // 파일이 존재하는지 확인
      // 만약에 존재하지 않는다면 에러를 던짐
      await promises.access(tempFilePath);
    } catch (e) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }

    // 파일의 이름만 가져오기
    const fileName = basename(createPostDto.image);

    // 새로 이동할 포스트 폴더의 경로 + 이미지 이름
    const newPath = join(POST_IMAGE_PATH, fileName);

    // 파일 이동
    await promises.rename(tempFilePath, newPath);

    return true;
  }

  async findAll() {
    return this.postsRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    const updatedPost = Object.assign(post, updatePostDto);

    return this.postsRepository.save(updatedPost);
  }

  async remove(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return this.postsRepository.remove(post);
  }

  async paginatePosts(paginatePostDto: PaginatePostDto, overrideFindOptions) {
    return this.commonService.paginate<Post>(
      paginatePostDto,
      this.postsRepository,
      overrideFindOptions,
      'posts',
    );
  }
}
