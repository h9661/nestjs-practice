import { IsString } from 'class-validator';
import { Base } from 'src/common/entities/base.entity';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'posts' })
export class Post extends Base {
  @Column('text')
  @IsString({ message: stringValidationMessage })
  content: string;

  @Column({ length: 100 })
  @IsString({ message: stringValidationMessage })
  title: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
