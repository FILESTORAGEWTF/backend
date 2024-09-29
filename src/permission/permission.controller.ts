import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { CreatePermissionsDto, PermissionDto } from "./dto/permission.dto";
import { ApiTags, ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/lib/guards/auth/auth.guard";

@ApiTags("Permission")
@Controller("permission")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiBody({ type: CreatePermissionsDto })
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    status: 201,
    description: "Successfully created permissions.",
    type: [PermissionDto],
  })
  create(@Body() createPermissionsDto: CreatePermissionsDto) {
    return this.permissionService.create(createPermissionsDto);
  }
}
