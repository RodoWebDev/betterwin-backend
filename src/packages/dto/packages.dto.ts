import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class PackagesDto {
	constructor(object: any) {
		this.originalname = object.originalname;
		this.name = object.name;
		this.packageId = object.packageId;
		this.description = object.description;
		this.publishedBy = object.publishedBy;
		this.status = object.status;
		this.categories = object.categories;
		this.tags = object.tags;
	}

	@ApiProperty({
		type: String,
		required: true,
	})
	originalname: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	name: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	packageId: string;

	@ApiProperty({
		type: String,
	})
	description: string;

	@ApiProperty({
		type: String,
	})
	publishedBy: string;

	@ApiProperty({
		type: String,
	})
	status: string;

	@ApiProperty({
		type: [String],
	})
	categories: [string];

	@ApiProperty({
		type: [String],
	})
	tags: [string];

	@ApiProperty()
	downloads?: number;

	@ApiProperty()
	imgs?: [string];
	
	@ApiProperty()
	icon?: string;
}
