import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { ModelService } from './model/model.service';
import { HashService } from '@hash/hash.service';
// import { JwtAuthService } from '@jwt-auth/jwt-auth.service';
import { NotificationQueueService } from 'src/notification-queue/notification-queue.service';
import { SigninSuperAdminDto } from './dto/signin-super-admin.dto';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { SuperAdmin } from './model/schema/superuser.schema';
import {
  AdminStatusType,
  Role,
  SuperAdminVerificationData,
  Verified,
} from '@interfaces/interfaces';
import { APP_ERROR, NO_RESOURCE } from 'src/constants';

@Injectable()
export class SuperAdminService {
  constructor(
    private modelService: ModelService,
    private hashService: HashService,
    private jwtService: JwtService,
    private notifQueue: NotificationQueueService,
    private logger: MyLoggerService,
  ) {}
  async createSuperUser(user: CreateSuperAdminDto): Promise<any> {
    const { email, password, username, request_id } = user;
    // try {
    const resEmail = await this.isFieldExist(email);
    if (resEmail.status) {
      this.logger.error(`Email(${email}) already exist}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Email already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const resUser = await this.isFieldExist(username);
    if (resUser.status) {
      this.logger.error(`Username(${username}) already exist - ${request_id}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Username already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await this.hashService.hashing(password);
    this.logger.log(`Hashing was successful`);
    const adminCreated = await this.modelService.create({
      ...user,
      password: hashPassword,
    });
    this.logger.log(`Account was created successfully`);
    const adminDetails = adminCreated;
    delete adminDetails.password;
    const token = await this.jwtService.signAsync({
      sub: adminDetails._id,
      verification_status: adminDetails.verified,
    });
    let updateToken;
    try {
      updateToken = await this.modelService.findOneAndUpdate(
        { _id: adminDetails._id },
        { verification_token: token },
        { new: true },
      );
    } catch (e) {
      this.logger.error(`Failed to update verification token::: ${e.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: APP_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const emailOptions = {
      from: 'neltoby',
      to: 'admin@pom.com',
      subject: 'Admin Verification!',
      template: 'index',
      context: { username: adminDetails.username, token },
    };
    await this.notifQueue.createSuperAdminMail(emailOptions);
    this.logger.log(`Email notification sent to queue`);
    return { status: 'success', verification_status: adminDetails.verified };
  }

  findAll() {
    return `This action returns all superAdmin`;
  }

  async signinSuperAdmin(user: SigninSuperAdminDto) {
    try {
      console.log(user, 'line 102');
      const { password, username } = user;
      const resUser: any = await this.isUsernameFieldExist(username);
      if (resUser.status) {
        const userData: any = resUser.data._doc;
        // const hashPassword = await this.hashService.hashing(password);
        const data = await this.hashService.verifyHash(
          password,
          userData.password,
        );
        if (data) {
          if (userData.verified === 'verified') {
            delete userData.password;
            delete userData.token;
            delete userData.verification_token;

            const token = await this.jwtService.signAsync({
              sub: userData._id,
              roles: [Role.SuperAdmin],
            });
            return {
              ...userData,
              roles: [Role.SuperAdmin],
              token,
            };
          }
          this.logger.error(`User(${username}) is not verified yet`);
          throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              error: 'You are not authorized to access this resource',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        this.logger.error(`User with username(${username}) does not exist`);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: NO_RESOURCE,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new NotFoundException();
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isUsernameFieldExist(
    username: string,
  ): Promise<{ data?: SuperAdmin; status: boolean }> {
    const val = await this.modelService.findOne({ username });
    if (val) {
      return { data: val, status: true };
    }
    return { data: val, status: false };
  }

  async isFieldExist(
    email: string,
  ): Promise<{ data?: SuperAdmin; status: boolean }> {
    const val = await this.modelService.findOne({ email });
    if (val) {
      return { data: val, status: true };
    }
    return { data: val, status: false };
  }

  async verifyAdmin(token: string): Promise<SuperAdminVerificationData> {
    let doc;
    try {
      doc = await this.modelService.findOne({ verification_token: token });
      console.log(doc);
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (doc._id) {
      if (doc.verified === 'unverified') {
        let user;
        try {
          user = await this.jwtService.verifyAsync(token);
        } catch (err) {
          this.logger.error(`Token verification failed: ${err.message}`);
          throw new HttpException(
            { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return {
          status: 'Verified.',
          success: true,
          sub: doc._id,
          username: doc.username,
        };
      }
      return {
        status: 'Already verified.',
        success: false,
        token,
      };
    }
    this.logger.error(`$token} does not exist on the server`);
    return {
      status: 'Failed verification.',
      token,
      success: false,
    };
  }

  async adminStatus({ id, status }: { id: string; status: AdminStatusType }) {
    let user;
    try {
      user = await this.modelService.findOne({ _id: id });
    } catch (e) {
      this.logger.error(`Failed to get user credentials: ${JSON.stringify(e)}`);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (user.verified === Verified.Unverified) {
      if (status === AdminStatusType.Accept) {
        let doc;
        try {
          doc = await this.modelService.findOneAndUpdate(
            { _id: id },
            { verified: 'verified' },
            { new: true },
          );
        } catch (e) {
          this.logger.error(`Failed to update verified status: ${e.message}`);
          throw new HttpException(
            { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        if (doc.verified === 'verified') {
          const emailOptions = {
            from: 'admin@pom.com',
            to: doc.email,
            subject: 'You have been verified!',
            template: 'admin-verify',
            context: {},
          };
          await this.notifQueue.createSuperAdminMail(emailOptions);
          return {
            action: 'Accept as admin.',
            status: 'success',
            accept: true,
          };
        }
      } else {
        let doc;
        try {
          doc = this.modelService.findOneAndDelete({ _id: id });
          return {
            action: 'Delete user.',
            status: 'success',
            accept: false,
          };
        } catch (e) {
          this.logger.error(`Failed to delete user: ${e.message}`);
          throw new HttpException(
            { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
    return {
      status: 'Failed.',
      accept: false,
    };
  }
}
