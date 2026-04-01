import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { VinylImage } from 'src/vinyls/entities/vinyl-image.entity';
import { Vinyl } from 'src/vinyls/entities/vinyl.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Vinyl)
    private readonly vinylRepository: Repository<Vinyl>,
  ) {}

  async executeSeed() {
    type SeedVinylImage = Pick<VinylImage, 'url' | 'type'>;

    type SeedVinyl = {
      name: string;
      slug: string;
      artist: string;
      available: boolean;
      price: number;
      discount: number;
      purchasePrice: number;
      numberOfDiscs: number;
      stock: number;
      year: number;
      category: Category;
      images: SeedVinylImage[];
    };

    const categoriesToSeed: Array<Pick<Category, 'name' | 'slug' | 'image'>> = [
      {
        name: 'Rock',
        slug: 'rock',
        image: '',
      },
      {
        name: 'Pop',
        slug: 'pop',
        image: '',
      },
      {
        name: 'Jazz',
        slug: 'jazz',
        image: '',
      },
    ];

    const placeholderImage: SeedVinylImage = {
      url: 'https://img.freepik.com/premium-vector/vector-white-paper-label-lp-vinyl-record-blank-mock-up-realistic-illustration-with-shadow-template-design-isolated-transparent-background_111984-514.jpg?w=360',
      type: 'cover',
    };

    await this.categoryRepository.upsert(categoriesToSeed, ['slug']);

    const categories = await this.categoryRepository.find({
      where: categoriesToSeed.map(({ slug }) => ({ slug })),
      order: {
        name: 'ASC',
      },
    });

    const categoryMap = new Map(
      categories.map((category) => [category.slug, category]),
    );
    const vinylsToSeed: SeedVinyl[] = [
      {
        name: 'Dark Side of the Moon',
        slug: 'dark_side_of_the_moon',
        artist: 'Pink Floyd',
        available: true,
        price: 32.9,
        discount: 2.5,
        purchasePrice: 24.5,
        numberOfDiscs: 1,
        stock: 8,
        year: 1973,
        category: categoryMap.get('rock')!,
        images: [placeholderImage],
      },
      {
        name: 'Abbey Road',
        slug: 'abbey_road',
        artist: 'The Beatles',
        available: true,
        price: 29.9,
        discount: 1.5,
        purchasePrice: 21.0,
        numberOfDiscs: 1,
        stock: 10,
        year: 1969,
        category: categoryMap.get('rock')!,
        images: [placeholderImage],
      },
      {
        name: 'Back in Black',
        slug: 'back_in_black',
        artist: 'AC/DC',
        available: true,
        price: 27.5,
        discount: 1.0,
        purchasePrice: 19.8,
        numberOfDiscs: 1,
        stock: 7,
        year: 1980,
        category: categoryMap.get('rock')!,
        images: [placeholderImage],
      },
      {
        name: 'Nevermind',
        slug: 'nevermind',
        artist: 'Nirvana',
        available: true,
        price: 30.0,
        discount: 2.0,
        purchasePrice: 22.1,
        numberOfDiscs: 1,
        stock: 9,
        year: 1991,
        category: categoryMap.get('rock')!,
        images: [placeholderImage],
      },
      {
        name: 'Thriller',
        slug: 'thriller',
        artist: 'Michael Jackson',
        available: true,
        price: 31.5,
        discount: 3.0,
        purchasePrice: 23.4,
        numberOfDiscs: 1,
        stock: 11,
        year: 1982,
        category: categoryMap.get('pop')!,
        images: [placeholderImage],
      },
      {
        name: 'Future Nostalgia',
        slug: 'future_nostalgia',
        artist: 'Dua Lipa',
        available: true,
        price: 28.4,
        discount: 1.2,
        purchasePrice: 20.0,
        numberOfDiscs: 1,
        stock: 6,
        year: 2020,
        category: categoryMap.get('pop')!,
        images: [placeholderImage],
      },
      {
        name: '1989',
        slug: '1989',
        artist: 'Taylor Swift',
        available: true,
        price: 33.0,
        discount: 2.2,
        purchasePrice: 25.0,
        numberOfDiscs: 2,
        stock: 12,
        year: 2014,
        category: categoryMap.get('pop')!,
        images: [placeholderImage],
      },
      {
        name: 'Teenage Dream',
        slug: 'teenage_dream',
        artist: 'Katy Perry',
        available: true,
        price: 26.8,
        discount: 1.3,
        purchasePrice: 18.7,
        numberOfDiscs: 1,
        stock: 5,
        year: 2010,
        category: categoryMap.get('pop')!,
        images: [placeholderImage],
      },
      {
        name: 'Random Access Memories',
        slug: 'random_access_memories',
        artist: 'Daft Punk',
        available: true,
        price: 34.5,
        discount: 2.0,
        purchasePrice: 26.4,
        numberOfDiscs: 2,
        stock: 8,
        year: 2013,
        category: categoryMap.get('pop')!,
        images: [placeholderImage],
      },
      {
        name: 'Kind of Blue',
        slug: 'kind_of_blue',
        artist: 'Miles Davis',
        available: true,
        price: 35.0,
        discount: 2.5,
        purchasePrice: 27.2,
        numberOfDiscs: 1,
        stock: 7,
        year: 1959,
        category: categoryMap.get('jazz')!,
        images: [placeholderImage],
      },
      {
        name: 'Blue Train',
        slug: 'blue_train',
        artist: 'John Coltrane',
        available: true,
        price: 29.7,
        discount: 1.7,
        purchasePrice: 21.5,
        numberOfDiscs: 1,
        stock: 6,
        year: 1957,
        category: categoryMap.get('jazz')!,
        images: [placeholderImage],
      },
      {
        name: 'Time Out',
        slug: 'time_out',
        artist: 'The Dave Brubeck Quartet',
        available: true,
        price: 30.8,
        discount: 1.6,
        purchasePrice: 22.0,
        numberOfDiscs: 1,
        stock: 6,
        year: 1959,
        category: categoryMap.get('jazz')!,
        images: [placeholderImage],
      },
      {
        name: 'A Love Supreme',
        slug: 'a_love_supreme',
        artist: 'John Coltrane',
        available: true,
        price: 31.4,
        discount: 1.8,
        purchasePrice: 23.1,
        numberOfDiscs: 1,
        stock: 5,
        year: 1965,
        category: categoryMap.get('jazz')!,
        images: [placeholderImage],
      },
      {
        name: 'Ella and Louis',
        slug: 'ella_and_louis',
        artist: 'Ella Fitzgerald and Louis Armstrong',
        available: true,
        price: 28.9,
        discount: 1.4,
        purchasePrice: 20.6,
        numberOfDiscs: 1,
        stock: 4,
        year: 1956,
        category: categoryMap.get('jazz')!,
        images: [placeholderImage],
      },
      {
        name: 'Rumours',
        slug: 'rumours',
        artist: 'Fleetwood Mac',
        available: true,
        price: 30.2,
        discount: 1.9,
        purchasePrice: 22.8,
        numberOfDiscs: 1,
        stock: 9,
        year: 1977,
        category: categoryMap.get('rock')!,
        images: [placeholderImage],
      },
    ];

    const vinylsToUpsert = vinylsToSeed.map(({ images, ...vinyl }) => {
      void images;
      return {
        ...vinyl,
      };
    });

    await this.vinylRepository.upsert(vinylsToUpsert, ['slug']);

    const vinylsWithRelations = await this.vinylRepository.find({
      where: vinylsToSeed.map(({ slug }) => ({ slug })),
      relations: ['images'],
    });

    const vinylsNeedingPlaceholder = vinylsWithRelations
      .filter((vinyl) => !vinyl.images || vinyl.images.length === 0)
      .map((vinyl) => {
        const seedData = vinylsToSeed.find(({ slug }) => slug === vinyl.slug);

        return {
          ...vinyl,
          images: seedData?.images.map((image) => ({ ...image })) ?? [],
        };
      });

    if (vinylsNeedingPlaceholder.length > 0) {
      await this.vinylRepository.save(vinylsNeedingPlaceholder);
    }

    const vinyls = await this.vinylRepository.find({
      where: vinylsToSeed.map(({ slug }) => ({ slug })),
      relations: ['category', 'images'],
      order: {
        name: 'ASC',
      },
    });

    return {
      message: 'Seed executed successfully',
      categories,
      vinyls,
    };
  }
}
