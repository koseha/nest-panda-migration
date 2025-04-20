import { Controller, Get } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserResponseDto } from "../dto/user-response.dto";

@ApiTags("User")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  @ApiOperation({ summary: "유저 목록 조회" })
  async first(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }
}
