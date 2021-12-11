import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class DownloadInterface {
  @ApiProperty()
  userId: Types.ObjectId;
}
