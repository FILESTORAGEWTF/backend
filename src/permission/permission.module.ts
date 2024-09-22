import { Module } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";
import { ResourceModule } from "src/resource/resource.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), ResourceModule, MailModule],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
