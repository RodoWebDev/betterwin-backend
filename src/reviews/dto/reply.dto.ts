import { ApiProperty } from '@nestjs/swagger';

export class ReplyDto {
	constructor(object: any) {
		this.reply = object.reply;
		this.userId = object.userId;
	}

	@ApiProperty({
		type: String,
		required: true,
	})
	reply: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	userId: string;
}
