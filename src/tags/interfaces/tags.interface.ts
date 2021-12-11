import { ApiProperty } from "@nestjs/swagger";
import { Document } from 'mongoose';

export class TagsInterface extends Document {
  @ApiProperty()
  tagName: string;
}
