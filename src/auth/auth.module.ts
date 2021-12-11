import {
  Module, MiddlewareConsumer, NestModule
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserSchema } from '../users/schemas/user.schema';
import { EmailVerificationSchema } from './schemas/emailverification.schema';
import { JWTService } from './jwt.service';
import { MailService } from './mail.service';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'User', schema: UserSchema },
    { name: 'EmailVerification', schema: EmailVerificationSchema },
  ]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JWTService, MailService, JwtStrategy],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
     consumer
      .apply(LoggerMiddleware)
      .forRoutes(AuthController);
   }
}
