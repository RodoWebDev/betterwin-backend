import * as mongoose from 'mongoose';
import { CommentSchema } from './comment.schema';

export const ReviewsSchema = new mongoose.Schema({
  userId: {type: mongoose.Types.ObjectId, ref: 'User'},
  packageId: String,
  rating: Number,
  comment: CommentSchema,
  like: [mongoose.Types.ObjectId],
  unLike: [mongoose.Types.ObjectId],
});
