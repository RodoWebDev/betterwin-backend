import * as mongoose from 'mongoose';
import { ReplySchema } from './reply.schema';

export const CommentSchema = new mongoose.Schema({
  comment: String,
  replies: [ReplySchema],
});
