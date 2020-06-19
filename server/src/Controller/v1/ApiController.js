const crypto = require('crypto');
const Db = require('../../../libary/sqlBulider');
const ApiError = require('../../Exceptions/ApiError');
const { lang } = require('../../../config');
const App = require('../../../libary/CommanMethod');
const DB = new Db();

class ApiController {
	async vaildation(required, non_required) {
		try {
			let message = '';
			const empty = [];
			const table_name = required.hasOwnProperty('table_name')
				? required.table_name
				: 'users';
			for (let key in required) {
				if (required.hasOwnProperty(key)) {
					if (required[key] === undefined || required[key] === '') {
						empty.push(key);
					}
				}
			}
			if (empty.length !== 0) {
				message = empty.toString();
				if (empty.length > 1) {
					message += ' ' + lang[_Lang].fieldsRequired;
				} else {
					message += ' ' + lang[_Lang].fieldsRequired;
				}
				throw new ApiError(message, 400);
			}

			if (required.hasOwnProperty('checkexist') && required.checkexist === 1) {
				if (required.hasOwnProperty('email')) {
					if (
						await this.checkingAvailability('email', required.email, table_name)
					) {
						throw new ApiError(lang[_Lang].emailRegister);
					}
				}
				if (required.hasOwnProperty('phone')) {
					if (
						await this.checkingAvailability('phone', required.phone, table_name)
					) {
						throw new ApiError(lang[_Lang].emailRegister);
					}
				}
				if (required.hasOwnProperty('username')) {
					if (
						await this.checkingAvailability(
							'username',
							required.username,
							table_name
						)
					) {
						throw new ApiError('username already exits');
					}
				}
			}

			let final_data = Object.assign(required, non_required);

			if (final_data.hasOwnProperty('password')) {
				final_data.password = crypto
					.createHash('sha1')
					.update(final_data.password)
					.digest('hex');
			}

			if (final_data.hasOwnProperty('old_password')) {
				final_data.old_password = crypto
					.createHash('sha1')
					.update(final_data.old_password)
					.digest('hex');
			}
			if (final_data.hasOwnProperty('new_password')) {
				final_data.new_password = crypto
					.createHash('sha1')
					.update(final_data.new_password)
					.digest('hex');
			}

			for (let data in final_data) {
				if (final_data[data] === undefined) {
					delete final_data[data];
				} else {
					if (typeof final_data[data] == 'string') {
						final_data[data] = final_data[data].trim();
					}
				}
			}
			return final_data;
		} catch (err) {
			throw err;
		}
	}

	async checkingAvailability(key, value, table_name) {
		let query =
			'select * from ' +
			table_name +
			' where `' +
			key +
			"` = '" +
			value +
			"' limit 1";
		let data = await DB.first(query);
		if (data.length) {
			return true;
		} else {
			return false;
		}
	}
	async Paginations(table, condition, page, limit) {
		delete condition.limit;
		delete condition.orderBy;
		const totalRecord = await DB.find(table, 'count', condition);
		const totalPage = Math.ceil(totalRecord[0].totalRecord / limit, 0) || 1;
		return {
			currentPage: Math.round(page / limit, 0) + 1,
			totalPage,
			totalRecord: totalRecord[0].totalRecord,
			limit: parseInt(limit),
		};
	}

	async sendPush(user_id, pushObject) {
		const User = await DB.find('users', 'first', {
			conditions: {
				id: user_id,
			},
		});
		if (User.device_token) {
			pushObject['token'] = User.device_token;
			App.send_push(pushObject);
		}
	}

	async userDetails(id) {
		const result = await DB.find('users', 'first', {
			conditions: {
				id: id,
			},
			fields: [
				'id',
				'first_name',
				'last_name',
				'status',
				'is_free',
				'is_online',
				'email',
				'phone',
				'phone_code',
				'accept_order',
				'profile',
				'authorization_key',
				'dob',
				'address',
				'user_type',
				'licence',
				'latitude',
				'longitude',
				'service_fees',
				'taxes',
				'delivery_charges',
				'app_category_id',
				'min_order',
				'strip_id',
				'opening_hours',
				'card_informations',
				'language',
				'notification_on',
				'order_notification',
			],
		});
		if (result.card_informations) {
			result.card_informations = JSON.parse(result.card_informations);
		}
		if (result.opening_hours) {
			result.opening_hours = JSON.parse(result.opening_hours);
		}
		return result;
	}
}

module.exports = ApiController;
