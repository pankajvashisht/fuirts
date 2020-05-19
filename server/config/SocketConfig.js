const socketConfig = {
	path: '/orders',
	serveClient: false,
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false,
};

module.exports = socketConfig;
