const Db = require('../../../libary/sqlBulider');
const ApiController = require('./ApiController');
const {
	currentTime,
	currentMonthFirstDate,
	currentWeekFirstDate,
} = require('../../../libary/CommanMethod');
const DB = new Db();
const Helper = new ApiController();

const orderDetails = async (orderId) => {
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
		return result;
	}
	return false;
};

const updateOrder = async (data) => {
	return await DB.save('orders', data);
};

const saveNotification = async (status, result) => {
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
	const { user_id, shop_id } = result;
	const notificationObject = {
		user_id,
		shop_id,
		text,
		type,
		order_id: result.id,
	};
	DB.save('notifications', notificationObject);
	Object.assign(notificationObjectm, {
		message: text,
	});
	Helper.sendPush(user_id, notificationObjectm);
};

const shopRecord = async (shopId) => {
	const todayOrders = await DB.first(
		`select IFNULL(count(*),0) as total from orders where shop_id=${shopId} and from_unixtime(order_date, "%y%d%m") = from_unixtime(${currentTime}, "%y%d%m")`
	);
	const weekOrders = await DB.first(
		`select IFNULL(count(*),0) as total from orders where shop_id=${shopId} and order_date > ${currentWeekFirstDate}`
	);
	const monthOrders = await DB.first(
		`select IFNULL(count(*),0) as total from orders where shop_id=${shopId} and  order_date > ${currentMonthFirstDate}`
	);
	return {
		today: todayOrders[0].total,
		week: weekOrders[0].total,
		month: monthOrders[0].total,
	};
};

module.exports = {
	saveNotification,
	updateOrder,
	orderDetails,
	shopRecord,
};
