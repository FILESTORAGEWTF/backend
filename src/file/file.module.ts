import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { ResourceModule } from "src/resource/resource.module";

@Module({
  imports: [ResourceModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
