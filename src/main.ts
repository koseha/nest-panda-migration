import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // class-validator가 정상 동작하도록 전역 파이프 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 프로퍼티는 무조건 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 오면 에러 처리
      transform: true, // 컨트롤러에서 DTO 클래스로 변환
    }),
  );

  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
