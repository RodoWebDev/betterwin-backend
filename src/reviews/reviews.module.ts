import {
  Module, MiddlewareConsumer, NestModule
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './reviews.controller';
import { ReviewsSchema } from './schemas/reviews.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { ReviewsService } from './reviews.service';
import { PackagesSchema } from 'packages/schemas/packages.schema';
import { PackagesService } from 'packages/packages.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Reviews', schema: ReviewsSchema },
    { name: 'Packages', schema: PackagesSchema },
  ])],
  controllers: [ReviewsController],
  providers: [ReviewsService, PackagesService],
})
export class ReviewsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      .forRoutes(ReviewsController);
   }
}
