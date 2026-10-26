import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventComingSoon1792600000000 implements MigrationInterface {
    name = 'AddEventComingSoon1792600000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "comingSoon" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "comingSoon"`);
    }
}
