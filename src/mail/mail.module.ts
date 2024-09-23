import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailProcessor } from "./email.queue.processor";
import { BullModule } from "@nestjs/bullmq";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "permission-emails-sending",
    }),
    UserModule,
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService, MailProcessor, BullModule],
})
export class MailModule {}
