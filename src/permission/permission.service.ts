import { Resource } from "./../resource/entities/resource.entity";
import { Injectable } from "@nestjs/common";
import { CreatePermissionsDto, PermissionDto } from "./dto/permission.dto";
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

  async create(createPermissionsDto: CreatePermissionsDto) {
    const permissionsToSave = this.mapToDto(createPermissionsDto);

    await this.permissionRepository.save(permissionsToSave);
    const permissionsToMailJobs = permissionsToSave.map((permission) => ({
      name: "sendPermissionEmail",
      data: permission,
    }));

    this.permissionEmailQueue.addBulk(permissionsToMailJobs);

    return permissionsToSave;
  }

  private mapToDto(createPermissionsDto: CreatePermissionsDto) {
    const { permissions, resourceId } = createPermissionsDto;
    return permissions.map(({ userId, type, userEmail }) => {
      return new PermissionDto({
        userId,
        type,
        resourceId,
        userEmail,
      });
    });
  }

  findAllUserPermissions(userId: string) {
    return this.permissionRepository.find({
      where: {
        userId,
      },
    });
  }

  findClosestParentPermission(
    userPermissions: Permission[],
    resources: Resource[],
    resourceId: number
  ) {
    const currentResource = resources.find(
      (resource) => resource.id === resourceId
    );

    if (!currentResource || currentResource.parentId === null) {
      return null;
    }

    const parentPermission = userPermissions.find(
      (permission) => permission.resourceId === currentResource.parentId
    );

    return (
      parentPermission ||
      this.findClosestParentPermission(
        userPermissions,
        resources,
        currentResource.parentId
      )
    );
  }
}
