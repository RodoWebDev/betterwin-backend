import * as mongoose from 'mongoose';

export const TagsSchema = new mongoose.Schema({
  id: String,
  tagName: String,
});
