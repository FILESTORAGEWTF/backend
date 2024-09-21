import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ResourceType } from "../resource.namespace";

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @Column({ type: "integer", nullable: true })
  parentId: number;

  @Column({ type: "varchar", nullable: true })
  ownerId: string;

  @Column({ type: "varchar" })
  type: ResourceType;
}
