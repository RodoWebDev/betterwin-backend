import * as mongoose from 'mongoose';
import { UserPackageSchema } from './user_package.schema';

export const UserSchema = new mongoose.Schema({
  id: String,
  createdAt: { type: Date, default: Date.now },
  firstName: String,
  lastName: String,
  email: { type : String, lowercase: true},
  password: String,
  verified: Boolean,
  lastPlayedPackage: {packageId: String, name: String},
  packageList: [UserPackageSchema]
});
