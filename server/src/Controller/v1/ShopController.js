const { OrderEvent } = require('../../Events');
const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const app = require('../../../libary/CommanMethod');
const DB = new Db();
const Helper = new ApiController();
module.exports = {
	getShop: async (Request) => {
		let offset = Request.query.offset || 1;
		const {
			limit = 10,
			latitude = 0,
			longitude = 0,
			search = '',
			newShop = false,
			highRated = false,
			category_id = 0,
			radius = 2000000,
		} = Request.query;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				user_type: 2,
				status: 1,
				location: [
					`round(( 6371 * acos( cos( radians(${latitude}) ) * cos( radians(latitude) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin(radians(latitude)) ) ),0) < ${radius}`,
				],
			},
			fields: fieldView(latitude, longitude),
			limit: [offset, limit],
			orderBy: ['first_name desc'],
		};
		if (newShop) {
			condition['orderBy'] = ['id desc'];
		}
		if (highRated) {
			condition['orderBy'] = ['rating desc'];
		}
		if (parseInt(category_id) !== 0) {
			condition.conditions['subquery'] = [
				`select count(id) from products where category_id=${category_id} and user_id=users.id`,
				'>',
				0,
			];
		}
		if (search) {
			condition.conditions[`Raw`] = [
				`(EXISTS (select name from products where name like '%${search}%' and user_id = users.id limit 1) or (first_name like '%${search}%' or  last_name like '%${search}%'))`,
			];
		}
		const result = await DB.find('users', 'all', condition);
		return {
			message: app.Message('shopListing'),
			data: {
				pagination: await Helper.Paginations('users', condition, offset, limit),
				result: app.addUrl(result, 'profile'),
			},
		};
	},
	getReview: async (Request) => {
		let offset = Request.query.offset || 1;
		const limit = Request.query.limit || 10;
		const shop_id = Request.query.shop_id;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				shop_id,
			},
			join: ['users on (ratings.user_id = users.id)'],
			fields: [
				'ratings.*',
				'first_name',
				'last_name',
				'min_order',
				'status',
				'email',
				'phone',
				'phone_code',
				'profile',
			],
			limit: [offset, limit],
			orderBy: ['ratings.id desc'],
		};
		const result = await DB.find('ratings', 'all', condition);
		return {
			message: app.Message('rating'),
			data: app.addUrl(result, 'profile'),
		};
	},
	orderFurit: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			product_id: Request.body.product_id,
			address_id: Request.body.address_id,
			quantity: Request.body.quantity || 1,
			service_fees: Request.body.service_fees || 0,
			taxes: Request.body.taxes || 0,
			order_date: Request.body.order_date || app.currentTime,
			discout: Request.body.discout || 0,
			coupon_id: Request.body.coupon_id || 0,
			payment_details: Request.body.payment_details || {},
			order_otp: app.randomNumber(),
			status: 1,
		};
		const RequestData = await Helper.vaildation(required, {});
		const {
			product_id,
			address_id,
			user_id,
			coupon_id,
			quantity,
		} = RequestData;
		const [productDetails, productWithShop] = await checkAllProducts(
			product_id,
			quantity
		);
		const addressDetails = await DB.find('user_addresses', 'first', {
			conditions: {
				id: address_id,
				user_id,
			},
		});
		if (!addressDetails) throw new ApiError(app.Message('productInvaild'), 422);
		if (parseInt(coupon_id) !== 0) {
			const couponDetails = await DB.find('coupons', 'first', {
				conditions: {
					id: coupon_id,
					status: 1,
				},
			});
			if (!couponDetails) throw new ApiError(app.Message('coupenInvaild'), 422);
			RequestData.coupon_details = JSON.stringify(couponDetails);
		}

		updateProduct(productDetails, quantity);
		const orderDetails = [];
		for (const keys in productWithShop) {
			RequestData.shop_id = keys;
			RequestData.price = productWithShop[keys].price;
			RequestData.quantity = productWithShop[keys].totalQyt;
			RequestData.product_details = JSON.stringify(
				productWithShop[keys].productDetails
			);
			RequestData.address_details = JSON.stringify(addressDetails);
			RequestData.order_id = await DB.save('orders', RequestData);
			setTimeout(() => {
				pushSend(RequestData, productWithShop[keys].productDetails);
			}, 10);
			RequestData.product_details = JSON.parse(RequestData.product_details);
			RequestData.address_details = JSON.parse(RequestData.address_details);
			orderDetails.push(RequestData);
		}

		return {
			message: app.Message('orderSuccess'),
			data: orderDetails,
		};
	},
	doPayment: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			order_id: Request.body.order_id,
			payment_datials: Request.body.payment_datials,
			status: Request.body.status, // 0 -> fail 1-> success
		};
		const RequestData = await Helper.vaildation(required, {});
		const condition = {
			conditions: {
				id: RequestData.order_id,
			},
		};
		const result = await DB.find('orders', 'first', condition);
		if (!result) throw new ApiError('Invaild order id', 422);
		RequestData.booking_id = await DB.save('payments', RequestData);
		return {
			message: 'Payment Successfully',
			data: RequestData,
		};
	},
	giveRating: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			shop_id: Request.body.shop_id,
			rating: Request.body.rating,
			comment: Request.body.comment,
		};
		const RequestData = await Helper.vaildation(required, {});
		const condition = {
			conditions: {
				id: RequestData.shop_id,
				user_type: 2,
			},
		};
		const result = await DB.find('users', 'first', condition);
		if (!result) throw new ApiError(app.Message('invaildShop'), 422);
		RequestData.rating_id = await DB.save('ratings', RequestData);
		setTimeout(() => {
			const pushMessage = `${Request.body.userInfo.first_name} giving you rating ${RequestData.rating}`;
			saveNotification({
				user_id: RequestData.user_id,
				shop_id: RequestData.shop_id,
				text: pushMessage,
				type: 2,
			});
			Helper.sendPush(RequestData.shop_id, {
				message: pushMessage,
				data: RequestData,
				notification_code: 2,
			});
		}, 100);
		return {
			message: app.Message('ratingSuccess'),
			data: RequestData,
		};
	},
	home: async (Request) => {
		const { latitude = 0, longitude = 0, search = '' } = Request.query;
		const banners = await DB.find('banners', 'all', {
			conditions: {
				status: 1,
			},
			limit: 10,
		});
		const categories = await DB.find('categories', 'all', {
			conditions: {
				status: 1,
			},
			limit: 10,
		});
		const condition = {
			conditions: {
				user_type: 2,
				status: 1,
				location: [
					`round(( 6371 * acos( cos( radians(${latitude}) ) * cos( radians(latitude) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin(radians(latitude)) ) ),0) < 2000000`,
				],
			},
			fields: fieldView(latitude, longitude),
			limit: 10,
			orderBy: ['id desc'],
		};
		if (search) {
			condition.conditions[`like`] = {
				first_name: search,
				last_name: search,
			};
		}
		const newConditions = { ...condition };
		const newShop = await DB.find('users', 'all', condition);
		newConditions['orderBy'] = ['rating desc'];
		const topRated = await DB.find('users', 'all', newConditions);
		return {
			message: app.Message('home'),
			data: {
				banners: app.addUrl(banners, 'image'),
				categories: app.addUrl(categories, 'image'),
				topRatedShops: app.addUrl(topRated, 'profile'),
				newShops: app.addUrl(newShop, 'profile'),
			},
		};
	},
	repeatOrder: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			order_id: Request.body.order_id,
			payment_details: Request.body.payment_details || {},
			order_otp: app.randomNumber(),
		};
		const RequestData = await Helper.vaildation(required, {});
		const { order_id, user_id } = RequestData;
		const orderInfo = await DB.find('orders', 'first', {
			conditions: {
				id: order_id,
				user_id,
			},
		});
		if (!orderInfo) throw new ApiError(app.Message('invaildOrder'), 400);
		delete orderInfo.id;
		delete orderInfo.coupon_id;
		delete orderInfo.coupon_details;
		orderInfo.order_otp = RequestData.order_otp;
		orderInfo.payment_details = RequestData.payment_details;
		orderInfo.order_date = app.currentTime;
		orderInfo.created = app.currentTime;
		orderInfo.modified = app.currentTime;
		orderInfo.order_id = await DB.save('orders', orderInfo);
		setTimeout(() => {
			pushSend(orderInfo, JSON.parse(orderInfo.product_details));
		}, 100);
		return {
			message: app.Message('orderSuccess'),
			data: orderInfo,
		};
	},
	myOrders: async (Request) => {
		const user_id = Request.body.user_id;
		const user_type = Request.body.userInfo.user_type;
		let offset = Request.query.offset || 1;
		const { order_status = 0, limit = 10 } = Request.query;
		offset = (offset - 1) * limit;
		const conditions = {};
		if (user_type === 1) {
			if (parseInt(order_status) === 2 || parseInt(order_status) === 4) {
				conditions['IN'] = {
					order_status: [2, 4],
				};
			} else {
				conditions['IN'] = {
					order_status: [1, 2, 0],
				};
			}
			conditions['user_id'] = user_id;
		} else if (user_type === 2) {
			if (parseInt(order_status) === 0 || parseInt(order_status) === 1) {
				conditions['IN'] = {
					order_status: [0, 1],
				};
			} else {
				conditions['order_status'] = order_status;
			}

			conditions['shop_id'] = user_id;
		} else {
			conditions['order_status'] = order_status;
			conditions['driver_id'] = user_id;
		}
		const condition = {
			conditions,
			join: [
				'users on (users.id =  orders.user_id)',
				'users as shops on (shops.id = orders.shop_id)',
			],
			limit: [offset, limit],
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
				'shops.accept_order',
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
			orderBy: ['orders.id desc'],
		};
		const result = await DB.find('orders', 'all', condition);
		const final = result.map((value) => {
			if (value.product_details) {
				value.product_details = JSON.parse(value.product_details);
			}
			if (value.address_details) {
				value.address_details = JSON.parse(value.address_details);
			}
			if (value.payment_details) {
				value.payment_details = JSON.parse(value.payment_details);
			}
			return value;
		});
		return {
			message: app.Message('orderListing'),
			data: {
				pagination: await Helper.Paginations(
					'orders',
					condition,
					offset,
					limit
				),
				result: app.addUrl(final, ['profile', 'shop_profile']),
			},
		};
	},
	searchShop: async (Request) => {
		let offset = Request.query.offset || 1;
		const {
			limit = 10,
			latitude = 0,
			longitude = 0,
			search = '',
			category_id = 0,
			radius = 2000000,
		} = Request.query;
		offset = (offset - 1) * limit;
		const { user_id = 0 } = Request.body;
		const condition = {
			conditions: {
				Raw: [
					`(first_name like '%${search}%' or  last_name like '%${search}%')`,
				],
				user_type: 2,
				status: 1,
				location: [
					`round(( 6371 * acos( cos( radians(${latitude}) ) * cos( radians(latitude) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin(radians(latitude)) ) ),0) < ${radius}`,
				],
			},
			fields: fieldView(latitude, longitude),
			limit: [offset, limit],
			orderBy: ['first_name desc'],
		};
		const productConditions = {
			conditions: {
				Raw: [
					`(products.name like '%${search}%' or  products.description like '%${search}%')`,
				],
				'products.status': 1,
				location: [
					`round(( 6371 * acos( cos( radians(${latitude}) ) * cos( radians(latitude) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin(radians(latitude)) ) ),0) < ${radius}`,
				],
			},
			join: [
				'users on (users.id = products.user_id)',
				'categories on (categories.id = products.category_id)',
			],
			fields: [
				'products.*',
				'categories.name as category_name',
				`(select count(id) from favourite_products where user_id=${user_id} and product_id=products.id) as is_fav`,
				`CONCAT(users.first_name, " ", users.last_name) as shop_name`,
				'users.address',
				'users.first_name',
				'users.last_name',
				'users.phone',
				'users.profile',
				'users.service_fees',
				'users.delivery_charges',
				'users.taxes',
				'2 as type',
			],
			limit: [offset, limit],
			orderBy: ['id desc'],
		};
		if (parseInt(category_id) !== 0) {
			productConditions.conditions.category_id = category_id;
		}
		const shop = await DB.find('users', 'all', condition);
		const product = await DB.find('products', 'all', productConditions);
		return {
			message: app.Message('shopListing'),
			data: [
				...app.addUrl(product, ['image', 'profile']),
				...app.addUrl(shop, 'profile'),
			],
		};
	},
	orderDetails: async (Request) => {
		const user_id = Request.body.user_id;
		const user_type = Request.body.userInfo.user_type;
		const order_id = Request.params.order_id;
		const conditions = {
			'orders.id': order_id,
		};
		if (user_type === 1) {
			conditions['user_id'] = user_id;
		} else if (user_type === 2) {
			conditions['shop_id'] = user_id;
		} else {
			conditions['driver_id'] = user_id;
		}
		const condition = {
			conditions,
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
			orderBy: ['orders.id desc'],
			limit: 1,
		};
		const result = await DB.find('orders', 'all', condition);
		if (result.length === 0) throw new ApiError('invaildOrder', 403);
		const final = result.map((value) => {
			if (value.product_details) {
				value.product_details = JSON.parse(value.product_details);
			}
			if (value.address_details) {
				value.address_details = JSON.parse(value.address_details);
			}
			if (value.payment_details) {
				value.payment_details = JSON.parse(value.payment_details);
			}
			return value;
		});
		return {
			message: app.Message('orderDetail'),
			data: app.addUrl(final, ['profile', 'shop_profile'])[0],
		};
	},
};

const checkAllProducts = async (product_id, quantity) => {
	const quantityArray = quantity.split(',');
	const products = await DB.find('products', 'all', {
		conditions: {
			status: 1,
			IN: {
				id: product_id,
			},
		},
	});
	const totalProdict = product_id.split(',');
	if (products.length !== totalProdict.length) {
		throw new ApiError(app.Message('productInvaild'), 422);
	}
	let price = 0;
	let totalQyt = 0;
	const productWithShop = {};
	const productDetails = [];
	products.forEach((value, key) => {
		const qyt = parseInt(quantityArray[key]);
		if (value.stock === 0 || qyt > value.stock) {
			throw new ApiError(app.Message('stockError'), 422);
		}
		console.log(value);
		(value.totalPrice = qyt * value.price), (value.qyt = qyt);
		if (value.image.length > 0) {
			value.image = app.ImageUrl(value.image);
		}
		if (Object.prototype.hasOwnProperty.call(productWithShop, value.shop_id)) {
			productWithShop[value.user_id][totalQyt] += parseInt(value.qyt);
			productWithShop[value.user_id][price] += parseInt(value.totalPrice);
			productWithShop[value.user_id][productDetails].push(value);
		} else {
			productWithShop[value.user_id] = {
				productDetails: [].push(value),
				totalQyt: value.qyt,
				price: value.totalPrice,
			};
		}
		console.log(productWithShop);
		console.log(Array.isArray(productWithShop[value.user_id][productDetails]));

		productDetails.push(value);
	});
	console.log(productWithShop);
	return [productDetails, productWithShop];
};

const updateProduct = async (product, qyt) => {
	const totalQty = qyt.split(',');
	product.forEach((value, key) => {
		DB.save('products', {
			id: value.id,
			stock: value.stock - totalQty[key],
		});
	});
};

const pushSend = (RequestData, productDetails) => {
	const { user_id, shop_id, order_id } = RequestData;
	saveNotification({
		user_id,
		shop_id,
		order_id,
		text: 'You have new order',
		type: 1,
	});
	Helper.sendPush(shop_id, {
		message: 'You have new order',
		data: productDetails,
		notification_code: 1,
	});
	OrderEvent.emit('orderSuccess', shop_id, RequestData);
};

const saveNotification = async (data) => {
	DB.save('notifications', data);
};

const fieldView = (latitude, longitude) => {
	return [
		'id',
		'first_name',
		'last_name',
		'min_order',
		'accept_order',
		'status',
		'is_free',
		'is_online',
		'email',
		'phone',
		'phone_code',
		'profile',
		'address',
		'user_type',
		'latitude',
		'longitude',
		'service_fees',
		'delivery_charges',
		'taxes',
		'1 as type',
		`IFNULL((select avg(rating) from ratings where  shop_id=users.id),0) as rating`,
		`round(( 6371 * acos( cos( radians(${latitude}) ) * cos( radians(latitude) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin(radians(latitude)) ) ),0) as total_distance`,
	];
};
