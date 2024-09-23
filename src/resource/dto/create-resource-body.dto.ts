import { IsInt, IsString, IsOptional, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { ResourceType } from "../resource.namespace";

export class CreateResourceBodyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  storedFilename: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number | null;

  @IsEnum(ResourceType)
  type: ResourceType;

  @IsOptional()
  shareable: boolean;
}
