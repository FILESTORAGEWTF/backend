import { forwardRef, Module } from "@nestjs/common";
import { ResourceService } from "./resource.service";
import { ResourceController } from "./resource.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { PermissionModule } from "../permission/permission.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    forwardRef(() => PermissionModule),
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService, TypeOrmModule.forFeature([Resource])],
})
export class ResourceModule {}
