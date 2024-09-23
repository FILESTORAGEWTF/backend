import { PermissionService } from "./../permission/permission.service";
import { Injectable } from "@nestjs/common";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { In, IsNull, Repository } from "typeorm";
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

  async findAllUserShearedResources(userId: string) {
    const userPermissions = await this.permissionService.findAllUserPermissions(
      userId
    );
    return await this.resourceRepository.find({
      where: {
        deletedAt: IsNull(),
        id: In(userPermissions.map((e) => e.resourceId)),
      },
    });
  }

  async findResourcesByParentId(parentId: number) {
    return await this.resourceRepository.find({
      where: {
        deletedAt: IsNull(),
        parentId,
      },
    });
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
