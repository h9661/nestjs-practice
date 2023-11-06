import { PickType } from '@nestjs/mapped-types';
import { Post } from '../entities/post.entity';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto extends PickType(Post, ['title', 'content']) {
  @IsArray()
  @IsOptional()
  images: string[] = [];
}
