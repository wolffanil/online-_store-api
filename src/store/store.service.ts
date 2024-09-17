import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(storeId: string, userId: string) {
    const store = await this.prismaService.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store)
      throw new NotFoundException('магазие не найден или вы не владелец ');

    return store;
  }

  async create(userId: string, dto: CreateStoreDto) {
    const store = await this.prismaService.store.create({
      data: {
        userId,
        title: dto.title,
      },
    });

    return store;
  }

  async update(storeId: string, userId: string, dto: UpdateStoreDto) {
    await this.getById(storeId, userId);

    const store = await this.prismaService.store.update({
      where: {
        id: storeId,
      },
      data: {
        title: dto.title,
        description: dto.description,
      },
    });

    return store;
  }

  async delete(storeId: string, userId: string) {
    await this.getById(storeId, userId);

    return this.prismaService.store.delete({
      where: {
        id: storeId,
      },
    });
  }
}
