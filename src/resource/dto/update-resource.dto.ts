import { IsBoolean, IsString } from "class-validator";

export class UpdateResourceDto {
  @IsString()
  name: string;

  @IsBoolean()
  shareable: boolean;
}
