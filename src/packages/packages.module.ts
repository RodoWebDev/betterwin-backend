import {
  Module, MiddlewareConsumer, NestModule
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesController } from './packages.controller';
import { PackagesSchema } from './schemas/packages.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { PackagesService } from './packages.service';
import { CategoriesSchema } from 'categories/schemas/categories.schema';
import { CategoriesService } from 'categories/categories.service';
import { TagsService } from 'tags/tags.service';
import { TagsSchema } from 'tags/schemas/tags.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Packages', schema: PackagesSchema },
    { name: 'Categories', schema: CategoriesSchema },
    { name: 'Tags', schema: TagsSchema },
  ])],
  controllers: [PackagesController],
  providers: [PackagesService, CategoriesService, TagsService],
})
export class PackagesModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      .forRoutes(PackagesController);
   }
}
