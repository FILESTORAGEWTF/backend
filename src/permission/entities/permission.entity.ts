import { Resource } from "../../resource/entities/resource.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { PermissionType } from "../permission.namespace";

@Entity("permissions")
@Unique(["userId", "resourceId"])
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
