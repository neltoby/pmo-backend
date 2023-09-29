import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { APP_ERROR, SERVICE_CONFIG } from 'src/constants';
import { UploaderAbstract } from './upload.abstract';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { basename, extname } from 'path';

@Injectable()
export class UploadService extends UploaderAbstract {
  constructor(
    @Inject(SERVICE_CONFIG) private uploaderConfig,
    private logger: MyLoggerService,
  ) {
    super();
  }

  async upload(file: Express.Multer.File) {
    let res;
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

    console.log(file.originalname, 'line 20');

    try {
      res = await this.uploaderConfig.uploader.upload(dataURI, {
        public_id: `pmo/user/${new Date().getTime()}${basename(
          file.originalname,
          extname(file.originalname),
        )}`,
      });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return res;
  }
}
