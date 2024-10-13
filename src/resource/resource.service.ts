import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { IsNull, Repository } from "typeorm";
import {
  UpdateResourceDto,
  ResourceDtoWithPermissionType,
  CreateResourceDto,
  ResourceDto,
} from "./dto/resource.dto";

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}
  async create(createResourceDto: CreateResourceDto): Promise<ResourceDto> {
    const resource = this.resourceRepository.create(createResourceDto);
    const savedResource = await this.resourceRepository.save(resource);
    return new ResourceDto(savedResource);
  }

  async findAllUserResources(ownerId: string): Promise<ResourceDto[]> {
    const resources = await this.resourceRepository.find({
      where: {
        deletedAt: IsNull(),
        ownerId,
      },
    });
    return resources.map((resource) => new ResourceDto(resource));
  }

  async findAllUserShearedResources(
    userId: string
  ): Promise<ResourceDtoWithPermissionType[]> {
    const query = this.resourceRepository
      .createQueryBuilder("resource")
      .innerJoinAndSelect(
        "permissions",
        "permission",
        "permission.resourceId = resource.id AND permission.userId = :userId",
        { userId }
      )
      .where("resource.deletedAt IS NULL")
      .select(["resource.*", "permission.type AS permissionType"]);

    const updatedResources = await query.getRawMany();

    return updatedResources.map(
      (resource) =>
        new ResourceDtoWithPermissionType({
          ...resource,
          shareable: Boolean(resource.shareable),
        })
    );
  }

  async findOne(id: number): Promise<Resource> {
    return await this.resourceRepository.findOne({
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

    const resourceToDelete = allResources.find(
      (resource) => resource.id === id
    );

    if (!resourceToDelete) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    const resourcesToDelete = this.findDescendants(allResources, id);
    const updatedResources = [...resourcesToDelete, resourceToDelete].map(
      (resource) => {
        resource.deletedAt = Date.now();
        return resource;
      }
    );

    await this.resourceRepository.save(updatedResources);

    return `This action removes a #${id} resource`;
  }

  findDescendants(resources: Resource[], id: number) {
    const descendants = [];

    for (const resource of resources) {
      if (resource.parentId === id) {
        descendants.push(resource);
        descendants.push(...this.findDescendants(resources, resource.id));
      }
    }

    return descendants;
  }
}
