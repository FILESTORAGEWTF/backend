import { IsInt, IsString, IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PermissionType } from "../permission.namespace";
import { ApiProperty } from "@nestjs/swagger";

export class PermissionDetailDto {
  @ApiProperty({ description: "user Id", example: "12345" })
  @IsString()
  userId: string;

  @ApiProperty({ description: "user emil", example: "user@example.com" })
  @IsString()
  userEmail: string;

  @ApiProperty({ enum: PermissionType, example: PermissionType.READ })
  @IsEnum(PermissionType)
  type: PermissionType;
}

export class CreatePermissionsDto {
  @ApiProperty({
    type: [PermissionDetailDto],
    description: "Array of permissions",
  })
  @ValidateNested({ each: true })
  @Type(() => PermissionDetailDto)
  permissions: PermissionDetailDto[];

  @ApiProperty({ description: "Resource ID", example: 100 })
  @IsInt()
  @Type(() => Number)
  resourceId: number;
}

export class PermissionDto {
  @ApiProperty({ description: "user Id", example: "12345" })
  @IsString()
  userId: string;

  @ApiProperty({ description: "Resource ID", example: 100 })
  @IsInt()
  @Type(() => Number)
  resourceId: number;

  @ApiProperty({ enum: PermissionType, example: PermissionType.READ })
  @IsEnum(PermissionType)
  type: PermissionType;

  @ApiProperty({ description: "user emil", example: "user@example.com" })
  @IsString()
  userEmail: string;

  constructor(data: Readonly<PermissionDto>) {
    this.userId = data.userId;
    this.resourceId = data.resourceId;
    this.type = data.type;
    this.userEmail = data.userEmail;
  }
}
