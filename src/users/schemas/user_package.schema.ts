import * as mongoose from 'mongoose';

export const UserPackageSchema = new mongoose.Schema({
	packageId: {
		type: String,
	},
	totalPlayedTime: {
		type: Number,
	},
	lastOnlineTime: {
		type: Date,
	},
	level: {
		type: Number,
	},
	score: {
		type: Number,
	}
});
