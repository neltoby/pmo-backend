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

@Injectable()
export class AuthSignupGuard implements CanActivate {
  constructor(
    private jwtService: JwtAuthService,
    // private inviteuserService: InviteUserModelService,
    private userModelService: UserModelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: SigninTokenPayloadType = await this.jwtService.verifyJwt(
        token,
      );
      if (payload.type === 'signin') {
        const user = await this.userModelService.findOne({
          _id: payload.sub,
          token,
        });
        if (user) {
          console.log(user, 'line 37');
          request['user'] = { ...payload, role: user.role };
          return true;
        }
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
