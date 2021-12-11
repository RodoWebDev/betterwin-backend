import { ApiProperty } from '@nestjs/swagger';

export class TagsDto {
	constructor(object: any) {
		this.tagName = object.tagName;
	}

	@ApiProperty({
		type: String,
		required: true,
	})
	tagName: string;
}
