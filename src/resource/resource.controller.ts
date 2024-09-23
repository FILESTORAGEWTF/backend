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
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { CreateResourceBodyDto } from "./dto/create-resource-body.dto";
import { AuthGuard } from "src/lib/guards/auth/auth.guard";
import { RequestUserSession } from "src/lib/decorators/request-user-session.decorator";

@Controller("resource")
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createResourceBodyDto: CreateResourceBodyDto,
    //TODO add session type
    @RequestUserSession() session: any
  ) {
    return this.resourceService.create({
      ...createResourceBodyDto,
      ownerId: session.uid,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@RequestUserSession() session: any) {
    return this.resourceService.findAllUserResources(session.uid);
  }

  @Get("/shared")
  @UseGuards(AuthGuard)
  findAllShared(@RequestUserSession() session: any) {
    console.log('tyt==================> ')
    return this.resourceService.findAllUserShearedResources(session.uid);
  }

  @Get("/shared/:parentId")
  @UseGuards(AuthGuard)
  findAllSharedByParentId(@Param("parentId") parentId: string) {
    console.log('tyt==================> ',parentId)
    return this.resourceService.findResourcesByParentId(+parentId);
  }

  @Patch(":id")
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
