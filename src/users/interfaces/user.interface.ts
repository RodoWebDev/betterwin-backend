import { Document } from 'mongoose';
import { UserPackage } from './user_package.interface';

export class LastPlayedPackage {
  packageId: string;
  name: string;
}
export class User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  lastPlayedPackage: LastPlayedPackage;
  packageList: [UserPackage]
  auth: {
    email: {
      valid: boolean;
    };
    facebook?: {
      userid: string;
    };
    gmail?: {
      userid: string;
    };
  };
}
