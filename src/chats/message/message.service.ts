import { Injectable } from '@nestjs/common';
import { Message } from './entity/message.entity';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatsMessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(dto: CreateMessageDto) {
    const message = await this.messagesRepository.save({
      chat: { id: dto.chatId },
      user: { id: dto.authorId },
      text: dto.text,
    });

    return this.messagesRepository.findOne({
      where: { id: message.id },
      relations: ['user', 'chat'],
    });
  }
}
