import { Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "./firebase-admin.service";

@Injectable()
export class FirebaseUserRepository {
  constructor(private firebaseAdminService: FirebaseAdminService) {}

  async getUserById(id: string) {
    return await this.firebaseAdminService.getAuth().getUser(id);
  }

  async getAllUsersExceptMe(id: string) {
    const users = await this.firebaseAdminService.getAuth().listUsers();
    return users.users.filter((user) => user.uid !== id);
  }
}
