import { IsString } from 'class-validator';
import { Chat } from 'src/chats/entity/chats.entity';
import { Base } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Message extends Base {
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @Column({ length: 500 })
  @IsString()
  text: string;
}
