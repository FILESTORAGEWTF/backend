import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./db/data-source";
import { FirebaseModule } from "./firebase/firebase.module";
import { ResourceModule } from "./resource/resource.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    FirebaseModule,
    UserModule,
    ResourceModule,
  ],
})
export class AppModule {}
