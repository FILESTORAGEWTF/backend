import { IsInt, IsString, IsOptional, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { ResourceType } from "../resource.namespace";

export class CreateResourceBodyDto {
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number | null;

  @Type(() => Number)
  @IsInt()
  level: number;

  @IsEnum(ResourceType)
  type: ResourceType;
}
