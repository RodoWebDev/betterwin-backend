import * as mongoose from 'mongoose';

export const ReplySchema = new mongoose.Schema({
  reply: String,
  userId: String,
});
