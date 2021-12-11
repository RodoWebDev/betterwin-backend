import { ApiProperty } from '@nestjs/swagger';
import { ReplyDto } from './reply.dto';

export class CommentDto {
	constructor(object: any) {
		this.comment = object.comment;
		this.replies = object.replies;
	}

	@ApiProperty({
		type: String,
		required: true,
	})
	comment: string;

	@ApiProperty({
		type: [ReplyDto],
		required: true,
	})
	replies?: [ReplyDto];
}
