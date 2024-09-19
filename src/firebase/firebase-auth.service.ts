import { Injectable } from "@nestjs/common";
import { FirebaseAdminService } from "./firebase-admin.service";

@Injectable()
export class FirebaseAuthService {
  constructor(private firebaseAdminService: FirebaseAdminService) {}

  async verifyToken(token: string) {
    return this.firebaseAdminService.getAuth().verifyIdToken(token);
  }
}
