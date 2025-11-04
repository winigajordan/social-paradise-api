// src/config/db.config.ts
import * as process from 'node:process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // ✅ désactivé
  autoLoadEntities: true,
  // migrations: [__dirname + '/../database/migrations/*{.ts,.js}'], // utile si tu veux les lancer via Nest
  // migrationsRun: process.env.NODE_ENV === 'production', // optionnel
});
