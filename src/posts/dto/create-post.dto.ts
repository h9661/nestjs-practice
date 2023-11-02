import { IsString } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Content must be a string' })
  content: string;

  @IsString({ message: 'Title must be a string' })
  title: string;
}
