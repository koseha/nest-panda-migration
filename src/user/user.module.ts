import { Module } from "@nestjs/common";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])], // UserService에서 사용하려면 필요함
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
