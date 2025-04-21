import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PasswordService {
  private readonly saltRounds: number;

  constructor(config: ConfigService) {
    this.saltRounds = +config.get<number>("SALT_ROUNDS", 10);
  }
  /**
   * 비밀번호 해싱에 사용
   * @param origin
   * @returns
   */
  async hash(origin: string): Promise<string> {
    return await bcrypt.hash(origin, this.saltRounds);
  }
}
