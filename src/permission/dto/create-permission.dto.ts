import { IsInt, IsString, IsEnum, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PermissionType } from "../permission.namespace";

export class PermissionDetailDto {
  @IsString()
  userId: string;

  @IsString()
  userEmail: string;

  @IsEnum(PermissionType)
  type: PermissionType;
}

export class CreatePermissionsDto {
  @ValidateNested({ each: true })
  @Type(() => PermissionDetailDto)
  permissions: PermissionDetailDto[];

  @IsInt()
  @Type(() => Number)
  resourceId: number;
}

export class CreatePermissionDto {
  @IsString()
  userId: string;

  @IsInt()
  @Type(() => Number)
  resourceId: number;

  @IsEnum(PermissionType)
  type: PermissionType;

  constructor(data: Readonly<CreatePermissionDto>) {
    this.userId = data.userId;
    this.resourceId = data.resourceId;
    this.type = data.type;
  }
}
