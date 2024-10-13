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
import { PermissionType } from "src/permission/permission.namespace";

export class CreateResourceBodyDto {
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

export class CreateResourceDto extends CreateResourceBodyDto {
  @ApiProperty({ description: "Owner ID" })
  @IsString()
  ownerId: string;
}

export class ResourceDto extends CreateResourceDto {
  @ApiProperty({ description: "id" })
  @Type(() => Number)
  @IsInt()
  id: number;

  constructor(data: Readonly<ResourceDto>) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.ownerId = data.ownerId;
    this.parentId = data.parentId || null;
    this.type = data.type;
    this.shareable = data.shareable;
    this.storedFilename = data.storedFilename || null;
  }
}

export class ResourceDtoWithPermissionType extends ResourceDto {
  @ApiProperty({ enum: PermissionType, description: "Type of the permission" })
  @IsEnum(PermissionType)
  permissionType: PermissionType;

  constructor(data: Readonly<ResourceDtoWithPermissionType>) {
    super(data);
    this.permissionType = data.permissionType;
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
