import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { VinylsService } from './vinyls.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('vinyls')
export class VinylsController {
  constructor(private readonly vinylsService: VinylsService) {}

  // @Auth()
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      dest: './uploads',
    }),
  )
  create(
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() createVinylDto: CreateVinylDto,
  ) {
    return this.vinylsService.create({ ...createVinylDto, files });
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.vinylsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.vinylsService.findOne(term);
  }

  // @Auth()
  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      dest: './uploads',
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() updateVinylDto: UpdateVinylDto,
  ) {
    return this.vinylsService.update(id, { ...updateVinylDto, files });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vinylsService.remove(id);
  }
}
