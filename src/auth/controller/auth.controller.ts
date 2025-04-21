import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SignUpRequestDto } from "../../user/dto/sign-up.request.dto";
import { ApiResponse } from "src/common/dto/api-response.dto";
import { UserResponseDto } from "src/user/dto/user-response.dto";
import { AuthFacadeService } from "../application/auth-facade.service";
import { Response } from "express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authFacadeService: AuthFacadeService) {}

  @Post("signUp")
  @ApiOperation({ summary: "회원가입" })
  async signUpUser(
    @Body() createUserDto: SignUpRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<UserResponseDto>> {
    const userResponseDto =
      await this.authFacadeService.createUser(createUserDto);

    this.setAuthCookies(
      res,
      userResponseDto.accessToken!,
      userResponseDto.refreshToken!,
    );

    return ApiResponse.success(
      userResponseDto,
      "회원가입을 성공적으로 완료하였습니다.",
    );
  }

  /**
   * 로그인 | 회원가입 시 token 쿠키 설정
   * @param res
   * @param accessToken
   * @param refreshToken
   */
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 15, // 15min
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
    });
  }
}
