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
    private readonly resourceRepository: Repository<Resource>
  ) {}
  async create(createResourceDto: CreateResourceDto) {
    const resource = this.resourceRepository.create(createResourceDto);
    return await this.resourceRepository.save(resource);
  }

  async findAll() {
    return await this.resourceRepository.find({
      where: {
        deletedAt: IsNull(),
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
    const allResources = await this.findAll();

    const resourcesToDelete = getDescendantResources(allResources, id);

    const updatedResources = resourcesToDelete.map((resource) => {
      resource.deletedAt = Date.now();
      return resource;
    });

    await this.resourceRepository.save(updatedResources);

    return `This action removes a #${id} resource`;
  }
}
