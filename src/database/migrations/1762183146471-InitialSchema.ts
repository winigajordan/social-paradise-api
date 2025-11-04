import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762183146471 implements MigrationInterface {
    name = 'InitialSchema1762183146471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "demand" ADD "test" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "demand" DROP COLUMN "test"`);
    }

}
