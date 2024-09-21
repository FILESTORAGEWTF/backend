import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./db/data-source";
import { FirebaseModule } from "./firebase/firebase.module";
import { ResourceModule } from "./resource/resource.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { FileModule } from "./file/file.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "storage"),
      serveRoot: "/storage",
    }),
    FirebaseModule,
    UserModule,
    ResourceModule,
    FileModule,
  ],
})
export class AppModule {}
