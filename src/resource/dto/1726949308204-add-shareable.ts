import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShareable1726949308204 implements MigrationInterface {
    name = 'AddShareable1726949308204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "parentId" integer, "ownerId" varchar, "type" varchar NOT NULL, "shareable" boolean NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_resource"("id", "name", "createdAt", "updatedAt", "parentId", "ownerId", "type") SELECT "id", "name", "createdAt", "updatedAt", "parentId", "ownerId", "type" FROM "resource"`);
        await queryRunner.query(`DROP TABLE "resource"`);
        await queryRunner.query(`ALTER TABLE "temporary_resource" RENAME TO "resource"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" RENAME TO "temporary_resource"`);
        await queryRunner.query(`CREATE TABLE "resource" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "parentId" integer, "ownerId" varchar, "type" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "resource"("id", "name", "createdAt", "updatedAt", "parentId", "ownerId", "type") SELECT "id", "name", "createdAt", "updatedAt", "parentId", "ownerId", "type" FROM "temporary_resource"`);
        await queryRunner.query(`DROP TABLE "temporary_resource"`);
    }

}
