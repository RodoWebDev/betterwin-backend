import { Connection, Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { UserDto } from './dto/user.dto';
import { UserPackage } from './interfaces/user_package.interface';
import { PackagesInterface } from 'packages/interfaces/packages.interface';
import { EmailVerification } from 'auth/interfaces/emailverification.interface';
// import { otpGenerator } from 'otp-generator';
var otpGenerator = require('otp-generator')

const saltRounds = 10;

const defaultUsers = [{
  firstName: 'Noname',
  lastName: 'Noname',
  email: 'noname@noname.com',
  password: 'nonamenoname!',
}, {
  isTest: true,
  firstName: 'Provider',
  lastName: 'Test User (Not use)',
  email: 'provider@test-user.com',
  password: 'nonamenoname!',
}, {
  isTest: true,
  firstName: 'Client',
  lastName: 'Test User (Not use)',
  email: 'client@test-user.com',
  password: 'nonamenoname!',
}];

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await (async () => {
      for (const defaultUser of defaultUsers) {
        const defaultUserExist = await this.userModel.exists({
          email: defaultUser.email,
        });

        if (!defaultUserExist) {
          const createdUser = await this.createNewUser(new UserDto(defaultUser));
          await createdUser.save();
        }
      }
    })();
  }
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Packages') private readonly packagesModel: Model<PackagesInterface>,
    @InjectModel('EmailVerification') private readonly verificationModel: Model<EmailVerification>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findPacakgeById(packageId: string): Promise<PackagesInterface> {
    return await this.packagesModel.findOne({ packageId }).exec();
  }

  isValidEmail(email: string) {
    if (email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    } else return false;
  }

  async createNewUser(newUser: UserDto): Promise<User> {
    if (this.isValidEmail(newUser.email.toLowerCase()) && newUser.password) {
      const userRegistered = await this.findByEmail(newUser.email.toLowerCase());
      if (!userRegistered) {
        const otpcode = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const createdVerification = new this.verificationModel({email: newUser.email.toLowerCase(), emailToken: otpcode});
        await createdVerification.save();
        const tempNewUser = {
          ...newUser, verified: false,
        };

        tempNewUser.password = await bcrypt.hash(newUser.password, saltRounds);
        const createdUser = new this.userModel(tempNewUser);
        return await createdUser.save();
      } else {
        throw new HttpException(
          'REGISTRATION.USER_ALREADY_REGISTERED',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException(
        'REGISTRATION.MISSING_MANDATORY_PARAMETERS',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async checkPassword(userId: string, password: string) {
    const userFromDb = await this.userModel.findById(userId);
    if (!userFromDb)
      throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    return await bcrypt.compare(password, userFromDb.password);
  }
  async setPasswordByUserId(userId: string, newPassword: string): Promise<boolean> {
    const userFromDb = await this.userModel.findById(userId );
    if (!userFromDb)
      throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    userFromDb.password = await bcrypt.hash(newPassword, saltRounds);

    await userFromDb.save();
    return true;
  }
  async updatePackage(email: string, packageInfo: UserPackage) {
    const packageInfoFromDb =  await this.userModel.findOne({ email }).exec();
    if (!packageInfoFromDb) {
      throw new HttpException('COMMON.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    const packageResponse = await this.findPacakgeById(packageInfo['packageId']);
    if (!packageResponse) {
      throw new HttpException('COMMON.PACKAGE_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    packageInfoFromDb.lastPlayedPackage = {
      packageId: packageInfo['packageId'],
      name: packageResponse.name
    }
    let { packageList } = packageInfoFromDb;
    let contain = false;
    packageList.forEach(packageItem => {
      if(packageItem.packageId === packageInfo['packageId']) {
        contain = true;
        packageItem.totalPlayedTime = packageInfo['totalPlayedTime'];
        packageItem.lastOnlineTime = packageInfo['lastOnlineTime'];
        packageItem.level = packageInfo['level'];
        packageItem.score = packageInfo['score'];
      }
    })
    if (!contain) {
      packageInfoFromDb.packageList.push(packageInfo);
    } else {
      packageInfoFromDb.packageList = packageList;
    }
    await packageInfoFromDb.save();
    return packageInfo;
  }
}
