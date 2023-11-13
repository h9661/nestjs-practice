import { Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { Image } from 'src/common/entities/image.entity';
import { PostImageService } from './image/images.service';
import { LoggerMiddleware } from 'src/common/middlewares/log.middleware';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostImageService],
  imports: [
    TypeOrmModule.forFeature([Post, Image]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
})
export class PostsModule implements NestModule {
  configure(consumer) {
    consumer.apply().forRoutes(LoggerMiddleware).forRoutes({
      path: 'posts',
      method: RequestMethod.ALL,
    });
  }
}
