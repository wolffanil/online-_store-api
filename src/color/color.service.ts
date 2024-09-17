import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColorDto } from './dto/color.dto';

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByStoreId(storeId: string) {
    return await this.prismaService.color.findMany({
      where: {
        storeId,
      },
    });
  }

  async getById(colorId: string) {
    const color = await this.prismaService.color.findUnique({
      where: {
        id: colorId,
      },
    });

    if (!color) throw new NotFoundException('Цвет не найден');

    return color;
  }

  async create(storeId: string, dto: ColorDto) {
    const store = await this.prismaService.color.create({
      data: {
        storeId,
        name: dto.name,
        value: dto.value,
      },
    });

    return store;
  }

  async update(colorId: string, dto: ColorDto) {
    await this.getById(colorId);

    const store = await this.prismaService.color.update({
      where: {
        id: colorId,
      },
      data: {
        name: dto.name,
        value: dto.value,
      },
    });

    return store;
  }

  async delete(colorId: string) {
    await this.getById(colorId);

    return this.prismaService.color.delete({
      where: {
        id: colorId,
      },
    });
  }
}
