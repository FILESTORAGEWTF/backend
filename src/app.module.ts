import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./db/data-source";
import { FirebaseModule } from "./firebase/firebase.module";

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), FirebaseModule, UserModule],
})
export class AppModule {}
