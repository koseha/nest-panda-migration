import { Test, TestingModule } from "@nestjs/testing";
import { TokenService } from "./token.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

/**
 * 서비스 이름 : TokenService
 * 테스트 대상 메서드 : signAccess, signRefresh
 * 주요 의존성 : JwtService, ConfigService
 * ----------------------------------------
 * TC-01 : signAccess 정상 동작
 * TC-02 : signAccess 환경 설정 default
 * TC-03 : signRefresh 정상 동작
 * TC-04 : signAccess 환경 설정 default
 * TC-05 : ?
 */

describe("TokenService", () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("test-token"),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // 기본 환경 변수 설정
    mockConfigService.get.mockImplementation(
      (key: string, defaultValue): string => {
        const config = {
          JWT_EXP: "15m",
          REFRESH_EXP: "7d",
        };
        return config[key] || defaultValue;
      },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(tokenService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
  });

  /**
   * @function signAccess
   */
  describe("signAccess", () => {
    /**
     * @note 올바른 페이로드와 expiresIn 옵션으로 jwtService.sign을 호출해야 합니다.
     */
    it("올바른 페이로드와 expiresIn 옵션으로 jwtService.sign을 호출해야 합니다.", () => {
      // Given
      const payload = { sub: "user123" };

      // When
      tokenService.signAccess(payload);

      // Then
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: "15m",
      });
    });

    /**
     * @note 환경 변수가 설정된 경우 커스텀 만료 시간을 사용해야 합니다.
     */
    it("환경 변수가 설정된 경우 커스텀 만료 시간을 사용해야 합니다.", () => {
      // Given
      const payload = { sub: "user123" };
      const customExpiration = "30m";

      mockConfigService.get.mockImplementation((key: string) => {
        if (key === "JWT_EXP") return customExpiration;
        return "7d";
      });

      // When
      tokenService = new TokenService(
        mockJwtService as unknown as JwtService,
        configService,
      );
      tokenService.signAccess(payload);

      // Then
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: customExpiration,
      });
    });
  });

  /**
   * @function signRefresh
   */
  describe("signRefresh", () => {
    /**
     * @note 올바른 페이로드와 expiresIn 옵션으로 jwtService.sign을 호출해야 합니다.
     */
    it("올바른 페이로드와 expiresIn 옵션으로 jwtService.sign을 호출해야 합니다.", () => {
      // Given
      const payload = { sub: "user123" };

      // When
      tokenService.signRefresh(payload);

      // Then
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: "7d",
      });
    });

    /**
     * @note 환경 변수가 설정된 경우, 커스텀 만료 시간을 사용해야 합니다.
     */
    it("환경 변수가 설정된 경우, 커스텀 만료 시간을 사용해야 합니다.", () => {
      // Given
      const payload = { sub: "user123" };
      const customExpiration = "14d";

      mockConfigService.get.mockImplementation((key: string) => {
        if (key === "REFRESH_EXP") return customExpiration;
        return "15m";
      });

      // When
      tokenService = new TokenService(
        mockJwtService as unknown as JwtService,
        configService,
      );
      tokenService.signRefresh(payload);

      // Then
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: customExpiration,
      });
    });
  });

  /**
   *
   */
  describe("constructor", () => {
    /**
     * @note 환경 변수가 없을 때 기본 값을 설정해야 합니다.
     */
    it("환경 변수가 없을 때 기본 값을 설정해야 합니다.", () => {
      // Given
      mockConfigService.get.mockImplementation(
        (_, defaultValue: string) => defaultValue,
      );

      // When
      tokenService = new TokenService(jwtService, configService);
      tokenService.signAccess({ sub: "user123" });
      tokenService.signRefresh({ sub: "user123" });

      // Then
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        1,
        { sub: "user123" },
        { expiresIn: "15m" },
      );
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        { sub: "user123" },
        { expiresIn: "7d" },
      );
    });
  });

  /**
   * @function error handling - Added test cases for error handling
   */
  describe("error handling", () => {
    it("토큰 서명 중 발생하는 오류를 처리해야 합니다.", () => {
      // Given
      const payload = { sub: "user123" };
      mockJwtService.sign.mockImplementation(() => {
        throw new Error("Signing error");
      });

      // When & Then
      expect(() => tokenService.signAccess(payload)).toThrow("Signing error");
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: "15m",
      });
    });
  });
});
