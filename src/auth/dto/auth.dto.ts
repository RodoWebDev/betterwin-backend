import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'users/dto/user.dto';

export class Token {
	constructor(object: any) {
		this.expires_in = object.expires_in;
		this.access_token = object.access_token;
	}
	@ApiProperty({
		type: Number,
		required: true,
	})
	expires_in: number;

	@ApiProperty({
		type: String,
		required: true,
	})
	access_token: string;
}
export class AuthResponseDto {
	constructor(object: any) {
		this.token = object.token;
		this.user = object.user;
	}
	@ApiProperty({
		type: Token,
		required: true,
	})
	token: Token
	@ApiProperty({
		type: UserDto,
		required: true,
	})
	user: UserDto
}