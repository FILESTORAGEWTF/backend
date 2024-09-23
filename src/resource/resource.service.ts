import { PermissionService } from "./../permission/permission.service";
import { Injectable } from "@nestjs/common";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { IsNull, Repository } from "typeorm";
import { getDescendantResources } from "./lib/getDescendantsResources";

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private permissionService: PermissionService
  ) {}
  async create(createResourceDto: CreateResourceDto) {
    const resource = this.resourceRepository.create(createResourceDto);
    return await this.resourceRepository.save(resource);
  }

  async findAllUserResources(ownerId: string) {
    return await this.resourceRepository.find({
      where: {
        deletedAt: IsNull(),
        ownerId,
      },
    });
  }

  async findUserTopShearedResources(userId: string) {
    const query = this.resourceRepository
      .createQueryBuilder("resource")
      .leftJoinAndSelect(
        "permissions",
        "permission",
        "permission.resourceId = resource.id AND permission.userId = :userId",
        { userId }
      )
      .where("resource.deletedAt IS NULL")
      .andWhere("permission.userId = :userId", { userId })
      .select([
        "resource.id",
        "resource.name",
        "resource.storedFilename",
        "resource.createdAt",
        "resource.updatedAt",
        "resource.deletedAt",
        "resource.parentId",
        "resource.ownerId",
        "resource.type",
        "resource.shareable",
        "permission.type AS permissionType",
      ]);

    const result = await query.getRawMany();

    return result;
  }

  async findResourcesByParentId(parentId: number, userId: string) {
    const userPermissions = await this.permissionService.findAllUserPermissions(
      userId
    );

    const allResources = await this.resourceRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });

    const currentPermission =
      userPermissions.find((perm) => perm.resourceId === parentId) ||
      this.permissionService.findClosestParentPermission(
        userPermissions,
        allResources,
        parentId
      );

    return allResources.reduce((acc, resource) => {
      if (resource.parentId === parentId) {
        acc.push({ ...resource, permissionType: currentPermission.type });
      }
      return acc;
    }, []);
  }

  findOne(id: number) {
    return this.resourceRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    return await this.resourceRepository.update(id, updateResourceDto);
  }

  async remove(id: number) {
    const allResources = await this.resourceRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });

    const resourcesToDelete = getDescendantResources(allResources, id);

    const updatedResources = resourcesToDelete.map((resource) => {
      resource.deletedAt = Date.now();
      return resource;
    });

    await this.resourceRepository.save(updatedResources);

    return `This action removes a #${id} resource`;
  }
}
