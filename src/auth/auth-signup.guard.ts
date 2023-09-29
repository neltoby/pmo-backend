import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { SigninTokenPayloadType } from '@interfaces/interfaces';
import { UserModelService } from '@model/user/user.model.service';
import { JwtAuthService } from '@jwt-auth/jwt-auth.service';
import { MyLoggerService } from '@mylogger/mylogger.service';

@Injectable()
export class AuthSignupGuard implements CanActivate {
  constructor(
    private jwtService: JwtAuthService,
    private userModelService: UserModelService,
    private logger: MyLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    let payload: SigninTokenPayloadType;
    try {
      payload = await this.jwtService.verifyJwt(token);
    } catch (e) {
      const res = await this.userModelService.findOneAndUpdate(
        { token },
        { $pull: { token } },
      );
      console.log(res);
      this.logger.error(e.message);
      throw new UnauthorizedException();
    }
    let user;
    try {
      if (payload.type === 'signin') {
        user = await this.userModelService.findOne({
          _id: payload.sub,
          token,
        });
      } else throw new Error();
    } catch (e) {
      throw new UnauthorizedException();
    }
    if (user) {
      request['user'] = { ...payload, role: user.role };
      return true;
    }
    throw new UnauthorizedException();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
