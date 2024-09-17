import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByStoreId(storeId: string) {
    return await this.prismaService.category.findMany({
      where: {
        storeId,
      },
    });
  }

  async getById(categoryId: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) throw new NotFoundException('Категория не найден');

    return category;
  }

  async create(storeId: string, dto: CategoryDto) {
    const category = await this.prismaService.category.create({
      data: {
        storeId,
        title: dto.title,
        description: dto.description,
      },
    });

    return category;
  }

  async update(categoryId: string, dto: CategoryDto) {
    await this.getById(categoryId);

    const category = await this.prismaService.category.update({
      where: {
        id: categoryId,
      },
      data: {
        title: dto.title,
        description: dto.description,
      },
    });

    return category;
  }

  async delete(categoryId: string) {
    await this.getById(categoryId);

    return this.prismaService.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
