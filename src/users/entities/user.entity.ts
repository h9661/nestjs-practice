import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { Chat } from 'src/chats/entity/chats.entity';
import { Message } from 'src/chats/message/entity/message.entity';
import { Base } from 'src/common/entities/base.entity';
import { emailValidationMessage } from 'src/common/validation-message/email.validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { Post } from 'src/posts/entities/post.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity({ name: 'users' })
export class User extends Base {
  @Column({ length: 500, unique: true })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  name: string;

  @Column({ length: 500 })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column({ length: 500 })
  @IsString()
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ManyToMany(() => Chat, (chat) => chat.users)
  chats: Chat[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
