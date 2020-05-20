const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const App = require('../../../libary/CommanMethod');
const Apis = new ApiController();
const DB = new Db();

module.exports = {
	getNotification: async (Request) => {
		let offset = Request.query.offset || 1;
		const { limit = 10 } = Request.query;
		const { id, user_type } = Request.body.userInfo;
		offset = (offset - 1) * limit;
		const condition = {
			fields: [
				'users.profile',
				'CONCAT(users.first_name, " ", users.last_name) as  name',
				'notifications.*',
			],
			limit: [offset, limit],
			orderBy: ['id desc'],
		};
		if (user_type === 1) {
			Object.assign(condition, {
				conditions: {
					user_id: id,
				},
				join: ['users on (notifications.shop_id = users.id)'],
			});
		} else if (user_type === 2) {
			Object.assign(condition, {
				conditions: {
					shop_id: id,
				},
				join: ['users on (notifications.user_id = users.id)'],
			});
		}
		const notificationList = await DB.find('notifications', 'all', condition);
		return {
			message: App.Message('notification'),
			data: {
				pagination: await Apis.Paginations(
					'notifications',
					condition,
					offset,
					limit
				),
				result: notificationList,
			},
		};
	},
	currentBalance: async (Request) => {
		const { user_id } = Request.body;
		const monthly = Request.query.monthly || false;
		let offset = Request.params.offset || 1;
		const limit = Request.query.limit || 10;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				user_id,
			},
			fields: ['IFNULL(sum(amount),0) as total_amount'],
		};
		if (JSON.parse(monthly)) {
			condition['conditions']['date'] = [
				'from_unixtime(created, "%y%m")',
				`from_unixtime(${app.currentTime}, "%y%d%m")`,
			];
		}
		const result = await DB.find('amount_transfers', 'first', condition);
		condition['fields'] = '*';
		const final = await DB.find('amount_transfers', 'all', condition);
		return {
			message: App.Message('earning'),
			data: {
				pagination: await Apis.Paginations(
					'amount_transfers',
					condition,
					offset,
					limit
				),
				total_balance: result,
				result: final,
			},
		};
	},
};
