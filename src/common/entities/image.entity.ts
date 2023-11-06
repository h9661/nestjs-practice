import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { join } from 'path';
import { POST_IMAGE_PATH } from '../const/paths.const';
import { Post } from 'src/posts/entities/post.entity';

export enum ImageType {
  POST_IMAGE = 'POST_IMAGE',
  USER_IMAGE = 'USER_IMAGE',
}

@Entity()
export class Image extends Base {
  @Column({ default: 0 })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({ type: 'enum', enum: ImageType, default: ImageType.POST_IMAGE })
  type: ImageType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageType.POST_IMAGE) {
      return join(POST_IMAGE_PATH, value);
    } else {
      return value;
    }
  })
  path: string;

  @ManyToOne(() => Post, (post) => post.images)
  post?: Post;
}
