import { ApiProperty } from '@nestjs/swagger';
import { UserPackageDto } from './user-package.dto';

export class UserDto {
	constructor(object: any) {
		this.password = object.password;
		this.email = object.email;
		this.firstName = object.firstName;
		this.lastName = object.lastName;
	}
	@ApiProperty()
	password: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	email: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	firstName: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	lastName: string;
}
export class LastPlayedPackageDto {
	constructor(object: any) {
		this.packageId = object.packageId;
		this.name = object.name;
	}
	@ApiProperty({
		type: String,
		required: true,
	})
	packageId: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	name: string;
  }
export class UserResponseDto {
	constructor(object: any) {
		this.password = object.password;
		this.email = object.email;
		this.firstName = object.firstName;
		this.lastName = object.lastName;
		this.packageList = object.packageList;
		this.lastPlayedPackage = object.lastPlayedPackage;
	}
	@ApiProperty()
	password: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	email: string;

	@ApiProperty({
		type: String,
		required: true,
	})
	firstName: string;
	@ApiProperty({
		type: String,
		required: true,
	})
	lastName: string;
	@ApiProperty({
		type: UserPackageDto,
		isArray: true,
	})
	packageList: [UserPackageDto]
	@ApiProperty({
		type: LastPlayedPackageDto,
		isArray: true,
	})
	lastPlayedPackage: [LastPlayedPackageDto]
}

export class LoginDto {
	constructor(object: any) {
		this.firstName = object.firstName;
		this.lastName = object.lastName;
		this.email = object.email;
		this.id = object._id;
	}
	id: string;
	firstName?: string;
	lastName?: string;
	email: string;
}
 