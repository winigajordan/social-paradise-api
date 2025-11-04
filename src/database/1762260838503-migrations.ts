import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1762260838503 implements MigrationInterface {
    name = 'Migrations1762260838503'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "guest" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "age" integer NOT NULL, "slug" uuid NOT NULL DEFAULT uuid_generate_v4(), "state" boolean NOT NULL DEFAULT false, "isMainGuest" boolean NOT NULL DEFAULT false, "demandId" integer, CONSTRAINT "PK_57689d19445de01737dbc458857" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentcanal_enum" AS ENUM('WAVE', 'ORANGE_MONEY', 'CASH')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentplace_enum" AS ENUM('FRUIT_STORE', 'GROOV', 'FITLAB')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "phoneNumber" character varying, "paymentCanal" "public"."payment_paymentcanal_enum", "paymentPlace" "public"."payment_paymentplace_enum", "demandId" integer, CONSTRAINT "REL_a79d84e92f836d81c93f388777" UNIQUE ("demandId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "demand_table_item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "demandId" integer NOT NULL, "tableId" integer NOT NULL, CONSTRAINT "PK_40d9cc9cac2e66b77bb0cc24b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."demand_status_enum" AS ENUM('SOUMISE', 'VALIDEE', 'REFUSEE', 'PAYEE', 'PAIEMENT_NOTIFIE')`);
        await queryRunner.query(`CREATE TYPE "public"."demand_type_enum" AS ENUM('UNIQUE', 'GROUP')`);
        await queryRunner.query(`CREATE TABLE "demand" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "slug" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."demand_status_enum" NOT NULL DEFAULT 'SOUMISE', "type" "public"."demand_type_enum" NOT NULL DEFAULT 'UNIQUE', "eventId" integer, CONSTRAINT "PK_2e27cd7b3d79c50d197cb0b3924" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "eventId" integer, CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "date" date NOT NULL, "slug" uuid NOT NULL DEFAULT uuid_generate_v4(), "location" character varying, "coverImage" character varying, "description" text, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "table" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "capacity" integer NOT NULL, "eventId" integer, CONSTRAINT "PK_28914b55c485fc2d7a101b1b2a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "guest" ADD CONSTRAINT "FK_84fff805700e6dff401a6b4b0c9" FOREIGN KEY ("demandId") REFERENCES "demand"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_a79d84e92f836d81c93f3887771" FOREIGN KEY ("demandId") REFERENCES "demand"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "demand_table_item" ADD CONSTRAINT "FK_e1682689ad5c0064fa225563b0b" FOREIGN KEY ("demandId") REFERENCES "demand"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "demand_table_item" ADD CONSTRAINT "FK_a28267a6fff1dcaec18158c841f" FOREIGN KEY ("tableId") REFERENCES "table"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "demand" ADD CONSTRAINT "FK_967f9d8e87cbb1339587b52bdb0" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price" ADD CONSTRAINT "FK_f334512aa4b7d1ceb299030ea94" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "table" ADD CONSTRAINT "FK_09c87b22f85b33d2e622334722f" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "table" DROP CONSTRAINT "FK_09c87b22f85b33d2e622334722f"`);
        await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT "FK_f334512aa4b7d1ceb299030ea94"`);
        await queryRunner.query(`ALTER TABLE "demand" DROP CONSTRAINT "FK_967f9d8e87cbb1339587b52bdb0"`);
        await queryRunner.query(`ALTER TABLE "demand_table_item" DROP CONSTRAINT "FK_a28267a6fff1dcaec18158c841f"`);
        await queryRunner.query(`ALTER TABLE "demand_table_item" DROP CONSTRAINT "FK_e1682689ad5c0064fa225563b0b"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_a79d84e92f836d81c93f3887771"`);
        await queryRunner.query(`ALTER TABLE "guest" DROP CONSTRAINT "FK_84fff805700e6dff401a6b4b0c9"`);
        await queryRunner.query(`DROP TABLE "table"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "price"`);
        await queryRunner.query(`DROP TABLE "demand"`);
        await queryRunner.query(`DROP TYPE "public"."demand_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."demand_status_enum"`);
        await queryRunner.query(`DROP TABLE "demand_table_item"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentplace_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentcanal_enum"`);
        await queryRunner.query(`DROP TABLE "guest"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
