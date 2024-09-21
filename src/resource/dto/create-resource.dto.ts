import { IsInt, IsString, IsOptional, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { ResourceType } from "../resource.namespace";

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number | null;

  @IsString()
  ownerId: string;

  @IsEnum(ResourceType)
  type: ResourceType;

  constructor(data: Readonly<CreateResourceDto>) {
    this.name = data.name;
    this.ownerId = data.ownerId;
    this.parentId = data.parentId || null;
    this.type = data.type;
  }
}
