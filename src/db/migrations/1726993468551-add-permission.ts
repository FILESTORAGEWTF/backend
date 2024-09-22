import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermission1726993468551 implements MigrationInterface {
    name = 'AddPermission1726993468551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "resourceId" integer NOT NULL, "type" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "resourceId" integer NOT NULL, "type" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_ae8dcf78abc81b7eff867875560" FOREIGN KEY ("resourceId") REFERENCES "resource" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_permissions"("id", "userId", "resourceId", "type", "createdAt") SELECT "id", "userId", "resourceId", "type", "createdAt" FROM "permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`ALTER TABLE "temporary_permissions" RENAME TO "permissions"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" RENAME TO "temporary_permissions"`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "resourceId" integer NOT NULL, "type" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "permissions"("id", "userId", "resourceId", "type", "createdAt") SELECT "id", "userId", "resourceId", "type", "createdAt" FROM "temporary_permissions"`);
        await queryRunner.query(`DROP TABLE "temporary_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
