import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { PackagesSchema } from 'packages/schemas/packages.schema';
import { PackagesModule } from 'packages/packages.module';
import { PackagesService } from 'packages/packages.service';
import { EmailVerificationSchema } from 'auth/schemas/emailverification.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'Packages', schema: PackagesSchema },
    { name: 'EmailVerification', schema: EmailVerificationSchema },
  ]),
  MulterModule.register({
    dest: './files',
  }),
  PackagesModule
  ],
  controllers: [UsersController],
  providers: [UsersService, PackagesService],
	exports: [UsersService],
})
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController);
   }
}
