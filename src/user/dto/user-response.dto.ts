import { User } from "../entity/user.entity";

export class UserResponseDto {
  /**
   * 유저별 uuid
   */
  id: string;

  /**
   * 유저별 email
   * @example test01@panda.com
   */
  email: string;

  /**
   * 유저별 닉네임
   * @example 오목판다
   */
  nickname: string;

  /**
   * 이미지 주소
   */
  image: string;

  accessToken?: string;
  refreshToken?: string;

  static of(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.nickname = user.nickname;
    dto.image = user.image;

    return dto;
  }
}
