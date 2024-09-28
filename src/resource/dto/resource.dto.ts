import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";
import { ResourceType } from "../resource.namespace";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateResourceDto {
  @ApiProperty({ description: "Resource name" })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: "Stored filename", nullable: true })
  @IsOptional()
  @IsString()
  storedFilename?: string;

  @ApiPropertyOptional({
    description: "Parent resource ID",
    type: Number,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number | null;

  @ApiProperty({ enum: ResourceType, description: "Type of the resource" })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiPropertyOptional({
    description: "Defines whether the resource is shareable",
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  shareable?: boolean = false;
}

export class ResourceDto extends CreateResourceDto {
  @ApiProperty({ description: "Owner ID" })
  @IsString()
  ownerId: string;

  constructor(data: Readonly<ResourceDto>) {
    super();
    this.name = data.name;
    this.ownerId = data.ownerId;
    this.parentId = data.parentId || null;
    this.type = data.type;
    this.shareable = data.shareable;
    this.storedFilename = data.storedFilename || null;
  }
}

export class UpdateResourceDto {
  @ApiPropertyOptional({ description: "Updated name of the resource" })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Updated shareable status of the resource",
    type: Boolean,
  })
  @IsBoolean()
  shareable: boolean;
}
