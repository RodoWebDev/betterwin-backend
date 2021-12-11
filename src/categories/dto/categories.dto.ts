import { ApiProperty } from '@nestjs/swagger';

export class CategoriesDto {
	constructor(object: any) {
		this.categoryName = object.categoryName;
	}

	@ApiProperty({
		type: String,
		required: true,
	})
	categoryName: string;
}
