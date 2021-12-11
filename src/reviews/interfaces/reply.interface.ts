import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class ReplyInterface {
  @ApiProperty()
  reply: string;

  @ApiProperty()
  userId: Types.ObjectId;
}
