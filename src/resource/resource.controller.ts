import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ResourceService } from "./resource.service";
import {
  CreateResourceDto,
  ResourceDto,
  UpdateResourceDto,
} from "./dto/resource.dto";
import { AuthGuard } from "src/lib/guards/auth/auth.guard";
import { RequestUserSession } from "src/lib/decorators/request-user-session.decorator";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Resource")
@Controller("resource")
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: "Successfully created resource.",
    type: ResourceDto,
  })
  create(
    @Body() createResourceDto: CreateResourceDto,
    //TODO add session type
    @RequestUserSession() session: any
  ) {
    return this.resourceService.create({
      ...createResourceDto,
      ownerId: session.uid,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: [ResourceDto],
  })
  findAll(@RequestUserSession() session: any) {
    return this.resourceService.findAllUserResources(session.uid);
  }

  @Get("/shared")
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: [ResourceDto],
  })
  findAllShared(@RequestUserSession() session: any) {
    return this.resourceService.findUserTopShearedResources(session.uid);
  }

  @Get("/shared/:parentId")
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: [ResourceDto],
  })
  findAllSharedByParentId(
    @Param("parentId") parentId: string,
    @RequestUserSession() session: any
  ) {
    return this.resourceService.findResourcesByParentId(+parentId, session.uid);
  }

  @Patch(":id")
  @ApiOkResponse({
    description: "Successfully updated resource.",
    type: UpdateResourceDto,
  })
  update(
    @Param("id") id: string,
    @Body() updateResourceDto: UpdateResourceDto
  ) {
    return this.resourceService.update(+id, updateResourceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.resourceService.remove(+id);
  }
}
