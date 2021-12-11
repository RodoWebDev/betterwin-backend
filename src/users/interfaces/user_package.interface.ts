import { Document } from 'mongoose';
export interface UserPackage extends Document{
  packageId: string,
	totalPlayedTime: Number,
	lastOnlineTime: Date,
  level: Number,
  score: Number
}
