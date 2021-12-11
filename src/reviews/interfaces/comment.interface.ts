import { ApiProperty } from "@nestjs/swagger";
import { ReplyInterface } from "./reply.interface";

export class CommentInterface {
  @ApiProperty()
  comment: string;
  
  @ApiProperty()
  replies?: [ReplyInterface];
}
