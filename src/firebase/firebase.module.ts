import { Module } from "@nestjs/common";
import { FirebaseAdminService } from "./firebase-admin.service";
import { FirebaseAuthService } from "./firebase-auth.service";
import { FirebaseUserRepository } from "./firebase-auth.repository";

@Module({
  providers: [
    FirebaseAdminService,
    FirebaseAuthService,
    FirebaseUserRepository,
  ],
  exports: [FirebaseAuthService, FirebaseUserRepository],
})
export class FirebaseModule {}
