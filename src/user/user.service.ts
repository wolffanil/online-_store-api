import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hash } from 'argon2';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      relationLoadStrategy: 'join',
      include: {
        stores: true,
        favorites: {
          include: {
            category: true,
            images: true,
          },
        },
        orders: true,
      },
    });

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      relationLoadStrategy: 'join',
      include: {
        stores: true,
        favorites: true,
        orders: true,
      },
    });

    return user;
  }

  async toggleFavorites(productId: string, userId: string) {
    const user = await this.getById(userId);

    const isExist = user.favorites.some((product) => product.id === productId);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        favorites: {
          [isExist ? 'disconnect' : 'connect']: {
            id: productId,
          },
        },
      },
    });

    return true;
  }

  async create(dto: AuthDto) {
    return await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: await hash(dto.password),
      },
    });
  }
}
