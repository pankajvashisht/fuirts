const ApiController = require('./ApiController');
const Db = require('../../../libary/sqlBulider');
const app = require('../../../libary/CommanMethod');
let apis = new ApiController();
let DB = new Db();

module.exports = {
	allMemberShip: async (Request) => {
		let offset = Request.params.offset || 1;
		const limit = Request.params.limit || 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` where name like '%${q}%' or amount like '%${q}%'`;
		}
		const query = `select * from memberships ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from memberships ${conditions}`;
		const result = {
			pagination: await apis.Paginations(total, offset, limit),
			result: await DB.first(query, 'image'),
		};
		return result;
	},
	addMemberShipPlan: async (Request) => {
		const { body } = Request;
		if (Request.files && Request.files.image) {
			body.image = await app.upload_pic_with_await(Request.files.image);
		}
		return await DB.save('memberships', body);
	},
	allPaymentsTypes: async (Request) => {
		let offset = Request.params.offset || 1;
		const limit = Request.params.limit || 20;
		offset = (offset - 1) * limit;
		let conditions = '';
		if (Request.query.q && Request.query.q !== 'undefined') {
			const { q } = Request.query;
			conditions += ` where name like '%${q}%'`;
		}
		const query = `select * from payment_types ${conditions} order by id desc limit ${offset}, ${limit}`;
		const total = `select count(*) as total from payment_types ${conditions}`;
		const result = {
			pagination: await apis.Paginations(total, offset, limit),
			result: app.addUrl(await DB.first(query), 'logo'),
		};
		return result;
	},
	addPaymentTypes: async (Request) => {
		const { body } = Request;
		delete body.logo;
		if (Request.files && Request.files.logo) {
			body.logo = await app.upload_pic_with_await(Request.files.logo);
		}
		return await DB.save('payment_types', body);
	},
};
