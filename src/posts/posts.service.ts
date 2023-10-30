import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
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
}
