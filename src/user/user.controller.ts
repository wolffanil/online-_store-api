import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: string) {
    return await this.userService.getById(id);
  }

  @Patch('profile/favorites/:productId')
  @Auth()
  async toggleFavorites(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return await this.userService.toggleFavorites(productId, userId);
  }
}
