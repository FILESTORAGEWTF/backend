import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // exposedHeaders: [BidOneHeader.AuthToken, BidOneHeader.Date],
    // origin: ["http://localhost:5173/"],
    origin: "*",
  });
  await app.listen(3000);
}
bootstrap();
