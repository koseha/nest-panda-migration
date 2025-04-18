import { Controller, Get } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { User } from "../entity/user.entity";

@Controller("user")
export class UserController {
  constructor(private readonly userSerivce: UserService) {}

  @Get("/")
  async first(): Promise<User[]> {
    return this.userSerivce.findAll();
  }

  @Get("/text")
  getText() {
    return "text";
  }
}
