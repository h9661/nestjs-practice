import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ length: 500 })
  nickname: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
