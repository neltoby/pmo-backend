import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { InviteTokenPayloadType } from '@interfaces/interfaces';
import { InviteUserModelService } from '@model/invite-user/inviteuser.model.service';

@Injectable()
export class AuthSignupGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private inviteuserService: InviteUserModelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: InviteTokenPayloadType = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get('jwtSecret'),
        },
      );
      if (payload.type === 'invite') {
        const invite = await this.inviteuserService.findOne({
          _id: payload.invite_id,
        });
        if (invite) {
          request['user'] = payload;
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
