import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailProcessor } from "./email.queue.processor";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "permission-emails-sending",
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService, MailProcessor, BullModule],
})
export class MailModule {}
