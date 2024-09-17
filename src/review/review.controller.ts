import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ReviewDto } from './dto/review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('by-reviewId/:reviewId')
  @Auth()
  async getById(
    @Param('reviewId') reviewId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.reviewService.getById(reviewId, userId);
  }

  @Get('by-storeId/:storeId')
  @Auth()
  async getByStoreId(@Param('storeId') storeId: string) {
    return await this.reviewService.getByStoreId(storeId);
  }

  @Post(':productId/:storeId')
  @Auth()
  async create(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReviewDto,
  ) {
    return await this.reviewService.create(dto, userId, productId, storeId);
  }

  @Delete(':reviewId')
  @HttpCode(204)
  @Auth()
  async delete(
    @Param('reviewId') reviewId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.reviewService.delete(reviewId, userId);
  }
}
