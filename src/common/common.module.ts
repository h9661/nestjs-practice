import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [],
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }

        cb(null, true);
      },
      storage: {
        destination: (req, file, cb) => {
          cb(null, 'uploads/temp');
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      },
    }),
    AuthModule,
    UsersModule,
  ],
})
export class CommonModule {}
