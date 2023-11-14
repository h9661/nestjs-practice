import { Base } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Chat extends Base {
  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  users: User[];
}
