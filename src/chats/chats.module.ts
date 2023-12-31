import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entity/chats.entity';
import { CommonService } from 'src/common/common.service';
import { ChatsMessagesService } from './message/message.service';
import { Message } from './message/entity/message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway, ChatsMessagesService],
  imports: [
    TypeOrmModule.forFeature([Chat, Message]),
    CommonService,
    AuthModule,
    UsersModule,
  ],
})
export class ChatsModule {}
