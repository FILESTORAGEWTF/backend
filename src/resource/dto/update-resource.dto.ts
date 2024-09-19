import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { ResourceType } from "../resource.namespace";

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  parentId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  ownerId?: number;

  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;
}
