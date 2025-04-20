import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SignUpRequestDto } from "../../user/dto/sign-up.request.dto";
import { ApiResponse } from "src/common/dto/api-response.dto";
import { UserResponseDto } from "src/user/dto/user-response.dto";
import { AuthFacadeService } from "../application/auth-facade.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authFacadeService: AuthFacadeService) {}

  @Post("signUp")
  @ApiOperation({ summary: "회원가입" })
  async signUpUser(
    @Body() createUserDto: SignUpRequestDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    return this.authFacadeService.createUser(createUserDto);
  }
}
