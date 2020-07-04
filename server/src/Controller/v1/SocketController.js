const { OrderEvent } = require('../../Events');
const {
	saveNotification,
	orderDetails,
	updateOrder,
} = require('./OrderController');
var socketConnect = '';
const sockets = (server) => {
	const io = require('socket.io')(server);
	io.on('connection', (socket) => {
		socketConnect = socket;
		socket.on('disconnect', (user_id) => {
			console.log('users leave the room');
			socket.leave(user_id);
		});
		socket.on('connected', (user_id) => {
			socket.join(user_id);
			console.log('user join the socket', user_id);
			socket.broadcast.to(user_id).emit('connected', user_id);
		});

		socket.on('newOrder', async ({ orderId }) => {
			const result = await orderDetails(orderId);
			if (result) {
				socket.broadcast.to(result.shop_id).emit('newOrder', result);
			}
		});

		socket.on(
			'orderAccept',
			async ({
				orderId,
				status,
				rejectMessage = 'your order is rejeted',
				estimateTime,
			}) => {
				const orderObject = {
					id: orderId,
					order_status: status,
					reject_message: status === 2 ? rejectMessage : '',
					estimate_time: estimateTime,
				};
				if (parseInt(status) !== 1) {
					delete orderObject.estimate_time;
				}
				await updateOrder(orderObject);
				const result = await orderDetails(orderId);
				if (result) {
					setTimeout(() => {
						saveNotification(status, result);
					}, 0);
					socket.broadcast.to(result.user_id).emit('orderAccept', result);
				}
			}
		);

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

OrderEvent.on('orderSuccess', async (shopId, orderDetail) => {
	console.log('order done!', shopId, orderDetail);
	const result = await orderDetails(orderDetail.order_id);
	if (result) {
		socketConnect.broadcast.to(shopId).emit('newOrder', result);
		console.log('result done');
	}
});
