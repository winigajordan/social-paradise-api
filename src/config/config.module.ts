import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import dbConfig from './db.config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, jwtConfig],
    }),
  ],
})
export class AppConfigModule {}
