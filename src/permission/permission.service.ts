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
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectQueue("permission-emails-sending")
    private permissionEmailQueue: Queue
  ) {}

  async create(createPermissionsDto: CreatePermissionsDto) {
    const { resourceId, permissions: permissionsDetails } =
      createPermissionsDto;

    const resources: Resource[] = await this.resourceRepository.query(
      `
      WITH RECURSIVE descendants AS (
        SELECT id, name, parentId
        FROM resource
        WHERE id = ?
  
        UNION ALL
  
        SELECT resource.id, resource.name, resource.parentId
        FROM resource
        JOIN descendants ON resource.parentId = descendants.id
      )
      SELECT id, name FROM descendants;
      `,
      [resourceId]
    );

    const permissions = resources.flatMap((resource: Resource) =>
      permissionsDetails.map((details) => ({
        userId: details.userId,
        resourceId: resource.id,
        type: details.type,
      }))
    );

    const placeholders = permissions.map(() => "(?, ?)").join(", ");
    const deleteParams = permissions.flatMap((p) => [p.userId, p.resourceId]);

    await this.permissionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.query(
          `
        DELETE FROM permissions
        WHERE (userId, resourceId) IN (${placeholders});
      `,
          deleteParams
        );

        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into("permissions")
          .values(permissions)
          .execute();
      }
    );

    return;

    const permissionsToMailJobs = this.mapToDto(createPermissionsDto).map(
      (permission) => ({
        name: "sendPermissionEmail",
        data: permission,
      })
    );

    this.permissionEmailQueue.addBulk(permissionsToMailJobs);
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
