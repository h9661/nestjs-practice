import { Injectable } from '@nestjs/common';
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
    return posts.find((post) => post.id === id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const postIndex = posts.findIndex((post) => post.id === id);
    posts[postIndex] = {
      ...posts[postIndex],
      ...updatePostDto,
      updatedAt: new Date(),
    };
    return posts[postIndex];
  }

  remove(id: number) {
    posts = posts.filter((post) => post.id !== id);
    return posts;
  }
}
