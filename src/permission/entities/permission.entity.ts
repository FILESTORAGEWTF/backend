import { Resource } from "../../resource/entities/resource.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PermissionType } from "../permission.namespace";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => Resource)
  @JoinColumn({ name: "resourceId" })
  resource: Resource;

  @Column()
  resourceId: number;

  @Column({ type: "varchar" })
  type: PermissionType;

  @CreateDateColumn()
  createdAt: Date;
}
