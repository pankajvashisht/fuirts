const database = require('./database');
const config = require('./config');
const mails = require('./mails');
const lang = require('./lang');
const SMS = require('./message');
const socketConfig = require('./SocketConfig');
module.exports = {
	database,
	config,
	mails,
	lang,
	SMS,
	socketConfig,
};
