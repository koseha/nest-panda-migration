import { Injectable } from "@nestjs/common";
import { AuthService } from "../servise/auth.service";
import { UserService } from "src/user/service/user.service";
import { SignUpRequestDto } from "src/user/dto/sign-up.request.dto";
import { UserResponseDto } from "src/user/dto/user-response.dto";
import { PasswordService } from "src/security/service/password.service";
import { TokenService } from "src/security/service/token.service";

/**
 * 각 도메인의 Service를 사용하는 Facade Pattern
 * - 회원가입
 */
@Injectable()
export class AuthFacadeService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokwnService: TokenService,
  ) {}

  /**
   * 회원가입에 사용
   * @param userRequestDto
   * @returns
   */
  async createUser(userRequestDto: SignUpRequestDto): Promise<UserResponseDto> {
    const dto: SignUpRequestDto = { ...userRequestDto };

    const hashedPassword = await this.passwordService.hash(dto.password);
    const userResponseDto = await this.userService.create(dto, hashedPassword);

    userResponseDto.accessToken = this.tokwnService.signAccess({
      sub: userResponseDto.id,
    });
    userResponseDto.refreshToken = this.tokwnService.signRefresh({
      sub: userResponseDto.id,
    });

    return userResponseDto;
  }
}
