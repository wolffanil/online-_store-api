import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return await this.productService.getAll(searchTerm);
  }

  @Get('by-storeId/:storeId')
  @Auth()
  async getByStoreId(@Param('storeId') storeId: string) {
    return await this.productService.getByStoreId(storeId);
  }

  @Get('/by-productId/:id')
  async getById(@Param('id') productId: string) {
    return await this.productService.getById(productId);
  }

  @Get('by-category/:categoryId')
  async getByCategoryId(@Param('categoryId') categoryId: string) {
    return await this.productService.getByCategory(categoryId);
  }

  @Get('most-popular')
  async getMostPopular() {
    return await this.productService.getMostPopular();
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return await this.productService.getSimilar(id);
  }

  @Post(':storeId')
  @Auth()
  async create(@Param('storeId') storeId: string, @Body() dto: ProductDto) {
    return await this.productService.create(storeId, dto);
  }

  @Put(':id')
  @Auth()
  async update(@Param('id') productId: string, @Body() dto: ProductDto) {
    return await this.productService.update(productId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Auth()
  async delete(@Param('id') productId: string) {
    return await this.productService.delete(productId);
  }
}
