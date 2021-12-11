export default {
	db: {
		user: process.env.DB_USER,
		pass: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		authSource: null,
	},
	host: {
		url: process.env.URL || 'localhost',
		port: process.env.PORT || '8080',
	},
	jwt: {
		secretOrKey: process.env.JWT_SECRET_OR_KEY || 'secret',
		expiresIn: process.env.JWT_EXPIRES_IN || 36000000,
	},
	creds: {
		mail: 'no-reply@iSAPSolutionsltd.onmicrosoft.com',
		company: 'iSAP Solution Ltd'
	},
};
