import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from './constants';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';


@Injectable()
export class FileUploadService {


  constructor(@Inject(CLOUDINARY) private cloudinary: typeof Cloudinary) {}

  async uploadFile(file: Express.Multer.File, folder = ''): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Résultat Cloudinary vide'));
          resolve(result);
        },
      ).end(file.buffer);
    });
  }


  async delete(publicId: string): Promise<any> {
    return this.cloudinary.uploader.destroy(publicId);
  }

}
