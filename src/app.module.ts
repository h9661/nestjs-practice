import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/entities/post.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Image } from './common/entities/image.entity';
import { ChatsModule } from './chats/chats.module';
import { Chat } from './chats/entity/chats.entity';
import { Message } from './chats/message/entity/message.entity';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
  ],
  imports: [
    PostsModule,
    UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: `${__dirname}/../uploads`,
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Post, User, Image, Chat, Message],
      synchronize: true,
    }),
    ChatsModule,
  ],
})
export class AppModule {}
