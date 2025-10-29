import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { FileUploadProvider } from './file-upload.provider';

@Module({
  providers: [FileUploadService, FileUploadProvider],
  controllers: [FileUploadController]
})
export class FileUploadModule {}
