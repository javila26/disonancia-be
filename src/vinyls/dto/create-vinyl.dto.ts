import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateVinylDto {
  @IsString()
  name: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  available: boolean;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1, allowNaN: false })
  price: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1, allowNaN: false })
  discount: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1, allowNaN: false })
  purchasePrice: number;

  @IsString()
  artist: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  numberOfDiscs: number;

  @IsInt()
  @Type(() => Number)
  stock: number;

  @IsInt()
  @Type(() => Number)
  year: number;

  @IsArray()
  @IsOptional()
  images?: { value: string; type: string }[];

  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];

  @IsString()
  @IsUUID()
  category: string;

  @IsString()
  slug: string;
}
