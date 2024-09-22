import { Injectable } from "@nestjs/common";
import {
  CreatePermissionDto,
  CreatePermissionsDto,
} from "./dto/create-permission.dto";
import { Permission } from "./entities/permission.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectQueue("permission-emails-sending")
    private permissionEmailQueue: Queue
  ) {}

  async create(createPermissionsDto: CreatePermissionsDto, from: string) {
    console.log(createPermissionsDto);
    const permissionsToSave = this.mapToDto(createPermissionsDto);

    const result = await this.permissionRepository.save(permissionsToSave);
    const permissionsToMailJobs = permissionsToSave.map((permission) => ({
      name: "sendPermissionEmail",
      data: { ...permission, from },
    }));

    const mailJobs = await this.permissionEmailQueue.add(
      "sendPermissionEmail",
      { ...permissionsToMailJobs[0] }
    );

    console.log("mailResult", mailJobs);

    return result;
  }

  private mapToDto(createPermissionsDto: CreatePermissionsDto) {
    const { permissions, resourceId } = createPermissionsDto;
    return permissions.map(({ userId, type }) => {
      return new CreatePermissionDto({
        userId,
        type,
        resourceId,
      });
    });
  }

  findAll() {
    return `This action returns all permission`;
  }
}
