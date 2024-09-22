import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./db/data-source";
import { FirebaseModule } from "./firebase/firebase.module";
import { ResourceModule } from "./resource/resource.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { FileModule } from "./file/file.module";
import { MailModule } from "./mail/mail.module";
import { PermissionModule } from "./permission/permission.module";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "storage"),
      serveRoot: "/storage",
    }),
    BullModule.forRoot({
      connection: {
        host: "localhost",
        port: 6379,
      },
    }),
    FirebaseModule,
    UserModule,
    ResourceModule,
    FileModule,
    MailModule,
    PermissionModule,
  ],
})
export class AppModule {}
