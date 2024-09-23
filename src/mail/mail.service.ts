import { Injectable } from "@nestjs/common";
import * as sendgrid from "@sendgrid/mail";
import { PermissionDetailDto } from "src/permission/dto/create-permission.dto";
import { UserService } from "src/user/user.service";
import { getEmailHtmlTemplate } from "./lib/getEmailHtmlTemplate";

@Injectable()
export class MailService {
  constructor(private userService: UserService) {
    sendgrid.setApiKey(process.env.SEND_GRID_API_KEY);
  }

  async sendNotifyPermission(data: PermissionDetailDto) {
    const { userEmail, userId } = data;
    try {
      const receiver = await this.userService.findUserById(userId);
      sendgrid.send({
        to: userEmail,
        from: process.env.SENDER_EMAIL,
        subject: "file permission notification",
        text: "hallo, how have you been?)",
        html: getEmailHtmlTemplate(receiver?.displayName || userEmail),
      });
    } catch (error) {
      console.error(error);
    }
  }
}
