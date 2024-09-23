import { Controller, Post, Body } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { CreatePermissionsDto } from "./dto/create-permission.dto";

@Controller("permission")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body() createPermissionsDto: CreatePermissionsDto) {
    return this.permissionService.create(createPermissionsDto);
  }
}
