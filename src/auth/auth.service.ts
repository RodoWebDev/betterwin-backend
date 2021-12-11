import * as bcrypt from 'bcryptjs';
import { default as config } from '../config';
import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from './mail.service';
import { EmailVerification } from './interfaces/emailverification.interface'
import { JWTService } from './jwt.service';
import { User } from '../users/interfaces/user.interface';
import { LoginDto } from '../users/dto/user.dto';
import * as Mustache from 'mustache';
import * as fs from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('EmailVerification')
    private readonly emailVerificationModel: Model<EmailVerification>,
    private readonly jwtService: JWTService,
    private readonly mailService: MailService,
  ) {}

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerif = await this.emailVerificationModel.findOne({
      emailToken: token,
    });
    if (emailVerif && emailVerif.email) {
      const userFromDb = await this.userModel.findOne({
        email: emailVerif.email,
      });
      if (userFromDb) {
        userFromDb.auth.email.valid = true;
        const savedUser = await userFromDb.save();
        await emailVerif.remove();
        return !!savedUser;
      }
    } else {
      throw new HttpException(
        'LOGIN.EMAIL_CODE_NOT_VALID',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // async createEmailToken(email: string): Promise<boolean> {
  //   const emailVerification = await this.emailVerificationModel.findOne({
  //     email,
  //   });
  //   if (
  //     emailVerification &&
  //     (new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 <
  //       15
  //   ) {
  //     throw new HttpException(
  //       'LOGIN.EMAIL_SENDED_RECENTLY',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } else {
  //     const emailVerificationModel = await this.emailVerificationModel.findOneAndUpdate(
  //       { email },
  //       {
  //         email,
  //         emailToken: (Math.floor(Math.random() * 9000000) + 1000000).toString(), // Generate 7 digits number
  //         timestamp: new Date(),
  //       },
  //       { upsert: true },
  //     );
  //     return true;
  //   }
  // }

  async sendEmailVerification(email: string): Promise<boolean> {

    let emailHtml = (fs.readFileSync('./templates/confirm-email-template.html', 'utf8') || '{}');
    console.log('email =>', email)
    const model = await this.emailVerificationModel.findOne({ email });
    console.log('model =>', model)

    if (model && model.emailToken) {
      const {
        host: { url, port },
      } = config;

      const mail = {
        to: email,
        subject: 'Verify Email',
        text: 'Verify Email',
        html: Mustache.render(emailHtml, {
          url,
          email,
          code: model.emailToken
        }), 
      };
      return await this.mailService.send(mail);
    } else {
      throw new HttpException(
        'REGISTER.USER_NOT_REGISTERED',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async validateLogin(email, password) {
    const userFromDb = await this.userModel.findOne({ email });

    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    const isValidPass = await bcrypt.compare(password, userFromDb.password);

    if (isValidPass) {
      const accessToken = await this.jwtService.createToken(
        email,
      );
      const cleanUser = new LoginDto(userFromDb);
      return { token: accessToken, user: cleanUser };
    } else {
      throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
    }
  }

  async getAccessToken(id) {
    const userFromDb = await this.userModel.findById(id);

    if (userFromDb) {
      const accessToken = await this.jwtService.createToken(
        userFromDb.email,
      );
      const cleanUser = new LoginDto(userFromDb);
      return { token: accessToken, user: cleanUser };
    } else {
      throw new HttpException('SIGNUP.ERROR', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkPassword(email: string, password: string) {
    const userFromDb = await this.userModel.findOne({ email });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    return await bcrypt.compare(password, userFromDb.password);
  }
}
