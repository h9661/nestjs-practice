import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { QueryRunner, Repository } from 'typeorm';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from 'src/common/common.service';
import { Image } from 'src/common/entities/image.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    private readonly commonService: CommonService,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(Post) : this.postsRepository;
  }

  async create(createPostDto: CreatePostDto, userId: number, qr?: QueryRunner) {
    const post = this.getRepository(qr).create({
      user: {
        id: userId,
      },
      content: createPostDto.content,
      title: createPostDto.title,
    });

    return this.getRepository(qr).save(post);
  }

  async findAll() {
    return this.postsRepository.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        images: true,
      },
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
