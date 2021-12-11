import {
  Module, MiddlewareConsumer, NestModule
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesSchema } from './schemas/categories.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { CategoriesService } from './categories.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Categories', schema: CategoriesSchema },
  ])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      .forRoutes(CategoriesController);
   }
}
