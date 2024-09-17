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
import { StoreService } from './store.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':id')
  @Auth()
  async getById(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.storeService.getById(storeId, userId);
  }

  @Post()
  @Auth()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateStoreDto) {
    return await this.storeService.create(userId, dto);
  }

  @Put(':id')
  @Auth()
  @HttpCode(200)
  async update(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return await this.storeService.update(storeId, userId, dto);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(204)
  async delete(
    @Param('id') storeId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.storeService.delete(storeId, userId);
  }
}
