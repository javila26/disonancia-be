import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBExceptions } from 'src/common/helpers/handle-db-exceptions';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private readonly logger = new Logger('CategoriesService');

  async create(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    try {
      const imageUrl = await this.cloudinaryService.uploadImage(file.path, {
        folder: 'categories',
      });

      const newCategory = this.categoryRepository.create({
        ...createCategoryDto,
        image: (imageUrl as { url: string }).url,
      });

      await this.categoryRepository.save(newCategory);

      return newCategory;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, page = 0 } = paginationDto;

    const [categories, total] = await this.categoryRepository.findAndCount({
      take: limit,
      skip: page * limit,
    });

    return {
      data: categories,
      pagination: {
        limit,
        page,
        total,
      },
    };
  }

  async findOne(term: string) {
    return this.findCategory(term);
  }

  async update(
    term: string,
    updateCategoryDto: UpdateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const category = await this.findCategory(term);

    try {
      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file.path, {
          folder: 'categories',
        });

        const currentPublicId = this.extractPublicId(category.image);
        if (currentPublicId) {
          await this.cloudinaryService.deleteImage(currentPublicId);
        }

        category.image = (imageUrl as { url: string }).url;
      }

      Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async remove(term: string) {
    const category = await this.findCategory(term);

    const publicId = this.extractPublicId(category.image);
    if (publicId) {
      await this.cloudinaryService.deleteImage(publicId);
    }

    await this.categoryRepository.remove(category);

    return {
      id: term,
    };
  }

  private async findCategory(term: string) {
    const where = isUUID(term) ? { id: term } : { slug: term };
    const category = await this.categoryRepository.findOne({ where });

    if (!category) {
      throw new NotFoundException(`Category with ${term} was not found`);
    }

    return category;
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
