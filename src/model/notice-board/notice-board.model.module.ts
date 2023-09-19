import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NoticeBoardModelService } from './notice-board.model.service';
import { NoticeBoard, NoticeBoardSchema } from './schema/notice-board.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: NoticeBoard.name,
        useFactory: () => {
          const schema = NoticeBoardSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-unique-validator'));
          return schema;
        },
      },
    ]),
  ],
  providers: [NoticeBoardModelService],
  exports: [NoticeBoardModelService],
})
export class NoticeBoardModelModule {}
