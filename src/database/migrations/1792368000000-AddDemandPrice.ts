import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDemandPrice1792368000000 implements MigrationInterface {
    name = 'AddDemandPrice1792368000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "demand" ADD "priceId" integer`);
        await queryRunner.query(
            `ALTER TABLE "demand" ADD CONSTRAINT "FK_demand_price" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "demand" DROP CONSTRAINT "FK_demand_price"`);
        await queryRunner.query(`ALTER TABLE "demand" DROP COLUMN "priceId"`);
    }
}
