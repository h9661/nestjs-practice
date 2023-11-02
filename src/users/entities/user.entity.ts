import { IsEmail, IsString, Length } from 'class-validator';
import { Base } from 'src/common/entities/base.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity({ name: 'users' })
export class User extends Base {
  @Column({ length: 500, unique: true })
  @IsString()
  @Length(1, 20)
  name: string;

  @Column({ length: 500 })
  @IsString()
  @IsEmail()
  email: string;

  @Column({ length: 500 })
  @IsString()
  @Length(3, 8)
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
