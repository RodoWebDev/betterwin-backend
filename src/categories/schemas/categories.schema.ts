import * as mongoose from 'mongoose';

export const CategoriesSchema = new mongoose.Schema({
  id: String,
  categoryName: String,
});
