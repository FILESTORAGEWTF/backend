import { Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "./firebase-admin.service";

@Injectable()
export class FirebaseUserRepository {
  constructor(private firebaseAdminService: FirebaseAdminService) {}

  async getUserById(id: string) {
    const user = await this.firebaseAdminService.getAuth().getUser(id);
    return user;
  }

  async getAllUsers() {
    const users = await this.firebaseAdminService.getAuth().listUsers();
    return users;
  }
}
