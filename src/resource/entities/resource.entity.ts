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

  @Column({ type: "varchar", nullable: true, default: null })
  storedFilename: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  deletedAt: Date | null;

  @Column({ type: "integer", nullable: true })
  parentId: number;

  @Column({ type: "varchar", nullable: true })
  ownerId: string;

  @Column({ type: "varchar" })
  type: ResourceType;

  @Column({ type: "boolean", default: false })
  shareable: boolean;
}
