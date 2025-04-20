import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { AuthService } from "../servise/auth.service";
import { UserService } from "src/user/service/user.service";
import { SignUpRequestDto } from "src/user/dto/sign-up.request.dto";
import { ApiResponse } from "src/common/dto/api-response.dto";
import { UserResponseDto } from "src/user/dto/user-response.dto";

/**
 * 각 도메인의 Service를 사용하는 Facade Pattern
 * - 회원가입
 */
@Injectable()
export class AuthFacadeService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * 회원가입에 사용
   * @param userRequestDto
   * @returns
   */
  async createUser(
    userRequestDto: SignUpRequestDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    const dto: SignUpRequestDto = { ...userRequestDto };

    const hashedPassword = await this.getHashedPassword(dto.password);
    const userResponseDto = await this.userService.create(dto, hashedPassword);

    return ApiResponse.success(
      userResponseDto,
      "회원가입을 성공적으로 완료하였습니다.",
    );
  }

  /**
   * 비밀번호 해싱에 사용
   * @param origin
   * @returns
   */
  private async getHashedPassword(origin: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(origin, saltRounds);

    return hashedPassword;
  }
}
