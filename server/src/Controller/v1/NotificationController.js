const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const App = require('../../../libary/CommanMethod');
const Apis = new ApiController();
const DB = new Db();

module.exports = {
	getNotification: async (Request) => {
		let offset = Request.query.offset || 1;
		const { limit = 10 } = Request.query;
		const user_id = Request.body.user_id;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				user_id,
			},
			limit: [offset, limit],
			orderBy: ['id desc'],
		};
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
