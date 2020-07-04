require('dotenv').config();

const path = require('path');
const config = {
	App_name: process.env.APP_NAME || 'vgFruits',
	port: process.env.PORT || 4001,
	rootPath: path.resolve(__dirname),
	GOOGLE_KEY: process.env.GOOGLE_KEY,
};

module.exports = config;
