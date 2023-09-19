import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateNoticeBoardDto } from './dto/create-notice-board.dto';
import { UpdateNoticeBoardDto } from './dto/update-notice-board.dto';
import { NoticeBoardModelService } from '@model/notice-board/notice-board.model.service';
import {
  NoticeDataType,
  NoticeMessageBy,
  NoticeMessageTo,
  Role,
  SendEmailNotice,
  SendHeadsEmailNotice,
  Verified,
} from '@interfaces/interfaces';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { APP_ERROR } from 'src/constants';
import { AppService } from 'src/app.service';
import { Schema, Types } from 'mongoose';
import { NotificationQueueService } from 'src/notification-queue/notification-queue.service';
import { UserModelService } from '@model/user/user.model.service';

@Injectable()
export class NoticeBoardService {
  constructor(
    private noticeBoardModelService: NoticeBoardModelService,
    private logger: MyLoggerService,
    // @Inject(forwardRef(() => AppService))
    private appService: AppService,
    private userModelService: UserModelService,
    private notifQueue: NotificationQueueService,
  ) {}

  async create(
    notice: { admin_id: Schema.Types.ObjectId } & CreateNoticeBoardDto,
  ) {
    const {
      admin_id,
      message,
      to,
      by,
      title,
      to_user = null,
      to_parastatal = null,
    } = notice;
    const msg: NoticeDataType = {
      admin_id,
      message,
      to,
      by,
      title,
      to_user,
      to_parastatal,
    };
    let saveNotice;
    if (by === NoticeMessageBy.EMAIL) {
      if (!(await this.appService.isEmailExist(to_user))) {
        throw new HttpException(
          { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    try {
      saveNotice = await this.noticeBoardModelService.create(msg);
    } catch (e) {
      this.logger.log(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (by === NoticeMessageBy.EMAIL) {
      const senderEmail = await this.userModelService.findOne({
        _id: admin_id,
      });
      if (to === NoticeMessageTo.INDIVIDUAL) {
        this.sendUserMail({
          message,
          title,
          email: to_user,
          senderEmail: senderEmail.email,
        });
      }

      if (to === NoticeMessageTo.HEADS) {
        this.sendHeadsEmail({
          message,
          title,
          parastatal: to_parastatal,
          senderEmail: senderEmail.email,
        });
      }
    }
    return { ...saveNotice._doc };
  }

  async findAll(id: Schema.Types.ObjectId) {
    console.log(id, typeof id, 'line 103');
    const castedId = new Types.ObjectId(id as any);
    const content = await this.noticeBoardModelService.rawModel().aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'admin_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'parastatals',
          localField: 'to_parastatal',
          foreignField: '_id',
          as: 'parastatal',
        },
      },
      {
        $match: {
          admin_id: castedId,
        },
      },
      { $sort: { updatedAt: -1 } },
      {
        $project: {
          admin_id: 1,
          message: 1,
          to: 1,
          by: 1,
          title: 1,
          to_user: 1,
          to_parastatal: 1,
          updatedAt: 1,
          'user.firstname': 1,
          'user.lastname': 1,
          'user.middlename': 1,
          'user.profile_image': 1,
          'parastatal.name': 1,
        },
      },
    ]);
    // const content = await this.noticeBoardModelService.findAllWhere({
    //   admin_id: id,
    // });
    return content;
  }

  async findOne(_id: Schema.Types.ObjectId) {
    let user;
    try {
      user = await this.userModelService.findOne({ _id });
    } catch (e) {
      this.logger.log(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    console.log(user.parastatal, 'line 163');
    let notice;
    if (user.role === Role.ParastatalsHeads) {
      try {
        notice = await this.noticeBoardModelService.rawModel().aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    { to: NoticeMessageTo.HEADS },
                    { to: NoticeMessageTo.PARASTATAL },
                  ],
                },
                {
                  to_parastatal: user.parastatal,
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'admin_id',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $lookup: {
              from: 'parastatals',
              localField: 'to_parastatal',
              foreignField: '_id',
              as: 'parastatal',
            },
          },
          {
            $project: {
              by: 1,
              message: 1,
              title: 1,
              to: 1,
              to_parastatal: 1,
              updatedAt: 1,
              'user.firstname': 1,
              'user.lastname': 1,
              'user.middlename': 1,
              'user.fullname': 1,
              'user.profile_image': 1,
              'user._id': 1,
              'parastatal.name': 1,
            },
          },
        ]);
      } catch (e) {
        this.logger.log(e.message);
        throw new HttpException(
          { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      try {
        notice = await this.noticeBoardModelService.rawModel().aggregate([
          {
            $match: {
              $and: [
                { to: NoticeMessageTo.PARASTATAL },
                { to_parastatal: user.parastatal },
              ],
            },
          },
          {
            $lookup: {
              from: 'users',
              localField: 'admin_id',
              foreignField: '_id',
              as: 'users',
            },
          },
          {
            $lookup: {
              from: 'parastatals',
              localField: 'to_parastatal',
              foreignField: '_id',
              as: 'parastatal',
            },
          },
          {
            $project: {
              by: 1,
              message: 1,
              title: 1,
              to: 1,
              to_parastatal: 1,
              updatedAt: 1,
              'users.firstname': 1,
              'users.lastname': 1,
              'users.middlename': 1,
              'users.fullname': 1,
              'users.profile_image': 1,
              'users._id': 1,
              'parastatal.name': 1,
            },
          },
        ]);
      } catch (e) {
        this.logger.log(e.message);
        throw new HttpException(
          { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    return notice;
  }

  update(id: number, updateNoticeBoardDto: UpdateNoticeBoardDto) {
    return `This action updates a #${id} noticeBoard`;
  }

  remove(id: number) {
    return `This action removes a #${id} noticeBoard`;
  }

  async sendUserMail(data: SendEmailNotice) {
    const { message, title, email, senderEmail } = data;
    const emailOptions = {
      from: senderEmail,
      to: email,
      subject: title,
      text: 'PMO Notice',
      template: 'notice',
      context: { message },
    };
    await this.notifQueue.sendNoticeMail(emailOptions);
  }

  async sendHeadsEmail(data: SendHeadsEmailNotice) {
    const { message, title, parastatal, senderEmail } = data;
    const hodData = await Promise.all(
      parastatal.map(async (item, i: number) => {
        return await this.userModelService.findOne({
          parastatal: item,
          role: Role.ParastatalsHeads,
          verified: Verified.Verified,
        });
      }),
    );
    if (hodData.length) {
      for (let i = 0; i < hodData.length; i++) {
        const emailOptions = {
          from: senderEmail,
          to: hodData[i].email,
          subject: title,
          text: 'PMO Notice',
          template: 'notice',
          context: { message },
        };
        await this.notifQueue.sendNoticeMail(emailOptions);
      }
    }
  }
}
