import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RoleAssigned } from './dto/role-assigned.dto';
import {
  AssignRoleReturnType,
  Email,
  ForgotPasswordReturnType,
  InviteTokenPayloadType,
  Role,
  SignUpReturnType,
  TokenPayloadInterface,
  UserDetails,
} from '@interfaces/interfaces';
import { AuthGuard } from './auth/auth.guard';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { SignupDto } from './dto/signup.dto';
import { InviteDto } from './dto/invite.dto';
import { DeleteInviteDto } from './dto/delete-invite.dto';
import { VerifyInviteDto } from './dto/verify-invite.dto';
import { SigninDto } from './dto/signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { AuthSignupGuard } from './auth/auth-signup.guard';
import { ForgotPasswordGuard } from './auth/forgotpassword.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InviteUser } from '@model/invite-user/schema/inviteuser.schema';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Get()
  getUser(@Request() req): Promise<UserDetails> {
    return this.appService.getUser((req as TokenPayloadInterface).sub);
  }

  @UseGuards(AuthGuard)
  @Roles(
    Role.SuperAdmin,
    Role.Admin,
    Role.ParastatalsHeads,
    Role.DepartmentHeads,
  )
  @UseGuards(RolesGuard)
  @Post('invite/assign-role')
  inviteAndAssignRole(
    @Body() data: RoleAssigned,
    @Request() req,
  ): Promise<AssignRoleReturnType> {
    const dataTrasform: Omit<RoleAssigned, 'parastatals' | 'department'> = data;
    return this.appService.inviteUser({
      ...dataTrasform,
      ...(req.user as TokenPayloadInterface),
    });
  }

  @UseGuards(AuthGuard)
  @Roles(
    Role.SuperAdmin,
    Role.Admin,
    Role.ParastatalsHeads,
    Role.DepartmentHeads,
  )
  @UseGuards(RolesGuard)
  @Post('assign-role')
  assignRole(
    @Body() data: RoleAssigned,
    @Request() req,
  ): Promise<AssignRoleReturnType> {
    return this.appService.assignRole({
      ...data,
      ...(req as TokenPayloadInterface),
    });
  }

  @UseGuards(AuthGuard)
  @Roles(
    Role.SuperAdmin,
    Role.Admin,
    Role.ParastatalsHeads,
    Role.DepartmentHeads,
  )
  @UseGuards(RolesGuard)
  @Post('invite')
  inviteUser(
    @Body() data: InviteDto,
    @Request() req,
  ): Promise<AssignRoleReturnType> {
    return this.appService.inviteUser({
      ...data,
      ...(req as TokenPayloadInterface),
    });
  }

  @UseGuards(AuthGuard)
  @Roles(
    Role.SuperAdmin,
    Role.Admin,
    Role.ParastatalsHeads,
    Role.DepartmentHeads,
  )
  @UseGuards(RolesGuard)
  @Delete('invite:id')
  deleteInvite(@Param() data: DeleteInviteDto) {
    return this.appService.deleteInvite(data);
  }

  @Get('verify-invite')
  verifyInvite(@Query() data: VerifyInviteDto): Promise<InviteUser> {
    return this.appService.verifyInvite(data);
  }

  @UseGuards(AuthSignupGuard)
  @Post('signup')
  signupUser(
    @Body() data: SignupDto,
    @Request() req,
  ): Promise<SignUpReturnType> {
    return this.appService.signupUser({
      ...data,
      invite_id: (req.user as InviteTokenPayloadType).invite_id,
    });
  }

  @Post('signin')
  signinUser(@Body() data: SigninDto): Promise<SignUpReturnType> {
    return this.appService.signinUser(data);
  }

  @Post('forgot-password')
  forgotPassword(
    @Body() email: ForgotPasswordDto,
  ): Promise<ForgotPasswordReturnType> {
    return this.appService.forgotPassword(email);
  }

  @UseGuards(ForgotPasswordGuard)
  @Get('verify-password-token')
  verifyPasswordToken(
    @Query() data: VerifyInviteDto,
    @Request() req,
  ): Promise<AssignRoleReturnType> {
    return this.appService.verifyPasswordToken({
      email: (req.user as Email).email,
    });
  }

  @Post('password-reset')
  passwordReset(@Body() data: ResetPasswordDto): Promise<AssignRoleReturnType> {
    return this.appService.passwordReset(data);
  }
}
