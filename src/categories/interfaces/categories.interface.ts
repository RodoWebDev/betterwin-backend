import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

export class CategoriesInterface extends Document {
  @ApiProperty()
  categoryName: string;
}
