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
  Get,
  NotFoundException,
  Res,
} from "@nestjs/common";
import type { Response } from "express";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { generateFilename } from "./utils/generateFileName";
import { RequestUserSession } from "src/lib/decorators/request-user-session.decorator";
import { ResourceDto } from "src/resource/dto/resource.dto";
import { createReadStream, unlink } from "fs";
import { ResourceType } from "src/resource/resource.namespace";
import { AuthGuard } from "src/lib/guards/auth/auth.guard";
import { join } from "path";
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("File")
@Controller("file")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private resourceService: ResourceService
  ) {}

  @Post("upload")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Upload a file" })
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({
    description: "Successfully created resource.",
    type: ResourceDto,
  })
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
        new ResourceDto({
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

  @Get("download/:id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Download a file" })
  @ApiResponse({ status: 200, description: "File stream" })
  async downloadFile(@Param("id") id: string, @Res() res: Response) {
    const fileData = await this.resourceService.findOne(+id);
    if (!fileData) {
      throw new NotFoundException(`File ${id} not found`);
    }

    const fileStream = createReadStream(
      join("./storage", fileData.storedFilename)
    );

    res.set({
      "Access-Control-Expose-Headers": "Content-Disposition",
      "Content-Disposition": `attachment; filename="${fileData.name}"`,
      "Content-Type": "application/octet-stream",
    });
    fileStream.pipe(res);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a file" })
  @ApiOperation({ summary: "Delete a file" })
  @ApiParam({ name: "id", type: "string", description: "File ID" })
  @ApiResponse({ status: 200, description: "File deleted successfully" })
  @ApiResponse({ status: 404, description: "File not found" })
  @ApiParam({ name: "id", type: "string", description: "File ID" })
  remove(@Param("id") id: string) {
    return this.fileService.remove(+id);
  }
}
