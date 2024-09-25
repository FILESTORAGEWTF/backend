import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import dataSource from "./db/data-source";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await dataSource.initialize();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    // exposedHeaders: [BidOneHeader.AuthToken, BidOneHeader.Date],
    // origin: ["http://localhost:5173/"],
    exposedHeaders: ["Content-Disposition"],
    origin: "http://localhost:5173",
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
