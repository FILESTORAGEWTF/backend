import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Injectable } from "@nestjs/common";
import { MailService } from "./mail.service";
import { PermissionDetailDto } from "../permission/dto/create-permission.dto";

@Processor("permission-emails-sending")
@Injectable()
export class MailProcessor extends WorkerHost {
  constructor(private readonly emailService: MailService) {
    super();
  }

  async process(job: Job<PermissionDetailDto>): Promise<any> {
    const { data } = job;
    return this.emailService.sendNotifyPermission(data);
  }
}
