import { Module } from "@nestjs/common";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./servise/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entity/user.entity";
import { UserService } from "src/user/service/user.service";
import { AuthFacadeService } from "./application/auth-facade.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])], // UserService에서 사용하려면 필요함
  controllers: [AuthController],
  providers: [AuthService, UserService, AuthFacadeService],
})
export class AuthModule {}
