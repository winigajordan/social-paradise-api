import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './config/db.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DemandModule } from './modules/demand/demand.module';
import { GuestModule } from './modules/guest/guest.module';
import { EventModule } from './modules/event/event.module';
import { PriceModule } from './modules/price/price.module';
import { PaymentModule } from './modules/payment/payment.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

@Module({
  imports: [
    AppConfigModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory : dbConfig
    }),
    UserModule,
    AuthModule,
    DemandModule,
    GuestModule,
    EventModule,
    PriceModule,
    PaymentModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
