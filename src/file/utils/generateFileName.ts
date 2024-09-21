import { extname } from "path";

export const generateFilename = (file: Express.Multer.File): string => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = extname(file.originalname);
  return `${file.originalname.split(ext)[0]}-${uniqueSuffix}${ext}`;
};
