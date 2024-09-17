import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('by-storeId/:storeId')
  @Auth()
  async getByStoreId(@Param('storeId') storeId: string) {
    return await this.categoryService.getByStoreId(storeId);
  }

  @Get('by-categoryId/:id')
  async getById(@Param('id') categoryId: string) {
    return await this.categoryService.getById(categoryId);
  }

  @Post('/:storeId')
  @Auth()
  async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
    return await this.categoryService.create(storeId, dto);
  }

  @Put(':id')
  @Auth()
  @HttpCode(200)
  async update(@Param('id') categoryId: string, @Body() dto: CategoryDto) {
    return await this.categoryService.update(categoryId, dto);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(204)
  async delete(@Param('id') categoryId: string) {
    return await this.categoryService.delete(categoryId);
  }
}
