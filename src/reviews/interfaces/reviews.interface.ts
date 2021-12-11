import { ApiProperty } from "@nestjs/swagger";
import { Document, Types } from 'mongoose';
import { CommentInterface } from "./comment.interface";

export class ReviewsInterface extends Document {
  @ApiProperty()
  userId: Types.ObjectId;

  @ApiProperty()
  packageId: string;

  @ApiProperty()
  comment?: CommentInterface;

  @ApiProperty()
  rating?: number;

  @ApiProperty()
  like?: [Types.ObjectId];

  @ApiProperty()
  unLike?: [Types.ObjectId];
}
