import { ResourceService } from "./../resource/resource.service";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { FileService } from "./file.service";
import { UpdateFileDto } from "./dto/update-file.dto";
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
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @RequestUserSession() session: any
  ) {
    try {
      const savedFileData = this.resourceService.create(
        new CreateResourceDto({
          parentId: JSON.parse(body.parentId),
          ownerId: session.uid,
          name: file.filename,
          type: ResourceType.FILE,
        })
      );
      return savedFileData;
    } catch (error) {
      setImmediate(() => {
        unlink(file.path, (err) => {
          if (err)
            console.error(`error by deleting the file ${file.path}:`, err);
        });
      });
    }
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.fileService.remove(+id);
  }
}
