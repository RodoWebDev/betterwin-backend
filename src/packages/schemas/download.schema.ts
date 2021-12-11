import * as mongoose from 'mongoose';

export const DownloadSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
});
