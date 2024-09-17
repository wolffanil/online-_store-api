import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ColorModule } from './color/color.module';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { FileModule } from './file/file.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, ColorModule, StoreModule, OrderModule, FileModule, ProductModule, CategoryModule, StatisticsModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
