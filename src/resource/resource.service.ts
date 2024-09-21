import { Injectable } from "@nestjs/common";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { Repository } from "typeorm";

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
    return await this.resourceRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} resource`;
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    return await this.resourceRepository.update(id, updateResourceDto);
  }

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }
}
