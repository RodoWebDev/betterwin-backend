import * as mongoose from 'mongoose';

export const RatingSchema = new mongoose.Schema({
  rating: Number,
  totalCount: Number,
  mark1: Number,
  mark2: Number,
  mark3: Number,
  mark4: Number,
  mark5: Number
});
