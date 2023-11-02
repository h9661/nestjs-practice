import { Base } from 'src/common/entities/base.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User extends Base {
  @Column({ length: 500, unique: true })
  name: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
