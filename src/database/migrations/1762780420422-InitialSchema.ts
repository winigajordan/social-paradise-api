import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762780420422 implements MigrationInterface {
    name = 'InitialSchema1762780420422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."payment_paymentplace_enum" RENAME TO "payment_paymentplace_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentplace_enum" AS ENUM('FRUIT_STORE', 'HEMISPHERE', 'GROOV', 'FITLAB')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paymentPlace" TYPE "public"."payment_paymentplace_enum" USING "paymentPlace"::"text"::"public"."payment_paymentplace_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentplace_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentplace_enum_old" AS ENUM('FRUIT_STORE', 'GROOV', 'FITLAB')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "paymentPlace" TYPE "public"."payment_paymentplace_enum_old" USING "paymentPlace"::"text"::"public"."payment_paymentplace_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentplace_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_paymentplace_enum_old" RENAME TO "payment_paymentplace_enum"`);
    }

}
