import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CommentDto } from './comment.dto';

export class ReviewsDto {
	constructor(object: any) {
		this.userId = object.userId;
		this.packageId = object.packageId;
		this.comment = object.comment;
		this.rating = object.rating;
	}

	@ApiProperty({
		type: Types.ObjectId,
		required: true,
	})
	userId: Types.ObjectId;

	@ApiProperty({
		type: String,
		required: true,
	})
	packageId: string;

	@ApiProperty({
		type: CommentDto,
	})
	comment: CommentDto;

	@ApiProperty({
		type: Number,
		required: true,
	})
	rating: number;
}
