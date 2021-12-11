import { ApiProperty } from '@nestjs/swagger';

export class UserPackageDto {
	constructor(object: any) {
		this.packageId = object.packageId;
		this.totalPlayedTime = object.totalPlayedTime;
		this.lastOnlineTime = object.lastOnlineTime;
		this.level = object.level;
		this.score = object.score;
	}

	@ApiProperty({
		description: 'Package Id',
	})
	readonly packageId: String;

	@ApiProperty({
		description: 'Total played time',
	})
	readonly totalPlayedTime: Number;

	@ApiProperty({
		description: 'Last Online time',
	})
	readonly lastOnlineTime: Number;

	@ApiProperty({
		description: 'User level',
	})
	readonly level: Number;

	@ApiProperty({
		description: 'User score',
	})
	readonly score: Number;
}
