import { Base } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Message } from '../message/entity/message.entity';

@Entity()
export class Chat extends Base {
  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
