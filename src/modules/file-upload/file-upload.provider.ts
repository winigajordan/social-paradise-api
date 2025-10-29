import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constants';
import { CloudinaryConfig } from './file-upload.config';

export const FileUploadProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    cloudinary.config(CloudinaryConfig);
    return cloudinary;
  },
};
