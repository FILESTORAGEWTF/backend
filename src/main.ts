import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import dataSource from "./db/data-source";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await dataSource.initialize();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    exposedHeaders: ["Content-Disposition"],
    origin: process.env.CLIENT_URL,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
