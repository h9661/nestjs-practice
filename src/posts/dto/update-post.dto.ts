import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  author: string;
  content: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
