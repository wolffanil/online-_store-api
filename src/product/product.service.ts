import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return await this.getSearchTermFilter(searchTerm);

    const products = await this.prismaService.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      relationLoadStrategy: 'join',
      include: {
        images: true,
        category: true,
      },
    });

    return products;
  }

  private async getSearchTermFilter(searchTerm: string) {
    return await this.prismaService.product.findMany({
      where: {
        OR: [
          {
            title: {
              startsWith: searchTerm,
            },
            description: {
              startsWith: searchTerm,
            },
          },
        ],
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async getByStoreId(storeId: string) {
    let products = await this.prismaService.product.findMany({
      where: {
        storeId,
      },
      relationLoadStrategy: 'join',
      include: {
        images: true,
        category: true,
        color: true,
      },
    });

    return products;
  }

  async getById(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
      relationLoadStrategy: 'join',
      include: {
        images: true,
        category: true,
        color: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Товар не найден');

    return product;
  }

  async getByCategory(categoryId: string) {
    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          id: categoryId,
        },
      },
      relationLoadStrategy: 'join',
      include: {
        category: true,
        images: true,
      },
    });

    if (!products) throw new NotFoundException('Товары не найдены');

    return products;
  }

  async getMostPopular() {
    const mostPopularProducts = await this.prismaService.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const productIds = mostPopularProducts.map((item) => item.productId);

    const products = await this.prismaService.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      relationLoadStrategy: 'join',
      include: {
        category: true,
        images: true,
      },
    });

    return products;
  }

  // private corectImagePath(products) {
  //   const correctProducts = products.map((product) =>
  //     product.images.map((image) => image.path),
  //   );

  //   return correctProducts;
  // }

  async getSimilar(productId: string) {
    const currentProduct = await this.getById(productId);

    if (!currentProduct) throw new NotFoundException('Текущий товар не найден');

    const products = await this.prismaService.product.findMany({
      where: {
        category: {
          title: currentProduct.category.title,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      relationLoadStrategy: 'join',
      include: {
        category: true,
        images: true,
      },
    });

    return products;
  }

  async create(storeId: string, dto: ProductDto) {
    const product = await this.prismaService.product.create({
      data: {
        storeId,
        title: dto.title,
        price: dto.price,
        categoryId: dto.categoryId,
        colorId: dto.colorId,
        description: dto.description,
        images: {
          createMany: {
            data: dto.images.map((image) => ({
              path: image,
            })),
          },
        },
      },
    });

    return product;
  }

  async update(productId: string, dto: ProductDto) {
    await this.getById(productId);

    const product = await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        ...dto,
        images: {
          connectOrCreate: dto.images.map((imagePath) => ({
            where: { path: imagePath },
            create: { path: imagePath },
          })),
        },
      },
    });

    return product;
  }

  async delete(productId: string) {
    await this.getById(productId);

    return this.prismaService.product.delete({
      where: {
        id: productId,
      },
    });
  }
}
