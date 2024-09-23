import { ResourceService } from "./../resource/resource.service";
import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { generateFilename } from "./utils/generateFileName";
import { RequestUserSession } from "src/lib/decorators/request-user-session.decorator";
import { CreateResourceDto } from "src/resource/dto/create-resource.dto";
import { unlink } from "fs";
import { ResourceType } from "src/resource/resource.namespace";
import { AuthGuard } from "src/lib/guards/auth/auth.guard";

@Controller("file")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private resourceService: ResourceService
  ) {}

  @Post("upload")
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./storage",
        filename: (req, file, callback) => {
          const filename = generateFilename(file);
          callback(null, filename);
        },
      }),
    })
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @RequestUserSession() session: any
  ) {
    const { parentId, shareable } = JSON.parse(body.meta);
    console.log(file.path);
    try {
      return await this.resourceService.create(
        new CreateResourceDto({
          parentId,
          ownerId: session.uid,
          name: file.originalname,
          storedFilename: file.filename,
          type: ResourceType.FILE,
          shareable,
        })
      );
    } catch (error) {
      console.error(error);
      setImmediate(() => {
        unlink(file.path, (err) => {
          if (err)
            console.error(`error by deleting the file ${file.path}:`, err);
        });
      });
    }
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.fileService.remove(+id);
  }
}
