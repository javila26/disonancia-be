import { Module } from '@nestjs/common';
import { VinylsService } from './vinyls.service';
import { VinylsController } from './vinyls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { VinylImage } from './entities/vinyl-image.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  controllers: [VinylsController],
  providers: [VinylsService],
  imports: [TypeOrmModule.forFeature([Vinyl, VinylImage, Category])],
})
export class VinylsModule {}
