import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import {
  ForgotPasswordStatus,
  ForgotPasswordTokenType,
} from '@interfaces/interfaces';
import { ForgotPasswordModelService } from '@model/forgot-password/forgot-password.model.service';
import { MyLoggerService } from '@mylogger/mylogger.service';
import { JwtAuthService } from '@jwt-auth/jwt-auth.service';

@Injectable()
export class ForgotPasswordGuard implements CanActivate {
  constructor(
    private jwtService: JwtAuthService,
    private logger: MyLoggerService,
    private forgotPasswordService: ForgotPasswordModelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token } = this.extractTokenFromQuery(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: ForgotPasswordTokenType = await this.jwtService.verifyJwt(
        token,
      );
      if (payload.type === 'forgotpassword') {
        const forgotPassword = await this.forgotPasswordService.findOne({
          _id: payload.id,
        });
        if (forgotPassword.status === ForgotPasswordStatus.RequestChange) {
          request['user'] = { email: forgotPassword.email };
          return true;
        }
      }
      throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromQuery(request: Request): {
    token: string;
  } {
    const { token } = request.query as unknown as {
      token: string;
    };
    return { token };
  }
}
