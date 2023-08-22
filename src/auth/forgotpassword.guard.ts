import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import {
  ForgotPasswordStatus,
  ForgotPasswordTokenType,
} from '@interfaces/interfaces';
import { ForgotPasswordModelService } from '@model/forgot-password/forgot-password.model.service';
import { MyLoggerService } from '@mylogger/mylogger.service';

@Injectable()
export class ForgotPasswordGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
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
      const payload: ForgotPasswordTokenType =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('jwtSecret'),
        });
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
