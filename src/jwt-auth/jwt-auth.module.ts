import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './jwt-auth.config';
import { JwtAuthService } from './jwt-auth.service';

@Module({
  imports: [JwtModule.registerAsync({ imports: [ConfigModule], ...jwtConfig })],
  providers: [JwtAuthService],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
