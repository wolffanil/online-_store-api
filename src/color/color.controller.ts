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
import { ColorService } from './color.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ColorDto } from './dto/color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get('by-storeId/:storeId')
  @Auth()
  async getByStoreId(@Param('storeId') storeId: string) {
    return await this.colorService.getByStoreId(storeId);
  }

  @Get(':id')
  @Auth()
  async getById(@Param('id') colorId: string) {
    return await this.colorService.getById(colorId);
  }

  @Post('/:storeId')
  @Auth()
  async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
    return await this.colorService.create(storeId, dto);
  }

  @Put(':id')
  @Auth()
  @HttpCode(200)
  async update(@Param('id') colorId: string, @Body() dto: ColorDto) {
    return await this.colorService.update(colorId, dto);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(204)
  async delete(@Param('id') colorId: string) {
    return await this.colorService.delete(colorId);
  }
}
