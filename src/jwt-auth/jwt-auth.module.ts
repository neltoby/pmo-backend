import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from './jwt-auth.config';
import { JwtAuthService } from './jwt-auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({ imports: [ConfigModule], ...jwtConfig }),
  ],
  providers: [JwtAuthService, JwtService],
  exports: [JwtModule, PassportModule, JwtAuthService],
})
export class JwtAuthModule {}
