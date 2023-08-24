/* eslint-disable @typescript-eslint/ban-types */
import { Schema } from 'mongoose';

export enum Role {
  Staff = 'staff',
  Admin = 'admin',
  ParastatalsHeads = 'parastatals',
  DepartmentHeads = 'department',
  SuperAdmin = 'superadmin',
}

export enum Verified {
  Verified = 'verified',
  Unverified = 'unverified',
}

export enum AdminStatusType {
  Accept = 'accept',
  Reject = 'reject',
}

export enum ForgotPasswordStatus {
  RequestChange = 'request change',
  Changed = 'changed',
}

export enum InviteStatus {
  Awaiting = 'awaiting',
  Fulfilled = 'fulfilled',
}

export type Email = {
  email: string;
};

export type Success = 'success';

export type ForgotPasswordReturnType = {
  id: Schema.Types.ObjectId;
  status: Success;
};

export type ObjectIdType = {
  _id: Schema.Types.ObjectId;
};

export type ForgotPasswordType = Email & {
  token?: string;
};

export type SigninType = Password & Email;

export type SignUpReturnType = Omit<
  SignupUserDatatype,
  'password' | 'invite_id'
> &
  ObjectIdType & {
    token: string;
    role: Role;
  };

export interface AssignRoleInterface extends Email {
  role: Role;
}

export type AssignRoleReturnType = {
  status: string;
  id: Schema.Types.ObjectId;
};

export type CreateRoles = {
  adminassigner?: Schema.Types.ObjectId;
  superadminassigner?: Schema.Types.ObjectId;
  role: Role;
};

export type AssignedRoleType = TokenPayloadInterface & AssignRoleInterface;

export type ForgotPasswordTokenType = {
  id: Schema.Types.ObjectId;
  type: 'forgotpassword';
};

export type InviteTokenPayloadType = {
  invite_id: Schema.Types.ObjectId;
  type: 'invite';
};

export interface TokenPayloadInterface {
  sub: Schema.Types.ObjectId;
  roles: Role[];
}

export type DeleteInviteType = {
  id: Schema.Types.ObjectId;
};

export type AssignedRoleDoc = AssignRoleInterface & {
  superadminassigner?: Schema.Types.ObjectId;
  assigner?: Schema.Types.ObjectId;
};

export type AssignedRoleMethodDataInterface = AssignRoleInterface &
  TokenPayloadInterface;

export interface CreateAssignRoleInterface extends Email {
  roles: Schema.Types.ObjectId;
}

export interface AssignRoleRetValueInterface {
  status: string;
}

export type SenderType = {
  sender: {
    superadmin?: Schema.Types.ObjectId;
    admin?: Schema.Types.ObjectId;
  };
};

export type RoleOptionalType = {
  role?: Role;
};

export type OptonalParastatalsType = {
  parastatals?: Schema.Types.ObjectId;
  department?: Schema.Types.ObjectId;
};

export type InviteUserDataType = Email &
  SenderType &
  RoleOptionalType &
  OptonalParastatalsType;

export type InviteUserType = TokenPayloadInterface &
  Email &
  RoleOptionalType &
  OptonalParastatalsType;

export interface JwtTokenInterface {
  token: string;
}

export type SuperAdminVerificationData = {
  status: string;
  success: boolean;
  token?: string;
  sub?: Schema.Types.ObjectId;
  username?: string;
};

export type SenderDataType = {
  admin: Schema.Types.ObjectId;
  superadmin: Schema.Types.ObjectId;
};

export type DepartmentType = {
  name: string;
};

export type SchemaDepartmentType = {
  _id: Schema.Types.ObjectId;
  name: string;
  date: Date;
};

export type UserDetails = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  parastatals: Schema.Types.ObjectId;
  department: SchemaDepartmentType;
  date: Date;
};

export type AddDepartmentType = DepartmentType & {
  pid: Schema.Types.ObjectId;
};

export type ParastatalsType = {
  name: string;
};

export type GetDepartmentType = {
  pid: Schema.Types.ObjectId;
  did: Schema.Types.ObjectId;
};

export type ParastatalsDataType = ParastatalsType & {
  department?: DepartmentType;
};

export type PasswordResetType = {
  password: string;
  confirm_password: string;
  id: Schema.Types.ObjectId;
};

export interface Password {
  password: string;
}

export type UserSignupCredential = Password &
  Email & {
    firstname: string;
    lastname: string;
    role: CreateRoles;
  };

export type SignupSuperUserType = Email &
  Password & {
    username: string;
  };

export type SignupUserDatatype = Password &
  Email & {
    firstname: string;
    lastname: string;
    invite_id: Schema.Types.ObjectId;
  };

export interface TransportOptions {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  attachments?: { filename: string; path: string }[];
  context: { [key: string]: unknown };
}
