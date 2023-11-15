import { PickType } from '@nestjs/mapped-types';
import { Message } from '../entity/message.entity';
import { IsNumber } from 'class-validator';

export class CreateMessageDto extends PickType(Message, ['text']) {
  @IsNumber()
  chatId: number;

  @IsNumber()
  authorId: number;
}
