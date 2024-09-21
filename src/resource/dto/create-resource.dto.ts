import { IsInt, IsString, IsOptional, IsEnum, IsBoolean } from "class-validator";
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

  @IsBoolean()
  shareable: boolean;

  constructor(data: Readonly<CreateResourceDto>) {
    this.name = data.name;
    this.ownerId = data.ownerId;
    this.parentId = data.parentId || null;
    this.type = data.type;
    this.shareable = data.shareable;
  }
}
