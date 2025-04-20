import { Module } from "@nestjs/common";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User])], // UserService에서 사용하려면 필요함
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // ✅ 외부에서 쓰려면 반드시 exports 해줘야 함
})
export class UserModule {}
