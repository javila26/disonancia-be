import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Vinyl } from 'src/vinyls/entities/vinyl.entity';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Vinyl])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
