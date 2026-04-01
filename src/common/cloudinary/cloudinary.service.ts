import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'vinyls',
      api_key: '721584611119229',
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async uploadImage(
    imagePath: string,
    options?: UploadApiOptions,
  ): Promise<object> {
    const defaultOptions: UploadApiOptions = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      ...options,
    };

    try {
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        imagePath,
        defaultOptions,
      );

      return result;
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      throw new InternalServerErrorException('Check logs');
    } finally {
      await fs.unlink(imagePath).catch(() => {});
    }
  }

  async deleteImage(imagePath: string, options?: UploadApiOptions) {
    const defaultOptions: UploadApiOptions = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      ...options,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result: UploadApiResponse = await cloudinary.uploader.destroy(
        imagePath,
        defaultOptions,
      );

      return { url: result.url, secureId: result.public_id };
    } catch (error: any) {
      console.error('Cloudinary delete error:', error);
      throw new InternalServerErrorException('Check logs');
    }
  }
}
