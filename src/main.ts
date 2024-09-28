import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import dataSource from "./db/data-source";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await dataSource.initialize();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    exposedHeaders: ["Content-Disposition"],
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("VReal Soft test project")
    .setDescription("description API")
    .setVersion("1.0")
    .addTag("API")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
