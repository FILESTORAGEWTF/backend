import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { createReadStream, existsSync, unlink } from "fs";
import { join } from "path";

@Injectable()
export class FileService {
  downloadFile(filename: string) {
    const filePath = join(__dirname, "..", "storage", filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found`);
    }

    return createReadStream(filePath);
  }

  async deleteFile(filename: string): Promise<void> {
    const filePath = join(__dirname, "..", "storage", filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File ${filename} not found`);
    }

    try {
      unlink(filePath, (err) => {
        if (err) console.error(`error by deleting the file ${filePath}:`, err);
      });
      console.log(`File ${filename} deleted`);
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not delete file: ${error.message}`
      );
    }
  }
  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
