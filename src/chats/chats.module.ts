import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entity/chats.entity';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
  imports: [TypeOrmModule.forFeature([Chat])],
})
export class ChatsModule {}
