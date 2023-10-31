import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ length: 500 })
  author: string;

  @Column('text')
  content: string;

  @Column({ length: 100 })
  title: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
