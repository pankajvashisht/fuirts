const { OrderEvent } = require('../../Events');
const { socketConfig } = require('../../../config');
const Db = require('../../../libary/sqlBulider');
const DB = new Db();
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

		socket.on('newOrder', async ({ orderId }) => {
			const result = await DB.find('orders', 'first', {
				conditions: {
					id: orderId,
				},
			});
			if (result) {
				if (result.product_details) {
					result.product_details = JSON.parse(result.product_details);
				}
				if (result.address_details) {
					result.address_details = JSON.parse(result.address_details);
				}
				socket.broadcast.to(result.shop_id).emit('newOrder', result);
			}
		});

		socket.on('orderAccept', ({ orderId }) => {
			const result = await DB.find('orders', 'first', {
				conditions: {
					id: orderId,
				},
			});
			if (result) {
				if (result.product_details) {
					result.product_details = JSON.parse(result.product_details);
				}
				if (result.address_details) {
					result.address_details = JSON.parse(result.address_details);
				}
				socket.broadcast.to(result.user_id).emit('orderAccept', result);
			}
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
