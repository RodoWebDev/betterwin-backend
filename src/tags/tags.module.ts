import {
  Module, MiddlewareConsumer, NestModule
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsController } from './tags.controller';
import { TagsSchema } from './schemas/tags.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { TagsService } from './tags.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Tags', schema: TagsSchema },
  ])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      .forRoutes(TagsController);
   }
}
