import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { handleDBExceptions } from 'src/common/helpers/handle-db-exceptions';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { isUUID } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { VinylImage } from './entities/vinyl-image.entity';

@Injectable()
export class VinylsService {
  constructor(
    @InjectRepository(Vinyl)
    private readonly vinylRepository: Repository<Vinyl>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private readonly logger = new Logger('VinylsService');

  async create(createVinylDto: CreateVinylDto) {
    const { category: categoryId, images = [], ...vinylData } = createVinylDto;

    try {
      const category = await this.findCategory(categoryId);
      const uploadedImages = await this.uploadImages(images);

      const vinyl = this.vinylRepository.create({
        ...vinylData,
        category,
        images: uploadedImages,
      });

      await this.vinylRepository.save(vinyl);
      return this.findOne(vinyl.id);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 0 } = paginationDto;

    const [vinyls, total] = await this.vinylRepository.findAndCount({
      take: limit,
      skip: page * limit,
      relations: ['images', 'category'],
      order: {
        name: 'ASC',
      },
    });

    return {
      data: vinyls,
      pagination: {
        limit,
        page,
        total,
      },
    };
  }

  async findOne(term: string) {
    const where = isUUID(term) ? { id: term } : { slug: term };
    const vinyl = await this.vinylRepository.findOne({
      where,
      relations: ['images', 'category'],
    });

    if (!vinyl) {
      throw new NotFoundException(`Vinyl with ${term} was not found`);
    }

    return vinyl;
  }

  async update(id: string, updateVinylDto: UpdateVinylDto) {
    const vinyl = await this.findOne(id);
    const { category: categoryId, images, ...vinylData } = updateVinylDto;

    try {
      if (categoryId) {
        vinyl.category = await this.findCategory(categoryId);
      }

      if (images?.length) {
        await this.deleteVinylImages(vinyl.images);
        const uploadedImages = await this.uploadImages(images);
        vinyl.images = this.mergeImages(vinyl.images, uploadedImages);
      }

      Object.assign(vinyl, vinylData);

      await this.vinylRepository.save(vinyl);

      return this.findOne(vinyl.id);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async remove(id: string) {
    const vinyl = await this.findOne(id);

    try {
      await this.deleteVinylImages(vinyl.images);
      await this.vinylRepository.remove(vinyl);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }

    return {
      data: vinyl,
    };
  }

  private async findCategory(id: string) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with ${id} was not found`);
    }

    return category;
  }

  private async uploadImages(images: { value: string; type: string }[]) {
    return Promise.all(
      images.map(async (img) => {
        const uploadResult = await this.cloudinaryService.uploadImage(
          img.value,
          {
            folder: 'vinyls',
          },
        );

        return {
          url: (uploadResult as { url: string }).url,
          type: img.type,
        } as VinylImage;
      }),
    );
  }

  private async deleteVinylImages(images: VinylImage[] = []) {
    await Promise.all(
      images.map(async (image) => {
        const publicId = this.extractPublicId(image.url);

        if (publicId) {
          await this.cloudinaryService.deleteImage(publicId);
        }
      }),
    );
  }

  private mergeImages(
    existing: VinylImage[],
    updates: VinylImage[],
  ): VinylImage[] {
    const map = new Map<string, VinylImage>();

    // Start with existing images
    existing.forEach((img) => {
      map.set(img.type, img);
    });

    // Override with new uploads
    updates.forEach((img) => {
      map.set(img.type, img);
    });

    return Array.from(map.values());
  }
  private extractPublicId(url?: string) {
    if (!url) return null;

    const marker = '/upload/';
    const uploadIndex = url.indexOf(marker);

    if (uploadIndex === -1) return null;

    const path = url
      .slice(uploadIndex + marker.length)
      .split('/')
      .slice(1);
    const fullPath = path.join('/');

    return fullPath.replace(/\.[^/.]+$/, '');
  }
}
