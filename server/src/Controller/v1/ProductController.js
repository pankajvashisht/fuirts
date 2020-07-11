const Db = require('../../../libary/sqlBulider');
const ApiController = require('./ApiController');
const app = require('../../../libary/CommanMethod');
const ApiError = require('../../Exceptions/ApiError');
const DB = new Db();
const Helper = new ApiController();
module.exports = {
	getProduct: async (Request) => {
		let offset = Request.query.offset || 1;
		const {
			limit = 10,
			search = '',
			shop_id,
			is_feature = '',
			category_id = 0,
		} = Request.query;
		const user_id = shop_id || Request.body.user_id;
		const loginId = Request.body.user_id || 0;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				'products.status': 1,
				user_id,
			},
			join: [
				'users on (users.id = products.user_id)',
				'categories on (categories.id = products.category_id)',
			],
			fields: [
				'products.*',
				'categories.name as category_name',
				`(select count(id) from favourite_products where user_id=${loginId} and product_id=products.id) as is_fav`,
				`CONCAT(users.first_name, " ", users.last_name) as shop_name`,
				'users.address',
				'users.profile',
				'users.service_fees',
				'users.delivery_charges',
				'users.taxes',
			],
			limit: [offset, limit],
			orderBy: ['id desc'],
		};
		if (search) {
			condition.conditions[`like`] = {
				'products.name': search,
				'products.description': search,
			};
		}
		if (is_feature) {
			condition.conditions[`is_feature`] = is_feature;
		}
		if (parseInt(category_id) !== 0) {
			condition.conditions[`category_id`] = category_id;
		}
		const result = await DB.find('products', 'all', condition);
		return {
			message: app.Message('ProductListing'),
			data: {
				pagination: await Helper.Paginations(
					'products',
					condition,
					offset,
					limit
				),
				result: app.addUrl(result, ['image', 'profile']),
			},
		};
	},
	favoriteProducts: async (Request) => {
		let offset = Request.query.offset || 1;
		const { limit = 10, search = '' } = Request.query;
		const user_id = Request.body.user_id;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				'products.status': 1,
				'favourite_products.user_id': user_id,
			},
			join: [
				'products on (products.id = favourite_products.product_id)',
				'users on (users.id = products.user_id)',
			],
			fields: [
				'products.*',
				'1 as is_fav',
				`CONCAT(users.first_name, " ", users.last_name) as shop_name`,
				'users.address',
				'users.profile',
				'users.service_fees',
				'users.delivery_charges',
				'users.taxes',
			],
			limit: [offset, limit],
			orderBy: ['id desc'],
		};
		if (search) {
			condition.conditions[`like`] = {
				name: search,
				description: search,
			};
		}
		const result = await DB.find('favourite_products', 'all', condition);
		return {
			message: app.Message('ProductListing'),
			data: {
				pagination: await Helper.Paginations(
					'favourite_products',
					condition,
					offset,
					limit
				),
				result: app.addUrl(result, ['image', 'profile']),
			},
		};
	},
	doFavourite: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			product_id: Request.body.product_id,
		};
		const requestData = await Helper.vaildation(required, {});
		const { user_id, product_id } = requestData;
		const productInfo = await DB.find('products', 'first', {
			conditions: {
				id: requestData.product_id,
				status: 1,
			},
		});
		if (!productInfo) throw new ApiError(app.Message('productInvaild'), 400);
		const checkFav = await DB.find('favourite_products', 'first', {
			conditions: {
				user_id,
				product_id,
			},
		});
		let message = 'favSuccess';
		if (checkFav) {
			await DB.first(`delete from favourite_products where id =${checkFav.id}`);
			message = 'unFavSuccess';
		} else {
			await DB.save('favourite_products', requestData);
		}
		return {
			message: app.Message(message),
		};
	},
	shopProduct: async (Request) => {
		let offset = Request.query.offset || 1;
		const { limit = 20, search = '', is_feature = '' } = Request.query;
		const { shop_id } = Request.params;
		const loginId = Request.body.user_id || 0;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				'products.status': 1,
				user_id: shop_id,
			},
			join: [
				'users on (users.id = products.user_id)',
				'categories on (categories.id = products.category_id)',
			],
			fields: [
				'products.*',
				'categories.name as category_name',
				`(select count(id) from favourite_products where user_id=${loginId} and product_id=products.id) as is_fav`,
				`CONCAT(users.first_name, " ", users.last_name) as shop_name`,
				'users.address',
				'users.profile',
				'users.service_fees',
				'users.delivery_charges',
				'users.taxes',
			],
			limit: [offset, limit],
			orderBy: ['id desc'],
		};
		if (search) {
			condition.conditions[`like`] = {
				name: search,
				description: search,
			};
		}
		if (is_feature) {
			condition.conditions[`is_feature`] = is_feature;
		}
		const result = await DB.find('products', 'all', condition);
		const newConditions = { ...condition };
		newConditions.conditions[`is_feature`] = 1;
		newConditions.limit = 10;
		const feature = await DB.find('products', 'all', newConditions);
		return {
			message: app.Message('ProductListing'),
			data: {
				pagination: await Helper.Paginations(
					'products',
					condition,
					offset,
					limit
				),
				result: {
					featureProduct: app.addUrl(feature, ['image', 'profile']),
					products: app.addUrl(result, ['image', 'profile']),
				},
			},
		};
	},

	addProduct: async (Request) => {
		const required = {
			name: Request.body.name,
			category_id: Request.body.category_id,
			sub_category_id: Request.body.sub_category_id || 0,
			price: Request.body.price,
			stock: Request.body.stock,
			description: Request.body.description,
			user_id: Request.body.user_id,
			is_feature: Request.body.is_feature || 0,
		};
		const requestData = await Helper.vaildation(required, {});
		const categoryInfo = await DB.find('categories', 'first', {
			conditions: {
				id: requestData.category_id,
				status: 1,
			},
		});
		if (!categoryInfo) throw new ApiError(app.Message('categoryNotFound'), 400);
		if (Request.files && Request.files.image) {
			requestData.image = await app.upload_pic_with_await(Request.files.image);
		} else {
			throw new ApiError(app.Message('imageRequired'), 422);
		}
		requestData.id = await DB.save('products', requestData);
		return {
			message: app.Message('productAdd'),
			data: requestData,
		};
	},
	productDetails: async (Request) => {
		const product_id = Request.params.product_id;
		const loginId = Request.body.user_id || 0;
		const product_info = await DB.find('products', 'first', {
			conditions: {
				'products.id': product_id,
			},
			join: ['users on (users.id = products.user_id)'],
			fields: [
				'products.*',
				`(select count(id) from favourite_products where user_id=${loginId} and product_id=products.id) as is_fav`,
				`CONCAT(users.first_name, " ", users.last_name) as shop_name`,
				'users.address',
				'users.profile',
				'users.service_fees',
				'users.delivery_charges',
				'users.taxes',
			],
		});
		if (!product_info) throw new ApiError(app.Message('productInvaild'), 400);
		if (product_info.image) {
			product_info.image = app.ImageUrl(product_info.image);
		}
		if (product_info.profile) {
			product_info.profile = app.ImageUrl(product_info.profile);
		}
		return {
			message: app.Message('productDetail'),
			data: product_info,
		};
	},
	updateProduct: async (Request) => {
		const required = {
			product_id: Request.body.product_id,
		};
		const nonRequired = {
			name: Request.body.name,
			category_id: Request.body.category_id,
			price: Request.body.price,
			stock: Request.body.stock,
			description: Request.body.description,
			is_feature: Request.body.is_feature,
			user_id: Request.body.user_id,
		};
		const requestData = await Helper.vaildation(required, nonRequired);
		const product_info = await DB.find('products', 'first', {
			conditions: {
				user_id: requestData.user_id,
				id: requestData.product_id,
			},
		});
		if (!product_info) throw new ApiError(app.Message('productInvaild'), 400);
		requestData.id = requestData.product_id;
		if (Request.files && Request.files.image) {
			requestData.image = await app.upload_pic_with_await(Request.files.image);
		}
		requestData.id = await DB.save('products', requestData);
		return {
			message: app.Message('productUpdate'),
			data: requestData,
		};
	},
	deleteProduct: async (Request) => {
		const required = {
			product_id: Request.body.product_id,
			user_id: Request.body.user_id,
		};
		const requestData = await Helper.vaildation(required, {});
		const product_info = await DB.find('products', 'first', {
			conditions: {
				user_id: requestData.user_id,
				id: requestData.product_id,
			},
		});
		if (!product_info) throw new ApiError(app.Message('productInvaild'), 400);
		await DB.first(`delete from products where id = ${requestData.product_id}`);
		return {
			message: 'Product delete successfully',
			status: 204,
		};
	},
	OrderAccept: async (Request) => {
		const required = {
			order_id: Request.body.order_id,
			shop_id: Request.body.user_id,
			order_status: Request.body.order_status,
		};
		const requestData = await Helper.vaildation(required, {});
		const order_info = await DB.find('orders', 'first', {
			conditions: {
				shop_id: requestData.shop_id,
				id: requestData.order_id,
			},
		});
		if (!order_info) throw new ApiError(app.Message('InvaildOrder'), 400);
		const { order_id, order_status } = requestData;
		let message = 'Order Accepted Successfully';
		let pushMessage = `order accepted by shop`;
		const updateOrderStatus = {
			id: order_id,
		};
		const data = {};
		if (parseInt(order_status) === 1) {
			//const { latitude, longitude } = Request.body.userInfo;
			// const driver = await findDriver(latitude, longitude);
			// if (!driver) throw new ApiError('No Driver Found', 400);
			updateOrderStatus.order_status = 1;
			//updateOrderStatus.driver_id = driver.id;
			// if (driver.profile) {
			// 	driver.profile = appURL + 'uploads/' + driver.profile;
			// }
			// updateOrderStatus.driver_info = JSON.stringify(driver);
			// DB.save('users', {
			// 	id: driver.id,
			// 	is_free: 0,
			// });
			// data.driver_info = driver;
			// data.order_info = order_info;
		} else {
			updateOrderStatus.order_status = 2;
			pushMessage = `order rejected by shop`;
			message = 'Order Rejeted';
		}
		DB.save('orders', updateOrderStatus);
		setTimeout(() => {
			Helper.sendPush(order_info.user_id, {
				message: pushMessage,
				data: order_info,
				notification_code: 3,
			});
			if (requestData.driver_id) {
				Helper.sendPush(requestData.driver_id, {
					message: `you have new order to deliver`,
					data: order_info,
					notification_code: 4,
				});
			}
			saveNotification({
				user_id: order_info.user_id,
				order_id: order_info.id,
				shop_id: order_info.shop_id,
				text: pushMessage,
				type: 3,
			});
		}, 100);
		return {
			message,
			data,
		};
	},
};

const findDriver = async (latitude, longitude) => {
	const driver = `select id,name,email,phone,phone_code,profile from users where user_type = 3 and ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians(latitude) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin(radians(latitude)) ) ) < 10
	and is_online = 1 and is_free=1 limit 1`;
	const result = await DB.first(driver);
	if (result.length > 0) return result[0];
	return null;
};

const saveNotification = async (data) => {
	DB.save('notifications', data);
};
