import { JwtService } from '@nestjs/jwt';

export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async signJwt(payload: object): Promise<string> {
    const data = await this.jwtService.signAsync(payload);
    return data;
  }

  async verifyJwt<T extends object = any>(token: string): Promise<T> {
    return await this.jwtService.verifyAsync(token);
  }
}
