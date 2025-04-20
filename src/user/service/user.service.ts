import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { UserResponseDto } from "../dto/user-response.dto";
import { SignUpRequestDto } from "../dto/sign-up.request.dto";
import { UserExistsException } from "src/common/exceptions/user-exists.exception";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users: User[] = await this.userRepository.find();

    const userDtos = users.map((user) => UserResponseDto.of(user));

    return userDtos;
  }

  /**
   * 회원가입에 사용
   * @param userRequestDto
   * @returns
   */
  async create(
    userRequestDto: SignUpRequestDto,
    hashedPassword: string,
  ): Promise<UserResponseDto> {
    await this.existUser(userRequestDto.email, userRequestDto.nickname);

    const newUser = this.userRepository.create({
      ...userRequestDto,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    return UserResponseDto.of(newUser);
  }

  /**
   * email or nickname 중복 검즘에 사용
   * @param email
   * @param nickname
   * @exception UserExistsException
   */
  private async existUser(email: string, nickname: string): Promise<void> {
    const existingUser = await this.findUserByEmailOrNickname(email, nickname);

    if (existingUser) {
      if (existingUser.email === email) {
        throw new UserExistsException({ email: existingUser.email });
      } else {
        throw new UserExistsException({ nickname: existingUser.nickname });
      }
    }
  }

  // DTO 변환하지 않는 이유 >>> UserService는 DB 접근 책임만,
  // DTO 변환은 분리 처리해야 SRP 관점에서 좋음
  /**
   * email과 nickname 중복 유저 확인에 사용
   * @param email
   * @param nickname
   * @returns
   */
  async findUserByEmailOrNickname(
    email: string,
    nickname: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ email }, { nickname }],
    });
  }
}
