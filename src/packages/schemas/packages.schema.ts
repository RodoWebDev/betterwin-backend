import * as mongoose from 'mongoose';
import { DownloadSchema } from './download.schema';
import { RatingSchema } from './rating.schema';

export const PackagesSchema = new mongoose.Schema({
  id: String,
  createdAt: { type: Date, default: Date.now },
  name: String,
  packageId: String,
  originalname: String,
  description: String,
  publishedBy: String,
  status: String,
  categories: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  livePlayers: Number,
  downloads: [DownloadSchema],
  rating: RatingSchema,
  imgs: [String],
  icon: String
});
