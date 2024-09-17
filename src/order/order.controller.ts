import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { OrderDto } from './dto/order.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { PaymentStatusDto } from './dto/payment-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place')
  @HttpCode(200)
  @Auth()
  async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return await this.orderService.createPayment(dto, userId);
  }

  @Post('status')
  @HttpCode(200)
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return await this.orderService.updateStatus(dto);
  }
}
