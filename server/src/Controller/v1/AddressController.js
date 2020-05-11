const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const App = require('../../../libary/CommanMethod');
const Apis = new ApiController();
const DB = new Db();

module.exports = {
	addAddress: async (Request) => {
		const required = {
			address: Request.body.address,
			street_address: Request.body.street_address,
			city: Request.body.city,
			post_code: Request.body.post_code,
			latitude: Request.body.latitude,
			longitude: Request.body.longitude,
			user_id: Request.body.user_id,
			is_default: Request.body.is_default,
		};
		const requestData = await Apis.vaildation(required, {
			address_line_two: Request.body.address_line_two || '',
		});
		requestData.id = await DB.save('user_addresses', requestData);
		const { id, is_default, user_id } = requestData;
		if (parseInt(is_default) === 1) {
			await DB.first(
				`update user_addresses set is_default=0 where user_id= ${user_id} and id != ${id}`
			);
		}
		return {
			message: App.Message('addAddress'),
			data: requestData,
		};
	},
	deleteAddress: async (Request) => {
		const required = {
			address_id: Request.body.address_id,
			user_id: Request.body.user_id,
		};
		const requestData = await apis.vaildation(required, {});
		const { address_id, user_id } = requestData;
		const addressInfo = await this.addressDetails(address_id, user_id);
		if (!addressInfo) throw new ApiError(App.Message('InvaildAddress', 422));
		await DB.first(`delete from user_addresses where id = ${address_id}`);
		return {
			message: App.Message('AddressDelete'),
			status: 204,
		};
	},
	updateAddress: async (Request) => {
		const required = {
			user_id: Request.body.user_id,
			address_id: Request.body.address_id,
		};
		const nonRequired = {
			address: Request.body.address,
			street_address: Request.body.street_address,
			city: Request.body.city,
			post_code: Request.body.post_code,
			latitude: Request.body.latitude,
			longitude: Request.body.longitude,
			is_default: Request.body.is_default,
			address_line_two: Request.body.address_line_two,
		};
		const requestData = await Apis.vaildation(required, nonRequired);
		const { address_id, user_id, is_default = 0 } = requestData;
		const addressInfo = await this.addressDetails(address_id, user_id);
		if (!addressInfo) throw new ApiError(App.Message('InvaildAddress', 422));
		requestData.id = address_id;
		await DB.save('user_addresses', requestData);
		if (parseInt(is_default) === 1) {
			await DB.first(
				`update user_addresses set is_default=0 where user_id= ${user_id} and id != ${address_id}`
			);
		}
		return {
			message: App.Message('updateAddress'),
			data: await this.addressDetails(address_id, user_id),
		};
	},
	addressDetails: async function (id, user_id) {
		return await DB.find('user_addresses', 'first', {
			conditions: {
				id,
				user_id,
			},
		});
	},
	defaultAddressDetails: async function (user_id) {
		return await DB.find('user_addresses', 'first', {
			conditions: {
				user_id,
				is_default: 1,
			},
		});
	},
	details: async (Request) => {
		const { address_id } = Request.params;
		const { user_id } = Request.body;
		const addressInfo = await this.addressDetails(address_id, user_id);
		if (!addressInfo) throw new ApiError(App.Message('InvaildAddress', 422));
		return {
			message: App.Message('addressDetails'),
			data: addressInfo,
		};
	},
	defaultAddress: async (Request) => {
		const { user_id } = Request.body;
		return {
			message: App.Message('defualtAdress'),
			data: await this.defaultAddressDetails(user_id),
		};
	},
	allAddress: async () => {
		let offset = Request.query.offset || 1;
		const { user_id } = Request.body;
		const { limit = 10, search = '' } = Request.query;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				user_id,
			},
			limit: [offset, limit],
			orderBy: ['is_default desc'],
		};
		if (search) {
			condition.conditions[`like`] = {
				addeess: search,
				street_address: search,
			};
		}
		const addresses = await DB.find('user_addresses', 'all', condition);
		return {
			message: App.Message('addressList'),
			data: {
				pagination: await Apis.Paginations(
					'user_addresses',
					condition,
					offset,
					limit
				),
				result: addresses,
			},
		};
	},
};
