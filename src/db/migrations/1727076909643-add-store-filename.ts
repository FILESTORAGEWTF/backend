import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreFilename1727076909643 implements MigrationInterface {
    name = 'AddStoreFilename1727076909643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "parentId" integer, "ownerId" varchar, "type" varchar NOT NULL, "shareable" boolean NOT NULL DEFAULT (0), "storedFilename" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_resource"("id", "name", "createdAt", "updatedAt", "parentId", "ownerId", "type", "shareable") SELECT "id", "name", "createdAt", "updatedAt", "parentId", "ownerId", "type", "shareable" FROM "resource"`);
        await queryRunner.query(`DROP TABLE "resource"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource" RENAME TO "resource"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" RENAME TO "temporary_resource"`);
        await queryRunner.query(`CREATE TABLE "resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "parentId" integer, "ownerId" varchar, "type" varchar NOT NULL, "shareable" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "resource"("id", "name", "createdAt", "updatedAt", "parentId", "ownerId", "type", "shareable") SELECT "id", "name", "createdAt", "updatedAt", "parentId", "ownerId", "type", "shareable" FROM "temporary_resource"`);
        await queryRunner.query(`DROP TABLE "temporary_resource"`);
    }

}
