import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entity/chats.entity';
import { CommonService } from 'src/common/common.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
  imports: [TypeOrmModule.forFeature([Chat]), CommonService],
})
export class ChatsModule {}
