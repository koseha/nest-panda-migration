import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/config/database/database.module";
import { userProviders } from "./user.providers";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
  controllers: [UserController],
})
export class UserModule {}
