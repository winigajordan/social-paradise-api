import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriceSoldOut1792500000000 implements MigrationInterface {
    name = 'AddPriceSoldOut1792500000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price" ADD "soldOut" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "soldOut"`);
    }
}
