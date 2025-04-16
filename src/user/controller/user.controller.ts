import { Controller, Get } from "@nestjs/common";

@Controller("user")
export class UserController {
  @Get()
  first(): string {
    return "hello rest";
  }
}
