import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AssignedRoleMethodDataInterface } from '@interfaces/interfaces';
import { Schema } from 'mongoose';

@Injectable()
export class VerifyTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token, id } = this.extractTokenFromQuery(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: AssignedRoleMethodDataInterface =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('jwtSecret'),
        });
      if (id !== payload.sub) {
        throw new UnauthorizedException();
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromQuery(request: Request): {
    token: string;
    id: Schema.Types.ObjectId;
  } {
    const { token, id } = request.query as unknown as {
      token: string;
      id: Schema.Types.ObjectId;
    };
    return { token, id };
  }
}
