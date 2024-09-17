import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByStoreId(storeId: string) {
    return await this.prismaService.review.findMany({
      where: {
        storeId,
      },
      relationLoadStrategy: 'join',
      include: {
        user: true,
      },
    });
  }

  async getById(reviewId: string, userId: string) {
    const review = await this.prismaService.review.findUnique({
      where: {
        id: reviewId,
        userId,
      },
      relationLoadStrategy: 'join',
      include: {
        user: true,
      },
    });

    if (!review) throw new NotFoundException('Отзыв не найден');

    return review;
  }

  async create(
    dto: ReviewDto,
    userId: string,
    productId: string,
    storeId: string,
  ) {
    return await this.prismaService.review.create({
      data: {
        text: dto.text,
        rating: dto.rating,
        user: {
          connect: {
            id: userId,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
        store: {
          connect: {
            id: storeId,
          },
        },
      },
    });
  }

  async delete(reviewId: string, userId: string) {
    await this.getById(reviewId, userId);

    return await this.prismaService.review.delete({
      where: {
        id: reviewId,
      },
    });
  }
}
