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

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
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

  async pagePaginatePosts(paginatePostDto: PaginatePostDto) {
    if (paginatePostDto.page) {
      const [posts, count] = await this.postsRepository.findAndCount({
        take: paginatePostDto.take,
        skip: paginatePostDto.take * (paginatePostDto.page - 1),
      });

      return {
        data: posts,
        total: count,
      };
    } else {
      throw new BadRequestException('page is required');
    }
  }

  async cursorPagenatePosts(paginatePostDto: PaginatePostDto) {
    const { where__id_more_than, where__id_less_than, order__createdAt, take } =
      paginatePostDto;

    if (where__id_more_than && where__id_less_than) {
      throw new Error(
        'where__id_more_than and where__id_less_than cannot be used at the same time',
      );
    }

    const getId = () => {
      if (where__id_more_than) return MoreThan(where__id_more_than);
      else if (where__id_less_than) return LessThan(where__id_less_than);
      else {
        if (order__createdAt == 'ASC') return MoreThan(0);
        else return LessThan(Infinity);
      }
    };

    const posts = await this.postsRepository.find({
      where: {
        id: getId(),
      },
      order: {
        createdAt: order__createdAt,
      },
      take,
    });

    const lastItem = posts.length > 0 ? posts[posts.length - 1] : null;
    const nextUrl = lastItem ? new URL('http://localhost:3000/posts') : null;
    if (nextUrl) {
      for (const key of Object.keys(paginatePostDto)) {
        if (!paginatePostDto[key]) continue;

        if (key != 'where__id_more_than' && key != 'where__id_less_than') {
          nextUrl.searchParams.append(key, paginatePostDto[key]);
        }
      }

      if (paginatePostDto.order__createdAt == 'ASC') {
        nextUrl.searchParams.append(
          'where__id_more_than',
          lastItem.id.toString(),
        );
      } else {
        nextUrl.searchParams.append(
          'where__id_less_than',
          lastItem.id.toString(),
        );
      }
    }

    return {
      data: posts,
      cursor: {
        after: lastItem?.id,
      },
      count: posts?.length,
      next: nextUrl?.toString(),
    };
  }
}
