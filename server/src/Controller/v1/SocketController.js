const { OrderEvent } = require('../../Events');
const Db = require('../../../libary/sqlBulider');
const DB = new Db();
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
			console.log('socket', orderId);
			const result = await DB.find('orders', 'first', {
				conditions: {
					'orders.id': orderId,
				},
				join: [
					'users on (users.id =  orders.user_id)',
					'users as shops on (shops.id = orders.shop_id)',
				],
				fields: [
					'orders.*',
					'users.first_name',
					'users.last_name',
					'users.email',
					'users.phone',
					'users.phone_code',
					'users.address',
					'users.latitude',
					'users.longitude',
					'users.profile',
					'CONCAT(shops.first_name, " ", shops.last_name) as shop_name',
					'shops.email as shop_email',
					'shops.phone as shop_phone',
					'shops.phone_code as shop_phone_code',
					'shops.address as shop_address',
					'shops.latitude as shop_lat',
					'shops.longitude as shop_lng',
					'shops.profile as shop_profile',
					'shops.min_order as min_order',
				],
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

		socket.on('orderAccept', async ({ orderId, status }) => {
			await DB.save('orders', {
				id: orderId,
				order_status: status,
			});
			let text = '';
			let type = 3;
			switch (status) {
				case 1:
					text = 'Your order accepted by shop';
					type = 3;
					break;
				case 2:
					text = 'Your order rejected by shop';
					type = 4;
					break;
				case 3:
					text = 'Your order on the way';
					type = 5;
					break;
				case 4:
					text = 'Your order successfully delivered';
					type = 6;
					break;
				default:
					text = 'Your order accepted by shop';
					type = 3;
					break;
			}

			const result = await DB.find('orders', 'first', {
				conditions: {
					'orders.id': orderId,
				},
				join: [
					'users on (users.id =  orders.user_id)',
					'users as shops on (shops.id = orders.shop_id)',
				],
				fields: [
					'orders.*',
					'users.first_name',
					'users.last_name',
					'users.email',
					'users.phone',
					'users.phone_code',
					'users.address',
					'users.latitude',
					'users.longitude',
					'users.profile',
					'CONCAT(shops.first_name, " ", shops.last_name) as shop_name',
					'shops.email as shop_email',
					'shops.phone as shop_phone',
					'shops.phone_code as shop_phone_code',
					'shops.address as shop_address',
					'shops.latitude as shop_lat',
					'shops.longitude as shop_lng',
					'shops.profile as shop_profile',
					'shops.min_order as min_order',
				],
			});
			if (result) {
				if (result.product_details) {
					result.product_details = JSON.parse(result.product_details);
				}
				if (result.address_details) {
					result.address_details = JSON.parse(result.address_details);
				}
				const { user_id, shop_id } = result;
				DB.save('notifications', {
					user_id,
					shop_id,
					text,
					type,
					order_id: orderId,
				});
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

OrderEvent.on('orderSuccess', async (shopId, orderDetails) => {
	console.log('order done!', shopId, orderDetails);
	const result = await DB.find('orders', 'first', {
		conditions: {
			'orders.id': orderDetails.order_id,
		},
		join: [
			'users on (users.id =  orders.user_id)',
			'users as shops on (shops.id = orders.shop_id)',
		],
		fields: [
			'orders.*',
			'users.first_name',
			'users.last_name',
			'users.email',
			'users.phone',
			'users.phone_code',
			'users.address',
			'users.latitude',
			'users.longitude',
			'users.profile',
			'CONCAT(shops.first_name, " ", shops.last_name) as shop_name',
			'shops.email as shop_email',
			'shops.phone as shop_phone',
			'shops.phone_code as shop_phone_code',
			'shops.address as shop_address',
			'shops.latitude as shop_lat',
			'shops.longitude as shop_lng',
			'shops.profile as shop_profile',
			'shops.min_order as min_order',
		],
	});
	if (result) {
		if (result.product_details) {
			result.product_details = JSON.parse(result.product_details);
		}
		if (result.address_details) {
			result.address_details = JSON.parse(result.address_details);
		}
		socketConnect.broadcast.to(shopId).emit('newOrder', result);
		console.log('result done');
	}
});
