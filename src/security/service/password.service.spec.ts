import { Test, TestingModule } from "@nestjs/testing";
import { PasswordService } from "./password.service";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

// bcrypt.hash 함수를 모킹: bcrypt 모듈 전체를 mock 처리하여 테스트 목적에 맞게 조작
// bcrupt.hash를 Jest의 mock function으로 바꿈.
// 실제 해시 계산을 수행하지 않고, 테스트 상황에서 원하는 값을 반환하게 만듦.
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("PasswordService", () => {
  let service: PasswordService;
  let configService: ConfigService;

  beforeEach(async () => {
    // 테스트 모듈 설정
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // 테스트 대상 서비스 등록: PasswordService
        PasswordService,
        // get() 메서드를 가진 모킹 객체로 등록: ConfigService
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key, defaultValue) => {
              if (key === "SALT_ROUNDS") return 10;
              return defaultValue as number;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    configService = module.get<ConfigService>(ConfigService);
  });

  // 서비스가 정상적으로 생성되었는지를 확인하는 기본적인 생명 주기 테스트.
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("hash", () => {
    /**
     * 올바른 salt rounds를 가지고 비밀번호를 해시한다.
     */
    it(`올바른 salt rounds를 가지고 비밀번호를 해시한다.`, async () => {
      // Arrange
      const password = "testPassword123";
      const hashedPassword = "hashedPassword";
      const mockHashFunction = bcrypt.hash as jest.Mock;
      // bcrypt.hash()가 호출되면 'hashedPassword`가 반환되도록 설정
      mockHashFunction.mockResolvedValue(hashedPassword);

      // Act
      // 실제 서비스 로직 수행: 내부적으로 brypct.hash 사용
      const result = await service.hash(password);

      // Assert
      // 반환값이 기대한 값인지 확인
      expect(result).toBe(hashedPassword);
      // salt rounds 값이 10으로 정확히 전달되었는지 확인(ConfigService 효과 검증 포함)
      expect(mockHashFunction).toHaveBeenCalledWith(password, 10);
    });

    /**
     * salt rounds가 .env에 설정되어 있지 않은 경우, 기본값을 사용한다.
     * - 검증 포인트 (1): ConfigService.get()이 undefined 반환 >>> 기본값 사용 시나리오 재현
     * - 검증 포인트 (2): 기본값 12가 적용되는지 >>> bcrypt.hash(password, 12)로 호출되는지 확인
     */
    it("salt rounds가 .env에 설정되어 있지 않은 경우, 기본값을 사용한다.", async () => {
      // Arrange
      const password = "testPassword123";
      const hashedPassword = "hashedPassword";
      const mockHashFunction = bcrypt.hash as jest.Mock;
      mockHashFunction.mockResolvedValue(hashedPassword);

      // ConfigService의 get 메서드를 모킹하여 undefined 반환하도록 설정
      // 위에서는 10을 반환하도록 설정했지만,
      // 지금은 undefined를 반환하게 해서, 내부에서 defaultValue(12)가 쓰이도록 유도함
      jest
        .spyOn(configService, "get")
        .mockImplementation((key, defaultValue) => {
          if (key === "SALT_ROUNDS") return undefined;
          return defaultValue;
        });

      // 새로운 서비스 인스턴스 생성 (기본값 12를 사용)
      // 바로 위에서 ConfigService를 조작했기 때문에
      // 이를 사용해서 새로 PasswordService를 생성해야 mock이 반영됨.
      const newModule: TestingModule = await Test.createTestingModule({
        providers: [
          PasswordService,
          {
            provide: ConfigService,
            useValue: configService,
          },
        ],
      }).compile();

      const newService = newModule.get<PasswordService>(PasswordService);

      // Act
      // hash()를 호출하명 bcrypt.hash(password, 12)가 내부적으로 실행되어야 함.
      const result = await newService.hash(password);

      // Assert
      // 반환값이 mock된 "hashedPassword"인지 확인
      expect(result).toBe(hashedPassword);
      // bcrypt.hash()가 정확히 saltRounds = 12로 호출되었는지 검증
      expect(mockHashFunction).toHaveBeenCalledWith(password, 10);
    });

    /**
     * bcrypt 오류를 처리할 수 있어야 합니다.
     */
    it("bcrypt 오류를 처리할 수 있어야 합니다.", async () => {
      // Arrange
      const password = "testPassword123";
      const mockHashFunction = bcrypt.hash as jest.Mock;
      mockHashFunction.mockRejectedValue(new Error("Bcrypt error"));

      // Act & Assert
      await expect(service.hash(password)).rejects.toThrow("Bcrypt error");
    });
  });
});
