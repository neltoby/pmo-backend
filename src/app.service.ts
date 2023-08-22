import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AssignRoleReturnType,
  AssignedRoleDoc,
  AssignedRoleType,
  DeleteInviteType,
  Email,
  ForgotPasswordReturnType,
  ForgotPasswordStatus,
  InviteUserDataType,
  InviteUserType,
  JwtTokenInterface,
  PasswordResetType,
  Role,
  SignUpReturnType,
  SigninType,
  SignupUserDatatype,
} from './interfaces/interfaces';
import { AssignedRole } from '@model/assigned-role/schema/assigned-roles.schema.js';
import { User } from '@model/user/schema/user.schema.js';
import { UserModelService } from '@model/user/user.model.service';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { JwtAuthService } from '@jwt-auth/jwt-auth.service';
import { NotificationQueueService } from './notification-queue/notification-queue.service';
import { AssignedRoleModelService } from './model/assigned-role/assigned-role.model.service.js';
import { RolesModelService } from './model/roles/roles.model.service.js';
import { APP_ERROR } from './constants';
import { InviteUserModelService } from '@model/invite-user/inviteuser.model.service';
import { InviteUser } from '@model/invite-user/schema/inviteuser.schema';
import { HashService } from '@hash/hash.service';
import { ForgotPasswordModelService } from '@model/forgot-password/forgot-password.model.service';
import { Schema } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    private usermodelService: UserModelService,
    private assignedrolemodelService: AssignedRoleModelService,
    private rolesmodelService: RolesModelService,
    private inviteuserService: InviteUserModelService,
    private forgotpasswordService: ForgotPasswordModelService,
    private logger: MyLoggerService,
    private jwtService: JwtAuthService,
    private notifQueue: NotificationQueueService,
    private hashService: HashService,
  ) {}

  async emailExistService(
    email: string,
  ): Promise<{ data: User; status: boolean }> {
    const res = await this.usermodelService.findOne({ email });
    return res ? { data: res, status: true } : { data: res, status: false };
  }

  async isEmailExist(email: string): Promise<boolean> {
    const res = await this.emailExistService(email);
    return res.status ? true : false;
  }

  async isEmailExistInRole(email: string): Promise<AssignedRole> {
    return this.assignedrolemodelService.findOneAssignedRole({ email });
  }

  async isAssignerEmailExist(email: string): Promise<boolean> {
    const res = await this.isEmailExistInRole(email);
    return res ? true : false;
  }

  async signupUser(data: SignupUserDatatype): Promise<SignUpReturnType> {
    try {
      const { invite_id, email, password, firstname, lastname } = data;
      const getInviteData = await this.inviteuserService.findOne({
        _id: invite_id,
      });
      if (getInviteData.email === email) {
        const hashPassword = await this.hashService.hashing(password);
        const role = getInviteData.sender.admin
          ? {
              adminassigner: getInviteData.sender.admin,
              role: getInviteData.role,
            }
          : {
              superadminassigner: getInviteData.sender.superadmin,
              role: getInviteData.role,
            };
        if (!(await this.isEmailExist(email))) {
          const user = await this.usermodelService.create({
            email,
            firstname,
            lastname,
            password: hashPassword,
            role,
          });
          const userDetail = user;
          const token = await this.jwtService.signJwt({
            sub: userDetail._id,
            type: 'signup',
          });
          delete userDetail.password;
          return { ...userDetail, token, role: getInviteData.role };
        }
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email already exist.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unrecognized email address',
        },
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: APP_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signinUser(data: SigninType): Promise<SignUpReturnType> {
    const { email, password } = data;
    const isEmail = await this.emailExistService(email);
    if (isEmail.status) {
      const user = isEmail.data;
      try {
        await this.hashService.verifyHash(password, user.password);
      } catch (e) {
        this.logger.error(e.message);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Email and password mismatch.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const token = await this.jwtService.signJwt({
        sub: user._id,
        type: 'signin',
      });
      delete user.password;
      return {
        ...user,
        token,
        role: user.role.role,
      };
    }
  }

  async forgotPassword(email): Promise<ForgotPasswordReturnType> {
    try {
      if (await this.isEmailExist(email)) {
        let forgotPassword = await this.forgotpasswordService.findOne({
          email,
        });
        if (forgotPassword) {
          forgotPassword.status = ForgotPasswordStatus.RequestChange;
        } else {
          forgotPassword = await this.forgotpasswordService.create({
            email,
          });
        }
        const token = await this.jwtService.signJwt({
          id: forgotPassword._id,
          type: 'forgotpassword',
        });

        const emailOptions = {
          from: 'neltoby',
          to: email,
          subject: 'Forgot your password?',
          text: 'Welcome to PMO',
          template: 'forgotpassword',
          context: { token },
        };
        await this.notifQueue.sendInviteMail(emailOptions);
        return { id: forgotPassword._id, status: 'success' };
      }
      this.logger.error('Email does not exist and mail can not be sent.');
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Email does not exist.' },
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: APP_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async assignRole(data: AssignedRoleType): Promise<AssignRoleReturnType> {
    try {
      const { email, roles: assignerRoles, sub, role = Role.Staff } = data;
      const user = await this.emailExistService(email);
      if (user.status) {
        if (
          await this.assignRoleEligibility(sub, user.data._id, assignerRoles[0])
        ) {
          const doc: Omit<AssignedRoleDoc, 'email'> = { role };
          if (assignerRoles.includes(Role.SuperAdmin)) {
            doc.superadminassigner = sub;
            this.logger.log(
              `${Role.SuperAdmin} - sending an assigned role to ${email}`,
            );
          } else {
            doc.assigner = sub;
            this.logger.log(
              `${Role.Admin} - sending an assigned role to ${email}`,
            );
          }
          const resRoles = await this.rolesmodelService.create(doc);
          await this.usermodelService.findOneAndUpdate(
            { email },
            { role: resRoles._id },
          );
          return {
            id: resRoles._id,
            status: 'success',
          };
        }
        throw new UnauthorizedException();
      }
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Email does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: APP_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isInviteUserExistService(email: string): Promise<InviteUser> {
    return await this.inviteuserService.findOne({ email });
  }

  async assignRoleEligibility(
    assigner: Schema.Types.ObjectId,
    assignee: Schema.Types.ObjectId,
    role: Role,
  ): Promise<boolean> {
    if (role === Role.SuperAdmin) {
      return true;
    }
    let assignerRes: User;
    let assigneeRes: User;
    try {
      assignerRes = await this.usermodelService.findOne({ _id: assigner });
      assigneeRes = await this.usermodelService.findOne({ _id: assignee });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const assignerData = assignerRes;
    const assigneeData = assigneeRes;
    if (assignerData.role.role !== Role.Admin) {
      if (assignerData.role.role === Role.ParastatalsHeads) {
        if (assignerData.parastatals === assigneeData.parastatals) {
          return true;
        }
        return false;
      }
      if (assignerData.role.role === Role.DepartmentHeads) {
        if (assignerData.department === assigneeData.department) {
          return true;
        }
        return false;
      }
    }
    return true;
  }

  async isInviteUserExist(email: string): Promise<boolean> {
    return (await this.isInviteUserExistService(email)) ? true : false;
  }

  async inviteUser(data: InviteUserType): Promise<AssignRoleReturnType> {
    const { email, roles, sub, role, parastatals, department } = data;
    if (!(await this.isEmailExist(email))) {
      if (!(await this.isInviteUserExist)) {
        if (role !== Role.Admin) {
          if (!parastatals || !department) {
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                error: 'Missing parastatals or department.',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }
        const doc = {
          email,
          sender: {},
          parastatals,
          department,
          role,
        } as InviteUserDataType;
        if (roles.includes(Role.SuperAdmin)) {
          doc.sender.superadmin = sub;
          this.logger.log(`${Role.SuperAdmin} - sending invite to ${email}`);
        } else {
          doc.sender.admin = sub;
          this.logger.log(`${roles[0]} - sending invite to ${email}`);
        }
        if (!role) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: 'Missing role.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        let inviteRes;
        try {
          inviteRes = await this.inviteuserService.create(doc);
        } catch (e) {
          this.logger.error(e.message);
          throw new HttpException(
            { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        let token;
        try {
          token = await this.jwtService.signJwt({
            invite_id: inviteRes.toObject()._id,
            type: 'invite',
          });
        } catch (e) {
          this.logger.error(e.message);
          throw new HttpException(
            { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        const emailOptions = {
          from: 'neltoby',
          to: email,
          subject: department
            ? `You have been invited at ${parastatals}!`
            : 'You have been invited as an Admin at PMO.',
          text: 'Welcome to PMO',
          template: role ? 'invitewithrole' : 'invitation',
          context: { token },
        };
        await this.notifQueue.sendInviteMail(emailOptions);
        return { status: 'success', id: inviteRes.toObject()._id };
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User already has an invite.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    throw new HttpException(
      { status: HttpStatus.BAD_REQUEST, error: 'User already exists.' },
      HttpStatus.BAD_REQUEST,
    );
  }

  async deleteInvite(data: DeleteInviteType) {
    const { id } = data;
    let res;
    try {
      res = await this.inviteuserService.findOne({ _id: id });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const resRoles = res.toObject();
    let checkEmail;
    try {
      checkEmail = await this.isEmailExist(resRoles.email);
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (checkEmail) {
      this.logger.error('Email has been registered and can not be deleted');
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Invite has been used.' },
        HttpStatus.BAD_REQUEST,
      );
    }
    this.inviteuserService.findAndDelete({ _id: id });
    return { id };
  }

  async verifyInvite(data: JwtTokenInterface): Promise<InviteUser> {
    try {
      const { invite_id } = await this.jwtService.verifyJwt(data.token);
      const res = await this.inviteuserService.findOne({ _id: invite_id });
      return res;
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPasswordToken(data: Email): Promise<AssignRoleReturnType> {
    const { email } = data;
    let user;
    try {
      user = await this.usermodelService.findOne({ email });
    } catch (e) {
      this.logger.error(e.message);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (user) {
      return { id: user.toObject()._id, status: 'success' };
    }
    this.logger.error('User not found');
    throw new HttpException(
      { status: HttpStatus.NOT_FOUND, error: 'Resource not found.' },
      HttpStatus.NOT_FOUND,
    );
  }

  async passwordReset(data: PasswordResetType): Promise<AssignRoleReturnType> {
    const { password, confirm_password, id } = data;
    if (password === confirm_password) {
      let user: User;
      try {
        user = await this.usermodelService.findOne({ _id: id });
      } catch (e) {
        this.logger.error(e.message);
        throw new HttpException(
          { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      let hashPassword: string;
      try {
        hashPassword = await this.hashService.hashing(password);
      } catch (e) {
        this.logger.error(e.message);
        throw new HttpException(
          { status: HttpStatus.INTERNAL_SERVER_ERROR, error: APP_ERROR },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      user.password = hashPassword;
      // TODO: Update password to database
      // user.save();
      return { status: 'success', id: user._id };
    }
    this.logger.error('Password do not match');
    throw new HttpException(
      { status: HttpStatus.BAD_REQUEST, error: 'Incorrect password.' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
