const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const App = require('../../../libary/CommanMethod');
const DB = new Db();
const Helper = new ApiController();
module.exports = {
	appCategory: async (Request) => {
		let offset = Request.query.offset || 1;
		const { limit = 10, search = '' } = Request.query;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				status: 1,
			},
			limit: [offset, limit],
			orderBy: ['name asc'],
		};
		if (search) {
			condition.conditions[`like`] = {
				name: search,
			};
		}
		const appCategory = await DB.find('app_categories', 'all', condition);
		return {
			message: App.Message('appCategory'),
			data: {
				pagination: await Helper.Paginations(
					'app_categories',
					condition,
					offset,
					limit
				),
				result: App.addUrl(appCategory, 'image'),
			},
		};
	},
	categories: async (Request) => {
		const { app_category_id = 0 } = Request.params;
		let offset = Request.query.offset || 1;
		const { limit = 10, search = '' } = Request.query;
		const { user_id = 0 } = Request.body;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				'categories.status': 1,
			},
			join: [
				'app_categories on (categories.app_category_id = app_categories.id)',
			],
			fields: [
				'categories.*',
				'app_categories.name as application_category_name',
			],
			limit: [offset, limit],
			orderBy: ['name asc'],
		};
		if (parseInt(app_category_id) !== 0) {
			condition.conditions[`app_category_id`] = app_category_id;
		}
		if (search) {
			condition.conditions[`Raw`] = [
				`(EXISTS (select name from products where name like '%${search}%' and user_id = ${user_id} and category_id=categories.id limit 1) or categories.name like '%${search}%')`,
			];
		}
		const category = await DB.find('categories', 'all', condition);
		return {
			message: App.Message('category'),
			data: {
				pagination: await Helper.Paginations(
					'categories',
					condition,
					offset,
					limit
				),
				result: App.addUrl(category, 'image'),
			},
		};
	},
	subCategories: async (Request) => {
		const { category_id } = Request.params;
		let offset = Request.query.offset || 1;
		const { limit = 10, search = '' } = Request.query;
		offset = (offset - 1) * limit;
		const condition = {
			conditions: {
				'sub_categories.status': 1,
				category_id,
			},
			join: ['categories on (categories.id = sub_categories.category_id)'],
			fields: ['sub_categories.*', 'categories.name as category_name'],
			limit: [offset, limit],
			orderBy: ['name asc'],
		};
		if (search) {
			condition.conditions[`like`] = {
				'categories.name': search,
				'sub_categories.name': search,
			};
		}
		const category = await DB.find('sub_categories', 'all', condition);
		return {
			message: App.Message('subCategory'),
			data: {
				pagination: await Helper.Paginations(
					'sub_categories',
					condition,
					offset,
					limit
				),
				result: App.addUrl(category, 'image'),
			},
		};
	},
	memberShipPlan: async () => {
		const memberShip = await DB.find('memberships', 'all', {
			conditions: {
				status: 1,
			},
		});
		return {
			message: App.Message('memberShip'),
			data: memberShip,
		};
	},
	memberShipPlan: async () => {
		const memberShip = await DB.find('memberships', 'all', {
			conditions: {
				status: 1,
			},
		});
		return {
			message: App.Message('memberShip'),
			data: App.addUrl(memberShip, 'image'),
		};
	},
	paymentType: async () => {
		const payments = await DB.find('payment_types', 'all', {
			conditions: {
				status: 1,
			},
		});
		return {
			message: App.Message('payments'),
			data: App.addUrl(payments, 'logo'),
		};
	},
	coupons: async () => {
		const coupens = await DB.first(
			`select * from coupons where start_time < ${App.currentTime} and end_time > ${App.currentTime} and is_free=1 and status=1`
		);
		return {
			message: App.Message('coupens'),
			data: coupens,
		};
	},
	gifts: async () => {
		const gifts = await DB.find('coupons', 'all', {
			condition: {
				is_free: 0,
				status: 1,
			},
		});
		return {
			message: App.Message('gifts'),
			data: gifts,
		};
	},
};
