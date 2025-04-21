import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  private readonly accessExp: string;
  private readonly refreshExp: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {
    this.accessExp = this.cfg.get<string>("JWT_EXP", "15m");
    this.refreshExp = this.cfg.get<string>("REFRESH_EXP", "7d");
  }

  signAccess(payload: { sub: string }) {
    return this.jwt.sign(payload, { expiresIn: this.accessExp });
  }

  signRefresh(payload: { sub: string }) {
    return this.jwt.sign(payload, { expiresIn: this.refreshExp });
  }

  // verify<T = any>(token: string): T {
  //   return this.jwt.verify<T>(token);
  // }

  // decode(token: string) {
  //   return this.jwt.decode(token);
  // }
}
