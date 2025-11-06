// data-source.ts (à la racine du projet)
import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Chemins des entités et migrations en Typescript (dev) et JS (prod)
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  // Si tu veux utiliser la même DS pour exécuter en prod après build:
  // entities: ['dist/**/*.entity.js'],
  // migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
});
