const { OrderEvent } = require('../../Events');
const { socketConfig } = require('../../../config');
var socketConnect = '';
const sockets = (server) => {
	const io = require('socket.io')(server, socketConfig);
	io.on('connection', (socket) => {
		socketConnect = socket;
		socket.on('disconnect', (user_id) => {
			console.log('users leave the room');
			socket.leave(user_id);
		});
		OrderEvent.on('orderSuccess', (shopId, orderDetails) => {
			console.log('order done!', shopId);
			socket.broadcast.to(shopId).emit('newOrder', shopId, orderDetails);
		});

		OrderEvent.on('orderAccept', (shopId, orderDetails) => {
			console.log('an event occurred!');
			socket.broadcast.to(shopId).emit('orderAccept', shopId, orderDetails);
		});

		socket.on('connected', (user_id) => {
			socket.join(user_id);
			console.log('user join the socket', user_id);
			socket.broadcast.to(user_id).emit('connected', user_id);
		});

		socket.on('newOrder', (shopId, orderDetails) => {
			socket.broadcast.to(shopId).emit('newOrder', shopId, orderDetails);
		});

		socket.on('orderAccept', (shopId, orderDetails) => {
			socket.broadcast.to(shopId).emit('orderAccept', shopId, orderDetails);
		});

		socket.on('leaveRoom', (id) => {
			socket.leave(id);
			socket.broadcast.to(id).emit('leaveChat', id);
		});
		socket.on('error', function (err) {
			console.log('received socket error:');
			console.log(err);
		});
	});
};
module.exports = sockets;

OrderEvent.on('orderSuccess', (shopId, orderDetails) => {
	console.log('order done!', shopId);
	socketConnect.broadcast.to(shopId).emit('newOrder', shopId, orderDetails);
});
