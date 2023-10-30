import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

let posts: Post[] = [
  {
    id: 1,
    author: 'John Doe',
    title: 'First Post',
    content: 'Lorem ipsum dolor sit amet',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    author: 'John Doe',
    title: 'First Post',
    content: 'Lorem ipsum dolor sit amet',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    author: 'John Doe',
    title: 'First Post',
    content: 'Lorem ipsum dolor sit amet',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

@Injectable()
export class PostsService {
  create(createPostDto: CreatePostDto) {
    const newPost = {
      id: posts.length + 1,
      ...createPostDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    posts.push(newPost);
    return newPost;
  }

  findAll() {
    return posts;
  }

  findOne(id: number) {
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    } else {
      return post;
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const post = this.findOne(id);
    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex !== -1) {
      posts[postIndex] = {
        ...post,
        ...updatePostDto,
        updatedAt: new Date(),
      };
    } else {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return posts[postIndex];
  }

  remove(id: number) {
    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex !== -1) {
      posts.splice(postIndex, 1);
    } else {
      throw new NotFoundException(`Post #${id} not found`);
    }
  }
}
