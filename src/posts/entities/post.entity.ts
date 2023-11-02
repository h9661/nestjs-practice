import { Base } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'posts' })
export class Post extends Base {
  @Column({ length: 500 })
  author: string;

  @Column('text')
  content: string;

  @Column({ length: 100 })
  title: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
