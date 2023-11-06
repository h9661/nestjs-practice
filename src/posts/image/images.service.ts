import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/common/entities/image.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreatePostImageDto } from './dto/create-image.dto';
import {
  POST_IMAGE_PATH,
  PUBLIC_FOLDER_PATH,
} from 'src/common/const/paths.const';
import { promises } from 'fs';
import { basename, join } from 'path';

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(Image) : this.imagesRepository;
  }

  async createPostImage(
    createPostImageDto: CreatePostImageDto,
    qr?: QueryRunner,
  ) {
    const tempFilePath = join(PUBLIC_FOLDER_PATH, createPostImageDto.path);

    try {
      // 파일이 존재하는지 확인
      // 만약에 존재하지 않는다면 에러를 던짐
      await promises.access(tempFilePath);
    } catch (e) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }

    // 파일의 이름만 가져오기
    const fileName = basename(tempFilePath);

    // 새로 이동할 포스트 폴더의 경로 + 이미지 이름
    const newPath = join(POST_IMAGE_PATH, fileName);

    // save
    const result = await this.getRepository(qr).save({
      order: createPostImageDto.order,
      path: newPath,
      type: createPostImageDto.type,
      post: createPostImageDto.post,
    });

    // 파일 이동
    await promises.rename(tempFilePath, newPath);

    return true;
  }
}
