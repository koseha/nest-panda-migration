import { IsEmail, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpRequestDto {
  /**
   * 이메일 작성
   * @example example@panda.com
   */
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "비밀번호",
    example: "a1!strongpw",
    minLength: 9,
    pattern: "^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{9,}$",
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{9,}$/, {
    message:
      "비밀번호는 9자 이상이며 숫자와 특수문자를 각각 1개 이상 포함해야 합니다.",
  })
  password: string;

  /**
   * @example nickname
   */
  @IsString()
  nickname: string;
}
